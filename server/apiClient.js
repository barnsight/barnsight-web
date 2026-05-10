const API_BASE_URL = process.env.BARNSIGHT_API_BASE_URL || "https://barnsight-api-t8fr.onrender.com";

function buildUrl(path, query = undefined) {
  const url = new URL(path, API_BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      const normalized = String(value).trim();
      if (!normalized || normalized === "undefined" || normalized === "null") continue;
      url.searchParams.set(key, normalized);
    }
  }
  return url;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

function mapValidationDetails(detail) {
  if (!Array.isArray(detail)) return [];
  return detail.map((entry) => ({
    field: Array.isArray(entry?.loc) ? entry.loc.join(".") : null,
    message: entry?.msg || "Validation error",
    type: entry?.type || "validation_error",
  }));
}

export function normalizeApiError({ status, path, data }) {
  const validation = mapValidationDetails(data?.detail);
  const message =
    data?.message ||
    (typeof data?.detail === "string" ? data.detail : null) ||
    data?.detail?.message ||
    (validation.length > 0 ? "Помилка валідації запиту." : "Запит до BarnSight API завершився помилкою.");

  return {
    message,
    status,
    endpoint: path,
    details: validation.length > 0 ? validation : undefined,
    upstream: data ?? null,
  };
}

export async function loginWithPassword(username, password) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const response = await fetch(buildUrl("/api/v1/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await parseResponse(response);
  return {
    ok: response.ok,
    status: response.status,
    data,
    error: response.ok ? null : normalizeApiError({ status: response.status, path: "/api/v1/auth/login", data }),
  };
}

export async function registerAccount({ accountType, token, payload }) {
  const endpointByType = {
    admin: "/api/v1/admin",
    farmers: "/api/v1/farmers",
    staff: "/api/v1/staff",
  };
  const path = endpointByType[accountType];
  if (!path) {
    return {
      ok: false,
      status: 400,
      data: null,
      error: normalizeApiError({
        status: 400,
        path: "/api/v1/register",
        data: { message: "Невідомий тип акаунта для реєстрації." },
      }),
    };
  }

  return callApi({ path, method: "POST", token, body: payload });
}

export async function callApi({ path, method = "GET", token, apiKey, query, body }) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["access-token"] = token;
    headers["token-type"] = "bearer";
  }

  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  if (body !== undefined && body !== null) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponse(response);
  return {
    ok: response.ok,
    status: response.status,
    data,
    error: response.ok ? null : normalizeApiError({ status: response.status, path, data }),
  };
}

/* ------------------------------------------------------------------ */
/* Resilient events fetcher                                            */
/*                                                                     */
/* The upstream API has a Pydantic validator that requires             */
/* `image_snapshot` to be valid base64. Some legacy events store full  */
/* Cloudinary URLs in that field, which makes the entire response_     */
/* model validation fail and FastAPI returns HTTP 500. We can't change */
/* the upstream API, so we recover here using time-window bisection:   */
/* split the requested [start_time, end_time] in half, try both halves */
/* recursively, drop windows that shrink below 1 second.               */
/* ------------------------------------------------------------------ */

const EVENTS_PATH = "/api/v1/events";
const EVENTS_VALIDATION_HINT = /image_snapshot must be valid base64/i;
const ABSOLUTE_FLOOR_ISO = "2000-01-01T00:00:00.000Z";
const MIN_WINDOW_MS = 1000;
const MAX_BISECT_DEPTH = 32;

function isImageSnapshotError(result) {
  if (!result || result.ok) return false;
  if (result.status !== 500 && result.status !== 422) return false;
  try {
    const haystack = JSON.stringify(result.data ?? result.error ?? {});
    return EVENTS_VALIDATION_HINT.test(haystack);
  } catch {
    return false;
  }
}

function toEventsArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.events)) return payload.events;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

function dedupeEvents(events) {
  const seen = new Set();
  const unique = [];
  for (const event of events) {
    const id = event?._id || event?.id || event?.event_id || `${event?.timestamp || ""}|${event?.camera_id || ""}`;
    if (seen.has(id)) continue;
    seen.add(id);
    unique.push(event);
  }
  return unique;
}

async function bisectEvents({ token, apiKey, baseQuery, startMs, endMs, depth, skipped }) {
  if (depth > MAX_BISECT_DEPTH) {
    skipped.windows += 1;
    return [];
  }

  const startIso = new Date(startMs).toISOString();
  const endIso = new Date(endMs).toISOString();

  const result = await callApi({
    path: EVENTS_PATH,
    method: "GET",
    token,
    apiKey,
    query: { ...baseQuery, start_time: startIso, end_time: endIso },
  });

  if (result.ok) return toEventsArray(result.data);

  if (!isImageSnapshotError(result)) {
    skipped.windows += 1;
    return [];
  }

  if (endMs - startMs <= MIN_WINDOW_MS) {
    skipped.windows += 1;
    skipped.records += 1;
    return [];
  }

  const midMs = Math.floor((startMs + endMs) / 2);
  const [later, earlier] = await Promise.all([
    bisectEvents({ token, apiKey, baseQuery, startMs: midMs, endMs, depth: depth + 1, skipped }),
    bisectEvents({ token, apiKey, baseQuery, startMs, endMs: midMs, depth: depth + 1, skipped }),
  ]);

  return [...later, ...earlier];
}

export async function fetchEventsResilient({ token, apiKey, query }) {
  const direct = await callApi({ path: EVENTS_PATH, method: "GET", token, apiKey, query });
  if (direct.ok) {
    return { ...direct, partial: false, skippedWindows: 0 };
  }
  if (!isImageSnapshotError(direct)) {
    return { ...direct, partial: false };
  }

  const baseQuery = { ...(query || {}) };
  delete baseQuery.start_time;
  delete baseQuery.end_time;
  delete baseQuery.cursor;

  const requestedLimit = Number(query?.limit);
  const limitForChunks = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(Math.max(Math.ceil(requestedLimit / 4), 25), 200)
    : 100;
  baseQuery.limit = String(limitForChunks);

  const startMs = Date.parse(query?.start_time || ABSOLUTE_FLOOR_ISO) || Date.parse(ABSOLUTE_FLOOR_ISO);
  const endMs = Date.parse(query?.end_time) || Date.now();
  if (!(endMs > startMs)) {
    return { ...direct, partial: false };
  }

  const skipped = { windows: 0, records: 0 };
  const collected = await bisectEvents({
    token,
    apiKey,
    baseQuery,
    startMs,
    endMs,
    depth: 0,
    skipped,
  });

  const unique = dedupeEvents(collected).sort((a, b) => {
    const ta = Date.parse(a?.timestamp) || 0;
    const tb = Date.parse(b?.timestamp) || 0;
    return tb - ta;
  });

  const limited = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? unique.slice(0, requestedLimit)
    : unique;

  return {
    ok: true,
    status: 200,
    data: {
      events: limited,
      total: limited.length,
      next_cursor: null,
      partial: skipped.windows > 0,
      skipped_windows: skipped.windows,
      recovered_from_validation_error: true,
    },
    error: null,
    partial: skipped.windows > 0,
    skippedWindows: skipped.windows,
  };
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
