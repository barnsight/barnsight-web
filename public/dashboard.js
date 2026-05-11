const locale = window.APP_LOCALE === "en" ? "en" : "uk";
const role = window.BARNSIGHT_ROLE || "user";

const messages = {
  en: {
    requestError: "Request error.",
    noEvents: "No events found.",
    noBarns: "No barns available.",
    noDevices: "No devices available.",
    noCameras: "No cameras available.",
    noZones: "No zones available.",
    noCoworkers: "No coworkers available.",
    noApiKeys: "No API keys yet.",
    noCalendarEvents: "No events for this day.",
    noAnalytics: "No analytics data for the selected period.",
    saved: "Saved.",
    created: "Created.",
    deleted: "Deleted.",
    loading: "Loading…",
    loaded: "Data loaded.",
    applyError: "Could not refresh the selected period.",
    chooseDates: "Choose start and end dates.",
    userFallback: "User",
    badJson: "Invalid JSON response from server.",
    apiKeyCreated: "API key created. Save the raw key now:",
    username: "Username",
    email: "Email",
    role: "Role",
    assignedBarns: "Assigned barns",
    edgeKey: "Edge key",
    delete: "Delete",
    barn: "Barn",
    location: "Location",
    description: "Description",
    account: "Account",
    device: "Device",
    unknown: "unknown",
    camera: "Camera",
    zone: "Zone",
    disabled: "disabled",
    enabled: "enabled",
    detections: "Detections",
    highRiskZones: "High-risk zones",
    trend: "Trend",
    eventsShort: "evt",
    devicesCount: "Devices",
    apiKeysCount: "API keys",
    loadedCount: "Data loaded",
    unavailable: "unavailable",
  },
  uk: {
    requestError: "Помилка запиту.",
    noEvents: "Події не знайдено.",
    noBarns: "Господарств немає.",
    noDevices: "Пристроїв немає.",
    noCameras: "Камер немає.",
    noZones: "Зон немає.",
    noCoworkers: "Співробітників немає.",
    noApiKeys: "API-ключів ще немає.",
    noCalendarEvents: "Для цього дня подій немає.",
    noAnalytics: "Для вибраного періоду немає аналітики.",
    saved: "Збережено.",
    created: "Створено.",
    deleted: "Видалено.",
    loading: "Завантаження…",
    loaded: "Дані завантажено.",
    applyError: "Не вдалося оновити вибраний період.",
    chooseDates: "Оберіть початкову і кінцеву дати.",
    userFallback: "Користувач",
    badJson: "Некоректна JSON-відповідь від сервера.",
    apiKeyCreated: "API-ключ створено. Збережіть raw key зараз:",
    username: "Логін",
    email: "Email",
    role: "Роль",
    assignedBarns: "Призначені господарства",
    edgeKey: "Edge-ключ",
    delete: "Видалити",
    barn: "Господарство",
    location: "Локація",
    description: "Опис",
    account: "Акаунт",
    device: "Пристрій",
    unknown: "невідомо",
    camera: "Камера",
    zone: "Зона",
    disabled: "вимкнено",
    enabled: "увімкнено",
    detections: "Детекції",
    highRiskZones: "Зони високого ризику",
    trend: "Тренд",
    eventsShort: "под.",
    devicesCount: "Пристрої",
    apiKeysCount: "API-ключі",
    loadedCount: "Дані завантажено",
    unavailable: "недоступно",
  },
}[locale];

const state = {
  currentTab: "overview",
  me: null,
  barns: [],
  devices: [],
  apiKeys: [],
  events: [],
  analytics: null,
  report: null,
  adminDashboard: null,
  coworkers: {
    admins: [],
    farmers: [],
    staff: [],
  },
  currentCoworkerRole: "admins",
  cameras: [],
  zones: [],
  currentMonth: new Date(),
  selectedCalendarDate: null,
};

function el(id) {
  return document.getElementById(id);
}

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const normalized = String(value).trim();
    if (!normalized) return;
    query.set(key, normalized);
  });
  return query.toString();
}

function setText(id, value) {
  const node = el(id);
  if (node) node.textContent = value;
}

function formatApiError(error) {
  return error?.message || messages.requestError;
}

