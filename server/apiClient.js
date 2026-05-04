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

export function getApiBaseUrl() {
  return API_BASE_URL;
}