function formatTimestamp(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "uk-UA", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDateOnly(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "uk-UA", {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function toDateKey(value) {
  const date = new Date(value);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function toImageSrc(snapshot) {
  if (!snapshot || typeof snapshot !== "string") return null;
  const trimmed = snapshot.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:image/")) return trimmed;
  const isPng = trimmed.startsWith("iVBOR");
  return `data:image/${isPng ? "png" : "jpeg"};base64,${trimmed}`;
}

async function apiRequest({ path, method = "GET", query = "", body, apiKey, expectText = false }) {
  const target = path === "/metrics" ? `/app/api/metrics${query ? `?${query}` : ""}` : `/app/api/v1${path}${query ? `?${query}` : ""}`;
  const headers = {};
  if (apiKey) headers["x-edge-api-key"] = apiKey;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(target, {
    method,
    headers,
    credentials: "include",
    body: ["GET", "HEAD"].includes(method) ? undefined : JSON.stringify(body ?? {}),
  });

  const text = await response.text();
  let data = text;
  if (!expectText) {
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: messages.badJson };
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function normalizeListResponse(response, keys = []) {
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }
  return Array.isArray(response) ? response : [];
}

function setActiveTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll(".dashboard-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tab);
  });
  document.querySelectorAll(".dashboard-panel").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.tabPanel !== tab);
  });
}

function setFiltersStatus(text, tone = "neutral") {
  const node = el("filtersStatus");
  node.textContent = text;
  node.className =
    tone === "error"
      ? "mt-3 text-xs text-[rgb(var(--danger))]"
      : tone === "success"
        ? "mt-3 text-xs text-[rgb(var(--ok))]"
        : "mt-3 text-xs text-ink-mute";
}

function setStatus(id, text, tone = "neutral") {
  const node = el(id);
  if (!node) return;
  node.textContent = text;
  node.className =
    tone === "error"
      ? "text-xs text-[rgb(var(--danger))]"
      : tone === "success"
        ? "text-xs text-[rgb(var(--ok))]"
        : "text-xs text-ink-mute";
}

function renderProfile() {
  if (!state.me) return;
  const barns = Array.isArray(state.me.barns) ? state.me.barns : [];
  const summary = [
    [messages.username, state.me.username || "—"],
    [messages.email, state.me.email || "—"],
    [messages.role, role],
    [messages.assignedBarns, barns.length ? barns.map((barn) => barn.name || barn.barn_id || barn.id).join(", ") : "—"],
  ];
  el("profileSummary").innerHTML = summary
    .map(
      ([label, value]) => `
        <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-ink-mute">${label}</p>
          <p class="mt-2 font-display text-xl font-semibold text-ink break-all">${value}</p>
        </article>
      `,
    )
    .join("");

  el("profileFirstName").value = state.me.first_name || "";
  el("profileMiddleName").value = state.me.middle_name || "";
  el("profileLastName").value = state.me.last_name || "";
  el("profileEmail").value = state.me.email || "";
  el("recoveryEmail").value = state.me.email || "";
}

function renderApiKeys() {
  const root = el("apiKeysList");
  if (!state.apiKeys.length) {
    root.innerHTML = `<p class="text-sm text-ink-soft">${messages.noApiKeys}</p>`;
    return;
  }

  root.innerHTML = state.apiKeys
    .map((item) => {
      const id = item._id || item.id || item.key_id;
      return `
        <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-display text-lg font-semibold text-ink">${item.name || messages.edgeKey}</p>
              <p class="mt-1 font-mono text-xs text-ink-mute break-all">${id || "—"}</p>
              <p class="mt-1 text-xs text-ink-mute">${formatTimestamp(item.created_at)}</p>
            </div>
            <button type="button" class="btn-secondary api-key-delete" data-key-id="${id}">${messages.delete}</button>
          </div>
        </article>
      `;
    })
    .join("");

  root.querySelectorAll(".api-key-delete").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        await apiRequest({ path: `/api-keys/${encodeURIComponent(button.dataset.keyId)}`, method: "DELETE" });
        setStatus("apiKeyCreateStatus", messages.deleted, "success");
        await loadApiKeys();
      } catch (error) {
        setStatus("apiKeyCreateStatus", formatApiError(error), "error");
      } finally {
        button.disabled = false;
      }
    });
  });
}

function renderBarns() {
  const root = el("barnsList");
  if (!state.barns.length) {
    root.innerHTML = `<p class="text-sm text-ink-soft">${messages.noBarns}</p>`;
    return;
  }
  root.innerHTML = state.barns
    .map((barn) => `
      <article class="rounded-[14px_28px_18px_30px] border border-edge/45 bg-paper-warm/72 p-5 shadow-panel">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-ink-mute">${messages.barn}</p>
            <h3 class="mt-2 font-display text-xl font-semibold text-ink">${barn.name || `${messages.barn} ${barn.barn_id || barn.id || ""}`}</h3>
          </div>
          <span class="rounded-[10px_18px_12px_20px] bg-hay/40 px-3 py-1 font-mono text-xs font-semibold text-ochre-deep">${barn.barn_id || barn.id || "—"}</span>
        </div>
        <div class="mt-4 grid gap-2 text-sm text-ink-soft">
          <p><span class="font-medium text-ink">${messages.location}:</span> ${barn.location || "—"}</p>
          <p><span class="font-medium text-ink">${messages.description}:</span> ${barn.description || "—"}</p>
          <p><span class="font-medium text-ink">${messages.account}:</span> ${barn.account_id || "—"}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderDevices() {
  const root = el("devicesList");
  if (!state.devices.length) {
    root.innerHTML = `<p class="text-sm text-ink-soft">${messages.noDevices}</p>`;
    return;
  }
  root.innerHTML = state.devices
    .map((device) => {
      const status = (device.status || "unknown").toLowerCase();
      const statusClass = status === "online"
        ? "bg-[rgb(var(--ok))] text-paper"
        : status === "offline"
          ? "bg-ink/85 text-paper"
          : "bg-edge/55 text-ink";
      return `
      <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-display text-lg font-semibold text-ink">${device.name || device.device_id || messages.device}</p>
            <p class="mt-1 font-mono text-xs text-ink-mute">${device.device_id || "—"}</p>
          </div>
          <span class="rounded-[10px_18px_12px_20px] px-3 py-1 text-xs font-semibold ${statusClass}">${device.status || messages.unknown}</span>
        </div>
        <div class="mt-3 grid gap-1 text-sm text-ink-soft">
          <p><span class="font-medium text-ink">${messages.barn}:</span> ${device.barn_id || "—"}</p>
          <p><span class="font-medium text-ink">${messages.location}:</span> ${device.location || "—"}</p>
        </div>
      </article>
    `;
    })
    .join("");
}

function renderCamerasAndZones() {
  const camerasRoot = el("camerasList");
  const zonesRoot = el("zonesList");
  camerasRoot.innerHTML = state.cameras.length
    ? state.cameras
        .map((camera) => `
          <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
            <p class="font-display text-lg font-semibold text-ink">${camera.name || camera.camera_id || messages.camera}</p>
            <p class="mt-1 font-mono text-xs text-ink-mute">${camera.camera_id || "—"}</p>
            <p class="mt-3 text-sm text-ink-soft">${messages.barn} ${camera.barn_id || "—"} · ${messages.device} ${camera.device_id || "—"} · ${camera.status || messages.unknown}</p>
          </article>
        `)
        .join("")
    : `<p class="text-sm text-ink-soft">${messages.noCameras}</p>`;

  zonesRoot.innerHTML = state.zones.length
    ? state.zones
        .map((zone) => `
          <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
            <p class="font-display text-lg font-semibold text-ink">${zone.label || zone.zone_id || messages.zone}</p>
            <p class="mt-1 font-mono text-xs text-ink-mute">${zone.zone_id || "—"}</p>
            <p class="mt-3 text-sm text-ink-soft">${messages.camera} ${zone.camera_id || "—"} · ${messages.barn} ${zone.barn_id || "—"} · ${zone.enabled === false ? messages.disabled : messages.enabled}</p>
          </article>
        `)
        .join("")
    : `<p class="text-sm text-ink-soft">${messages.noZones}</p>`;
}

function renderEventsNotice() {
  const node = el("eventsNotice");
  if (!node) return;
  const meta = state.eventsMeta || {};
  if (!meta.partial) {
    node.classList.add("hidden");
    node.innerHTML = "";
    return;
  }
  node.classList.remove("hidden");
  node.className = "notice is-warn mt-3";
  const skipped = meta.skippedWindows || 0;
  const detail = locale === "uk"
    ? `Деякі історичні події містять некоректне поле <code>image_snapshot</code> (URL замість base64), тому API не зміг їх повернути. Показано лише валідні записи${skipped ? ` · пропущено вікон: ${skipped}` : ""}.`
    : `Some historical events store an <code>image_snapshot</code> URL instead of base64, so the API rejected them. Only valid records are shown${skipped ? ` · skipped windows: ${skipped}` : ""}.`;
  node.innerHTML = detail;
}

function renderEvents(events = state.events) {
  const root = el("eventsList");
  renderEventsNotice();
  if (!events.length) {
    root.innerHTML = `<p class="text-sm text-ink-mute">${messages.noEvents}</p>`;
    return;
  }
  root.innerHTML = events
    .map((event) => {
      const imageSrc = toImageSrc(event.image_snapshot);
      const conf = typeof event.confidence === "number"
        ? `${Math.round(event.confidence * 100)}%`
        : (event.confidence ?? "—");
      return `
        <article class="rounded-[14px_28px_18px_30px] border border-edge/45 bg-paper-warm/72 p-4 shadow-panel">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-mono text-xs uppercase tracking-[0.18em] text-ink-mute">${event.camera_id || `${messages.camera}?`}</p>
              <p class="mt-1 text-sm font-semibold text-ink">${formatTimestamp(event.timestamp)}</p>
            </div>
            <span class="rounded-[10px_18px_12px_20px] bg-hay/40 px-3 py-1 text-xs font-semibold text-ochre-deep">${conf}</span>
          </div>
          ${imageSrc ? `<img src="${imageSrc}" alt="${locale === "uk" ? "Знімок детекції" : "Detection snapshot"}" class="mt-3 h-40 w-full rounded-[10px_18px_12px_20px] border border-edge/45 object-cover" loading="lazy" />` : ""}
          <div class="mt-3 grid gap-1 text-xs text-ink-soft">
            <p><span class="font-medium text-ink">${messages.device}:</span> ${event.device_id || "—"}</p>
            <p><span class="font-medium text-ink">${messages.barn}:</span> ${event.barn_id || "—"}</p>
            <p><span class="font-medium text-ink">ID:</span> <span class="font-mono">${event._id || "—"}</span></p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAnalytics() {
  const chart = el("analyticsChart");
  const highlights = el("analyticsHighlights");
  const emptyState = el("analyticsEmptyState");
  const series = Array.isArray(state.analytics?.daily_summary) ? state.analytics.daily_summary : [];

  if (!series.length) {
    chart.innerHTML = "";
    highlights.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  const normalized = series.map((item, index) => {
    const label = String(item.date || item.day || index + 1).slice(5);
    const events = Number(item.event_count ?? item.count ?? item.total ?? 0);
    const confidence = Number(item.avg_confidence ?? item.average_confidence ?? item.confidence ?? 0);
    return { label, events, confidence };
  });

  const maxEvents = Math.max(...normalized.map((item) => item.events), 1);
  const maxConfidence = Math.max(...normalized.map((item) => item.confidence), 1);

  chart.innerHTML = normalized
    .map(
      (item) => `
        <div class="flex min-h-[220px] flex-col justify-end gap-3 rounded-[10px_18px_12px_20px] bg-paper-warm/75 p-3">
          <div class="flex flex-1 items-end gap-2">
            <div class="flex-1 rounded-t-xl bg-ochre/85" style="height:${Math.max(10, (item.events / maxEvents) * 100)}%"></div>
            <div class="flex-1 rounded-t-xl bg-ink/80" style="height:${Math.max(10, (item.confidence / maxConfidence) * 100)}%"></div>
          </div>
          <div class="text-center">
            <p class="font-mono text-xs font-semibold text-ink">${item.label}</p>
            <p class="text-[11px] text-ink-mute">${item.events} / ${item.confidence}</p>
          </div>
        </div>
      `,
    )
    .join("");

  const detections = Number(state.report?.total_detections ?? 0);
  const zones = Array.isArray(state.report?.high_risk_zones) ? state.report.high_risk_zones.length : 0;
  const trend = state.analytics?.trend || state.report?.trend || "—";

  highlights.innerHTML = [
    [messages.detections, detections],
    [messages.highRiskZones, zones],
    [messages.trend, trend],
  ]
    .map(
      ([label, value]) => `
        <article class="rounded-[10px_18px_12px_20px] border border-edge/45 bg-paper-warm/65 p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-ink-mute">${label}</p>
          <p class="mt-2 font-display text-3xl font-bold text-ink">${value}</p>
        </article>
      `,
    )
    .join("");

  setText("trend", trend);
}

function renderCalendar() {
  const monthDate = new Date(Date.UTC(state.currentMonth.getUTCFullYear(), state.currentMonth.getUTCMonth(), 1));
  const label = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "uk-UA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(monthDate);
  setText("calendarLabel", label);

  const eventsByDay = new Map();
  state.events.forEach((event) => {
    const key = toDateKey(event.timestamp);
    if (!eventsByDay.has(key)) eventsByDay.set(key, []);
    eventsByDay.get(key).push(event);
  });

  const firstDay = (monthDate.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) {
    cells.push(`<div class="min-h-[76px] rounded-2xl border border-transparent bg-transparent"></div>`);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${monthDate.getUTCFullYear()}-${String(monthDate.getUTCMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const count = (eventsByDay.get(key) || []).length;
    const active = state.selectedCalendarDate === key;
    cells.push(`
      <button type="button" class="calendar-day min-h-[76px] rounded-[10px_18px_12px_20px] border px-3 py-2 text-left transition ${active ? "border-ochre bg-hay/55 shadow-panel" : "border-edge/45 bg-paper-warm/72 hover:border-ochre/55 hover:bg-paper-warm"}" data-date="${key}">
        <span class="text-sm font-semibold text-ink">${day}</span>
        <span class="mt-2 block text-xs text-ink-mute">${count ? `${count} ${messages.eventsShort}` : "—"}</span>
      </button>
    `);
  }
  el("calendarGrid").innerHTML = cells.join("");
  document.querySelectorAll(".calendar-day").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCalendarDate = button.dataset.date;
      renderCalendar();
      renderSelectedDay();
    });
  });

  if (!state.selectedCalendarDate && state.events.length) {
    state.selectedCalendarDate = toDateKey(state.events[0].timestamp);
  }
  renderSelectedDay();
}

function renderSelectedDay() {
  setText("calendarSelectedDate", formatDateOnly(state.selectedCalendarDate));
  const list = el("calendarEventList");
  const items = state.events.filter((event) => toDateKey(event.timestamp) === state.selectedCalendarDate);
  list.innerHTML = items.length
    ? items
        .slice(0, 6)
        .map(
          (event) => {
            const conf = typeof event.confidence === "number"
              ? `${Math.round(event.confidence * 100)}%`
              : (event.confidence ?? "—");
            return `
            <article class="rounded-[10px_18px_12px_20px] border border-edge/45 bg-paper-warm/72 p-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-mono text-sm font-semibold text-ink">${event.camera_id || `${messages.camera}?`}</p>
                  <p class="mt-1 text-xs text-ink-mute">${formatTimestamp(event.timestamp)}</p>
                </div>
                <span class="rounded-[8px_14px_10px_16px] bg-ink/90 px-2 py-1 text-[11px] font-semibold text-paper">${conf}</span>
              </div>
              <p class="mt-2 text-xs text-ink-soft">${messages.barn} ${event.barn_id || "—"} · ${messages.device} ${event.device_id || "—"}</p>
            </article>
          `;
          },
        )
        .join("")
    : `<p class="text-sm text-ink-soft">${messages.noCalendarEvents}</p>`;
}

function renderAdmin() {
  if (role !== "admins") return;
  setText("adminAdminsCount", String(state.coworkers.admins.length));
  setText("adminFarmersCount", String(state.coworkers.farmers.length));
  setText("adminStaffCount", String(state.coworkers.staff.length));
  setText("adminEventsCount", String(state.adminDashboard?.events?.total ?? state.events.length ?? 0));

  const items = state.coworkers[state.currentCoworkerRole] || [];
  const root = el("coworkersList");
  if (!items.length) {
    root.innerHTML = `<p class="text-sm text-ink-soft">${messages.noCoworkers}</p>`;
    return;
  }
  root.innerHTML = items
    .map(
      (user) => `
        <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-display text-lg font-semibold text-ink">${user.first_name || ""} ${user.last_name || ""}</p>
              <p class="mt-1 text-sm text-ink-soft">${user.username || "—"}</p>
              <p class="mt-1 text-xs text-ink-mute">${user.email || "—"}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <select class="field coworker-role-select" data-username="${user.username}" style="width:auto">
                <option value="admins" ${user.role === "admins" ? "selected" : ""}>admins</option>
                <option value="farmers" ${user.role === "farmers" ? "selected" : ""}>farmers</option>
                <option value="staff" ${user.role === "staff" ? "selected" : ""}>staff</option>
              </select>
              <button type="button" class="btn-secondary coworker-delete" data-username="${user.username}">${messages.delete}</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  root.querySelectorAll(".coworker-role-select").forEach((select) => {
    select.addEventListener("change", async () => {
      try {
        await apiRequest({
          path: `/admin/users/${encodeURIComponent(select.dataset.username)}/role`,
          method: "PATCH",
          body: { new_role: select.value },
        });
        setStatus("coworkerStatus", messages.saved, "success");
        await loadAdminData();
      } catch (error) {
        setStatus("coworkerStatus", formatApiError(error), "error");
      }
    });
  });

  root.querySelectorAll(".coworker-delete").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await apiRequest({ path: `/users/${encodeURIComponent(button.dataset.username)}`, method: "DELETE" });
        setStatus("coworkerStatus", messages.deleted, "success");
        await loadAdminData();
      } catch (error) {
        setStatus("coworkerStatus", formatApiError(error), "error");
      }
    });
  });
}

async function loadProfile() {
  state.me = await apiRequest({ path: "/user/me" });
  const fullName = [state.me.first_name, state.me.middle_name, state.me.last_name].filter(Boolean).join(" ") || state.me.username || messages.userFallback;
  setText("meName", fullName);
  setText("meUsername", state.me.username || "—");
  renderProfile();
}

async function loadBarns() {
  try {
    const response = await apiRequest({ path: "/barns" });
    state.barns = normalizeListResponse(response, ["barns", "items"]);
  } catch {
    state.barns = [];
  }
  setText("barnCount", String(state.barns.length));
  renderBarns();
}

async function loadDevices() {
  try {
    const response = await apiRequest({ path: "/devices" });
    state.devices = normalizeListResponse(response, ["devices", "items"]);
  } catch {
    state.devices = [];
  }
  setText("deviceCountLabel", `${messages.devicesCount}: ${state.devices.length}`);
  renderDevices();
}

async function loadApiKeys() {
  try {
    const response = await apiRequest({ path: "/api-keys" });
    state.apiKeys = normalizeListResponse(response, ["api_keys", "keys", "items"]);
  } catch {
    state.apiKeys = [];
  }
  setText("apiKeyCountLabel", `${messages.apiKeysCount}: ${state.apiKeys.length}`);
  renderApiKeys();
}

async function loadEvents() {
  let partial = false;
  let skippedWindows = 0;
  try {
    const response = await apiRequest({ path: "/events", query: buildQuery({ limit: 120 }) });
    state.events = normalizeListResponse(response, ["events", "items"]);
    setText("eventCount", String(response.total || state.events.length));
    partial = Boolean(response.partial || response.recovered_from_validation_error);
    skippedWindows = Number(response.skipped_windows || 0);
  } catch {
    state.events = [];
    setText("eventCount", "0");
  }
  setText("calendarSummary", `${messages.loadedCount}: ${state.events.length}`);
  state.eventsMeta = { partial, skippedWindows };
  renderCalendar();
  renderEvents();
}

async function loadAnalytics() {
  const start = el("startDate").value;
  const end = el("endDate").value;
  const barnId = el("barnId").value;
  if (!start || !end) throw new Error(messages.chooseDates);
  const query = buildQuery({ start, end, barn_id: barnId });
  const [analyticsResult, reportResult] = await Promise.allSettled([
    apiRequest({ path: "/analytics", query }),
    apiRequest({ path: "/reports/custom", query }),
  ]);

  state.analytics = analyticsResult.status === "fulfilled" ? analyticsResult.value : null;
  state.report = reportResult.status === "fulfilled" ? reportResult.value : null;
  renderAnalytics();
}

async function loadHealthAndMetrics() {
  try {
    const response = await fetch("/app/api/health");
    const data = await response.json();
    setText("systemHealth", response.ok ? `${data.status || "ok"}` : messages.unavailable);
  } catch {
    setText("systemHealth", messages.unavailable);
  }
  try {
    const metrics = await apiRequest({ path: "/metrics", expectText: true });
    setText("metricsOutput", metrics || "");
  } catch (error) {
    setText("metricsOutput", formatApiError(error));
  }
}

async function loadCamerasAndZones() {
  const deviceId = el("cameraDeviceIdInput").value.trim() || state.devices[0]?.device_id;
  const barnId = el("cameraBarnIdInput").value.trim() || state.barns[0]?.barn_id;

  if (deviceId) {
    try {
      const camerasResponse = await apiRequest({ path: `/devices/${encodeURIComponent(deviceId)}/cameras` });
      state.cameras = camerasResponse.cameras || camerasResponse.items || camerasResponse || [];
    } catch {
      state.cameras = [];
    }
  } else {
    state.cameras = [];
  }

  try {
    const zonesQuery = buildQuery({ barn_id: barnId });
    const zonesResponse = await apiRequest({ path: "/devices/zones", query: zonesQuery });
    state.zones = zonesResponse.zones || zonesResponse.items || zonesResponse || [];
  } catch {
    state.zones = [];
  }
  renderCamerasAndZones();
}

async function loadAdminData() {
  if (role !== "admins") return;
  try {
    state.adminDashboard = await apiRequest({ path: "/admin/dashboard" });
  } catch {
    state.adminDashboard = null;
  }
  for (const roleName of ["admins", "farmers", "staff"]) {
    try {
      const response = await apiRequest({ path: `/users/all/${roleName}` });
      state.coworkers[roleName] = Array.isArray(response) ? response : response.items || [];
    } catch {
      state.coworkers[roleName] = [];
    }
  }
  renderAdmin();
}

function setDefaultDates() {
  const now = new Date();
  const end = now.toISOString().slice(0, 10);
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 7);
  el("startDate").value = startDate.toISOString().slice(0, 10);
  el("endDate").value = end;
}

function bindTabs() {
  document.querySelectorAll(".dashboard-tab").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });
  if (role === "admins") {
    document.querySelectorAll(".admin-role-filter").forEach((button) => {
      button.addEventListener("click", () => {
        state.currentCoworkerRole = button.dataset.role;
        document.querySelectorAll(".admin-role-filter").forEach((item) => {
          item.className = item.dataset.role === state.currentCoworkerRole ? "admin-role-filter btn-primary px-3" : "admin-role-filter btn-secondary px-3";
        });
        renderAdmin();
      });
    });
  }
}

function bindForms() {
  el("filtersForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    setFiltersStatus(messages.loading);
    try {
      await loadAnalytics();
      setFiltersStatus(messages.loaded, "success");
    } catch (error) {
      setFiltersStatus(formatApiError(error) || messages.applyError, "error");
    }
  });

  el("refreshBtn").addEventListener("click", init);
  el("calendarPrev").addEventListener("click", () => {
    state.currentMonth = new Date(Date.UTC(state.currentMonth.getUTCFullYear(), state.currentMonth.getUTCMonth() - 1, 1));
    renderCalendar();
  });
  el("calendarNext").addEventListener("click", () => {
    state.currentMonth = new Date(Date.UTC(state.currentMonth.getUTCFullYear(), state.currentMonth.getUTCMonth() + 1, 1));
    renderCalendar();
  });

  el("profileForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest({
        path: "/user/me",
        method: "PATCH",
        body: {
          first_name: el("profileFirstName").value,
          middle_name: el("profileMiddleName").value,
          last_name: el("profileLastName").value,
        },
      });
      await loadProfile();
      setStatus("profileStatus", messages.saved, "success");
    } catch (error) {
      setStatus("profileStatus", formatApiError(error), "error");
    }
  });

  el("emailForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest({
        path: "/user/email",
        method: "PATCH",
        body: {
          email: el("profileEmail").value,
          password: el("emailPassword").value,
        },
      });
      await loadProfile();
      el("emailPassword").value = "";
      setStatus("profileStatus", messages.saved, "success");
    } catch (error) {
      setStatus("profileStatus", formatApiError(error), "error");
    }
  });

  el("passwordForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest({
        path: "/user/me/password",
        method: "PATCH",
        body: {
          current_password: el("currentPassword").value,
          new_password: el("newPassword").value,
        },
      });
      el("currentPassword").value = "";
      el("newPassword").value = "";
      setStatus("profileStatus", messages.saved, "success");
    } catch (error) {
      setStatus("profileStatus", formatApiError(error), "error");
    }
  });

  el("recoveryForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest({
        path: "/user/password",
        method: "PATCH",
        body: {
          email: el("recoveryEmail").value,
          new_password: el("recoveryPassword").value,
        },
      });
      el("recoveryPassword").value = "";
      setStatus("profileStatus", messages.saved, "success");
    } catch (error) {
      setStatus("profileStatus", formatApiError(error), "error");
    }
  });

  el("apiKeyForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const payload = await apiRequest({
        path: "/api-keys",
        method: "POST",
        body: { name: el("apiKeyName").value || "BarnSight Edge Device" },
      });
      el("apiKeyName").value = "";
      const reveal = el("apiKeyReveal");
      reveal.className = "notice mt-4";
      reveal.style.borderColor = "rgb(var(--ok)/0.55)";
      reveal.style.background = "rgb(var(--ok-soft))";
      reveal.style.color = "rgb(var(--ok))";
      reveal.textContent = `${messages.apiKeyCreated} ${payload.key || ""}`;
      setStatus("apiKeyCreateStatus", messages.created, "success");
      await loadApiKeys();
    } catch (error) {
      setStatus("apiKeyCreateStatus", formatApiError(error), "error");
    }
  });

  el("deviceForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest({
        path: "/devices",
        method: "POST",
        body: {
          device_id: el("deviceIdInput").value,
          barn_id: el("deviceBarnIdInput").value,
          name: el("deviceNameInput").value,
          location: el("deviceLocationInput").value,
          status: el("deviceStatusInput").value,
        },
      });
      setStatus("deviceStatusMessage", messages.saved, "success");
      await loadDevices();
    } catch (error) {
      setStatus("deviceStatusMessage", formatApiError(error), "error");
    }
  });

  el("cameraForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest({
        path: `/devices/${encodeURIComponent(el("cameraDeviceIdInput").value)}/cameras`,
        method: "POST",
        body: {
          camera_id: el("cameraIdInput").value,
          device_id: el("cameraDeviceIdInput").value,
          barn_id: el("cameraBarnIdInput").value,
          name: el("cameraNameInput").value,
          stream_label: el("cameraStreamInput").value,
          status: "offline",
        },
      });
      setStatus("cameraStatusMessage", messages.saved, "success");
      await loadCamerasAndZones();
    } catch (error) {
      setStatus("cameraStatusMessage", formatApiError(error), "error");
    }
  });

  el("zoneForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest({
        path: `/cameras/${encodeURIComponent(el("zoneCameraIdInput").value)}/zones`,
        method: "POST",
        body: {
          zone_id: el("zoneIdInput").value,
          barn_id: el("zoneBarnIdInput").value,
          device_id: el("zoneDeviceIdInput").value,
          camera_id: el("zoneCameraIdInput").value,
          polygon: JSON.parse(el("zonePolygonInput").value || "[]"),
          enabled: true,
          label: el("zoneLabelInput").value,
        },
      });
      setStatus("zoneStatusMessage", messages.saved, "success");
      await loadCamerasAndZones();
    } catch (error) {
      setStatus("zoneStatusMessage", formatApiError(error), "error");
    }
  });

  if (role === "admins") {
    el("coworkerForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const targetRole = el("coworkerRole").value;
      try {
        await apiRequest({
          path: `/${targetRole}`,
          method: "POST",
          body: {
            first_name: el("coworkerFirstName").value,
            middle_name: el("coworkerMiddleName").value,
            last_name: el("coworkerLastName").value,
            username: el("coworkerUsername").value,
            email: el("coworkerEmail").value,
            password: el("coworkerPassword").value,
          },
        });
        event.target.reset();
        setStatus("coworkerStatus", messages.created, "success");
        await loadAdminData();
      } catch (error) {
        setStatus("coworkerStatus", formatApiError(error), "error");
      }
    });
  }
}

async function init() {
  setDefaultDates();
  setActiveTab(state.currentTab);
  setFiltersStatus(messages.loading);
  try {
    await Promise.all([loadProfile(), loadBarns(), loadDevices(), loadApiKeys(), loadEvents(), loadHealthAndMetrics()]);
    await Promise.all([loadAnalytics(), loadCamerasAndZones(), loadAdminData()]);
    setFiltersStatus(messages.loaded, "success");
  } catch (error) {
    setFiltersStatus(formatApiError(error), "error");
  }
}

bindTabs();
bindForms();
init();
