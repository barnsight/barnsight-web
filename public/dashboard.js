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
    loading: "Loading...",
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
    online: "Online",
    offline: "Offline",
    warning: "Warning",
    reviewer: "Reviewer",
    status: "Status",
    snapshot: "Snapshot",
    details: "Details",
    createdAt: "Created",
    lastUsed: "Last used",
    prefix: "Prefix",
    secretShownOnce: "Secret shown once",
    never: "Never",
    quickProfile: "Review profile",
    quickEvents: "Review events",
    quickKeys: "Manage edge keys",
    quickAdmin: "Manage coworkers",
    setupBarn: "Add a barn",
    setupDevice: "Register an edge device",
    setupCamera: "Connect a camera and zones",
    setupKey: "Create an edge API key",
    emptyBarnsTitle: "No barns connected yet",
    emptyBarnsCopy: "Create or connect a barn to start grouping devices, cameras, hygiene summaries, and events.",
    emptyDevicesTitle: "No devices registered",
    emptyDevicesCopy: "Register an edge device so BarnSight can receive heartbeats, detections, and camera metadata.",
    emptyCamerasTitle: "No cameras available",
    emptyCamerasCopy: "Connect at least one camera to a device before creating zones or reviewing detections.",
    emptyZonesTitle: "No zones configured",
    emptyZonesCopy: "Zones define the monitored hygiene area for each camera. Add a polygon when a camera is ready.",
    emptyKeysTitle: "No edge API keys",
    emptyKeysCopy: "API keys securely connect edge devices to this BarnSight workspace. Create a key and install it once on the device.",
    emptyEventsTitle: "No detection events yet",
    emptyEventsCopy: "When edge devices send events and snapshots, the latest review queue will appear here.",
    retry: "Retry",
    cancel: "Cancel",
    confirmDeleteKey: "Revoke this API key? Devices using it will stop sending authenticated data until a replacement key is installed.",
    confirmDeleteUser: "Delete this user? This action cannot be undone from the dashboard.",
    confirmDeleteTitle: "Confirm action",
    openPreview: "Open preview",
    systemHealthy: "Healthy",
    systemDegraded: "Degraded",
    copiedNow: "Shown once. Store it securely now.",
  metricsUnavailable: "Metrics unavailable.",
  roleAdmins: "Admins",
  roleFarmers: "Farmers",
  roleStaff: "Staff",
    rotate: "Rotate",
    updateScopes: "Update scopes",
    addNote: "Add note",
    markReviewed: "Mark reviewed",
    markResolved: "Mark resolved",
    markFalsePositive: "False positive",
    markIgnored: "Ignore",
    terminate: "Terminate",
    sessionsEmpty: "No active sessions returned.",
    auditEmpty: "No audit logs returned.",
    scopes: "Scopes",
    expiresAt: "Expires",
    reviewNotePlaceholder: "Add review note",
    sessionId: "Session",
    ipAddress: "IP",
    confirmRotateKey: "Rotate this API key? The old secret will stop working after rotation.",
    confirmDeleteSession: "Terminate this session?",
    rotated: "Rotated.",
    noteSaved: "Note saved.",
    scopeSaved: "Scopes updated.",
    sessionDeleted: "Session terminated.",
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
    loading: "Завантаження...",
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
    online: "Онлайн",
    offline: "Офлайн",
    warning: "Попередження",
    reviewer: "Ревʼюер",
    status: "Статус",
    snapshot: "Знімок",
    details: "Деталі",
    createdAt: "Створено",
    lastUsed: "Останнє використання",
    prefix: "Префікс",
    secretShownOnce: "Секрет показується один раз",
    never: "Ніколи",
    quickProfile: "Перевірити профіль",
    quickEvents: "Переглянути події",
    quickKeys: "Керувати edge-ключами",
    quickAdmin: "Керувати колегами",
    setupBarn: "Додайте господарство",
    setupDevice: "Зареєструйте edge-пристрій",
    setupCamera: "Підключіть камеру і зони",
    setupKey: "Створіть edge API-ключ",
    emptyBarnsTitle: "Господарства ще не підключені",
    emptyBarnsCopy: "Створіть або підключіть господарство, щоб групувати пристрої, камери, зведення гігієни та події.",
    emptyDevicesTitle: "Пристрої ще не зареєстровані",
    emptyDevicesCopy: "Зареєструйте edge-пристрій, щоб BarnSight отримував heartbeat, детекції та метадані камер.",
    emptyCamerasTitle: "Камер ще немає",
    emptyCamerasCopy: "Підключіть хоча б одну камеру до пристрою перед створенням зон і переглядом детекцій.",
    emptyZonesTitle: "Зони ще не налаштовані",
    emptyZonesCopy: "Зони визначають контрольовану ділянку гігієни для кожної камери. Додайте полігон після підключення камери.",
    emptyKeysTitle: "Немає edge API-ключів",
    emptyKeysCopy: "API-ключі безпечно підключають edge-пристрої до цього простору BarnSight. Створіть ключ і встановіть його на пристрій один раз.",
    emptyEventsTitle: "Подій детекції ще немає",
    emptyEventsCopy: "Коли edge-пристрої надішлють події та знімки, тут зʼявиться актуальна черга перегляду.",
    retry: "Повторити",
    cancel: "Скасувати",
    confirmDeleteKey: "Відкликати цей API-ключ? Пристрої, що його використовують, перестануть надсилати автентифіковані дані, доки ви не встановите новий ключ.",
    confirmDeleteUser: "Видалити цього користувача? Дію не можна скасувати з панелі.",
    confirmDeleteTitle: "Підтвердіть дію",
    openPreview: "Відкрити перегляд",
    systemHealthy: "Система працює",
    systemDegraded: "Є деградація",
    copiedNow: "Ключ показано один раз. Збережіть його безпечно зараз.",
    metricsUnavailable: "Метрики недоступні.",
    roleAdmins: "Адміни",
    roleFarmers: "Фермери",
    roleStaff: "Персонал",
    rotate: "Ротувати",
    updateScopes: "Оновити scopes",
    addNote: "Додати note",
    markReviewed: "Позначити reviewed",
    markResolved: "Позначити resolved",
    markFalsePositive: "False positive",
    markIgnored: "Ignore",
    terminate: "Завершити",
    sessionsEmpty: "Активні сесії не повернуто.",
    auditEmpty: "Логи аудиту не повернуто.",
    scopes: "Scopes",
    expiresAt: "Термін дії",
    reviewNotePlaceholder: "Додайте review note",
    sessionId: "Сесія",
    ipAddress: "IP",
    confirmRotateKey: "Ротувати цей API-ключ? Старий секрет перестане працювати після ротації.",
    confirmDeleteSession: "Завершити цю сесію?",
    rotated: "Ключ ротовано.",
    noteSaved: "Нотатку додано.",
    scopeSaved: "Scopes оновлено.",
    sessionDeleted: "Сесію завершено.",
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
  coworkers: { admins: [], farmers: [], staff: [] },
  currentCoworkerRole: "admins",
  cameras: [],
  zones: [],
  sessions: [],
  auditLogs: [],
  systemHealth: null,
  systemConfig: null,
  systemVersion: null,
  adminSystemHealth: null,
  currentMonth: new Date(),
  selectedCalendarDate: null,
  eventsMeta: { partial: false, skippedWindows: 0 },
};

function el(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

function setLastRefresh() {
  setText("lastRefreshLabel", formatTimestamp(new Date().toISOString()));
}

function showToast(text, tone = "info") {
  const stack = el("toastStack");
  if (!stack) return;
  const toast = document.createElement("div");
  toast.className = `toast is-${tone}`;
  toast.innerHTML = `
    <p class="text-sm font-semibold text-ink">${escapeHtml(text)}</p>
  `;
  stack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

function setFiltersStatus(text, tone = "neutral") {
  const node = el("filtersStatus");
  if (!node) return;
  node.textContent = text;
  node.className =
    tone === "error"
      ? "mt-3 text-xs text-[rgb(var(--danger))]"
      : tone === "success"
        ? "mt-3 text-xs text-[rgb(var(--ok))]"
        : "mt-3 text-xs text-ink-mute";
}

function setStatus(id, text, tone = "neutral", shouldToast = false) {
  const node = el(id);
  if (node) {
    node.textContent = text;
    node.className =
      tone === "error"
        ? "text-xs text-[rgb(var(--danger))]"
        : tone === "success"
          ? "text-xs text-[rgb(var(--ok))]"
          : "text-xs text-ink-mute";
  }
  if (shouldToast) showToast(text, tone === "error" ? "error" : tone === "success" ? "success" : "info");
}

function renderEmptyState({ title, copy, actionLabel, actionTab }) {
  return `
    <div class="empty-state">
      <p class="empty-state-title">${escapeHtml(title)}</p>
      <p class="empty-state-copy">${escapeHtml(copy)}</p>
      ${actionLabel && actionTab ? `
        <div class="empty-state-actions">
          <button type="button" class="btn-primary empty-state-action" data-tab-target="${escapeHtml(actionTab)}">${escapeHtml(actionLabel)}</button>
        </div>
      ` : ""}
    </div>
  `;
}

function bindEmptyStateActions(root) {
  root.querySelectorAll(".empty-state-action").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tabTarget));
  });
}

function renderSkeletonCards(rootId, count = 3) {
  const root = el(rootId);
  if (!root) return;
  root.innerHTML = Array.from({ length: count }).map(() => `
    <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
      <div class="skeleton-block h-4 w-24"></div>
      <div class="skeleton-block mt-3 h-7 w-2/3"></div>
      <div class="skeleton-block mt-4 h-3 w-full"></div>
      <div class="skeleton-block mt-2 h-3 w-4/5"></div>
    </article>
  `).join("");
}

function statusBadge(text, tone = "neutral") {
  return `<span class="status-badge is-${tone}">${escapeHtml(text)}</span>`;
}

function getDeviceTone(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "online") return "ok";
  if (normalized === "offline") return "bad";
  return "neutral";
}

function getEventStatus(event) {
  const raw = String(event.status || event.review_status || event.state || "").toLowerCase();
  if (["resolved", "closed"].includes(raw)) return { label: raw, tone: "ok" };
  if (["false_positive", "ignored", "ignored_by_user"].includes(raw)) return { label: raw.replaceAll("_", " "), tone: "neutral" };
  if (["reviewed", "in_review"].includes(raw)) return { label: raw.replaceAll("_", " "), tone: "warn" };
  return { label: raw || "new", tone: raw ? "warn" : "bad" };
}

function confirmAction(message, title = messages.confirmDeleteTitle) {
  const dialog = el("confirmDialog");
  if (!dialog) return Promise.resolve(window.confirm(message));
  setText("confirmDialogTitle", title);
  setText("confirmDialogMessage", message);
  dialog.showModal();
  return new Promise((resolve) => {
    dialog.addEventListener("close", () => resolve(dialog.returnValue === "confirm"), { once: true });
  });
}

function openImagePreview({ src, title, meta }) {
  if (!src) return;
  const dialog = el("imagePreviewModal");
  el("imagePreviewTitle").textContent = title;
  el("imagePreviewMeta").textContent = meta;
  const image = el("imagePreviewImage");
  image.src = src;
  image.alt = title;
  dialog.showModal();
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

  if (response.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (response.status === 403) {
    window.location.href = "/unauthorized";
    throw new Error("Forbidden");
  }

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

function setActiveTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll(".dashboard-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tab);
  });
  document.querySelectorAll(".dashboard-panel").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.tabPanel !== tab);
  });
}

function renderQuickActions() {
  const actions = [
    { tab: "profile", label: messages.quickProfile },
    { tab: "events", label: messages.quickEvents },
    { tab: "keys", label: messages.quickKeys },
  ];
  if (role === "admins") actions.push({ tab: "admin", label: messages.quickAdmin });
  const root = el("quickActions");
  root.innerHTML = actions.map((item) => `
    <button type="button" class="btn-secondary quick-action w-full justify-between" data-target-tab="${escapeHtml(item.tab)}">
      <span>${escapeHtml(item.label)}</span>
      <span aria-hidden="true">→</span>
    </button>
  `).join("");
  root.querySelectorAll(".quick-action").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.targetTab));
  });
}

function renderSetupChecklist() {
  const items = [
    { label: messages.setupDevice, done: state.devices.length > 0 },
    { label: messages.setupKey, done: state.apiKeys.length > 0 },
    { label: messages.quickEvents, done: state.events.length > 0 },
  ];
  el("setupChecklist").innerHTML = items.map((item, index) => `
    <article class="checklist-item ${item.done ? "is-complete" : ""}">
      <span class="checklist-marker">${item.done ? "✓" : index + 1}</span>
      <div>
        <p class="text-sm font-semibold text-ink">${escapeHtml(item.label)}</p>
        <p class="mt-1 text-xs text-ink-soft">${item.done ? messages.loaded : messages.loading}</p>
      </div>
    </article>
  `).join("");
}

function renderProfile() {
  if (!state.me) return;
  const summary = [
    [messages.username, state.me.username || "—"],
    [messages.email, state.me.email || "—"],
    [messages.role, role],
  ];
  el("profileSummary").innerHTML = summary
    .map(([label, value]) => `
      <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
        <p class="text-xs uppercase tracking-[0.18em] text-ink-mute">${escapeHtml(label)}</p>
        <p class="mt-2 font-display text-xl font-semibold break-all text-ink">${escapeHtml(value)}</p>
      </article>
    `)
    .join("");

  el("profileFirstName").value = state.me.first_name || "";
  el("profileMiddleName").value = state.me.middle_name || "";
  el("profileLastName").value = state.me.last_name || "";
  el("profileEmail").value = state.me.email || "";
  el("recoveryEmail").value = state.me.email || "";
}

function renderSessions() {
  const root = el("sessionsList");
  if (!root) return;
  if (!state.sessions.length) {
    root.innerHTML = `<p class="text-sm text-ink-soft">${escapeHtml(messages.sessionsEmpty)}</p>`;
    return;
  }

  root.innerHTML = state.sessions.map((session) => {
    const id = session.session_id || session.id || session._id || "—";
    return `
      <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/72 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-display text-lg font-semibold text-ink">${escapeHtml(session.device || session.user_agent || messages.sessionId)}</p>
            <p class="mt-1 font-mono text-xs text-ink-mute break-all">${escapeHtml(id)}</p>
          </div>
          <button type="button" class="btn-secondary session-delete" data-session-id="${escapeHtml(id)}">${escapeHtml(messages.terminate)}</button>
        </div>
        <div class="mt-3 grid gap-1 text-sm text-ink-soft">
          <p><span class="font-medium text-ink">${escapeHtml(messages.ipAddress)}:</span> ${escapeHtml(session.ip || session.ip_address || session.last_ip || "—")}</p>
          <p><span class="font-medium text-ink">Last seen:</span> ${escapeHtml(formatTimestamp(session.last_seen_at || session.updated_at || session.created_at))}</p>
        </div>
      </article>
    `;
  }).join("");

  root.querySelectorAll(".session-delete").forEach((button) => {
    button.addEventListener("click", async () => {
      const confirmed = await confirmAction(messages.confirmDeleteSession);
      if (!confirmed) return;
      try {
        await apiRequest({ path: `/user/me/sessions/${encodeURIComponent(button.dataset.sessionId)}`, method: "DELETE" });
        showToast(messages.sessionDeleted, "success");
        await loadSessions();
      } catch (error) {
        showToast(formatApiError(error), "error");
      }
    });
  });
}

function renderApiKeys() {
  const root = el("apiKeysList");
  const errorNode = el("apiKeysError");
  if (errorNode) {
    errorNode.classList.add("hidden");
    errorNode.textContent = "";
  }
  if (!state.apiKeys.length) {
    root.innerHTML = renderEmptyState({
      title: messages.emptyKeysTitle,
      copy: messages.emptyKeysCopy,
      actionLabel: locale === "uk" ? "Створити ключ" : "Create key",
      actionTab: "keys",
    });
    bindEmptyStateActions(root);
    return;
  }

  root.innerHTML = state.apiKeys
    .map((item) => {
      const id = item._id || item.id || item.key_id;
      const prefix = item.prefix || item.key_prefix || item.masked_key || String(id || "").slice(0, 10);
      const lastUsed = item.last_used_at || item.last_used || item.last_used_date;
      const scopes = Array.isArray(item.scopes) ? item.scopes.join(", ") : "";
      return `
        <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-display text-lg font-semibold text-ink">${escapeHtml(item.name || messages.edgeKey)}</p>
              <div class="mt-2 flex flex-wrap gap-2">
                ${statusBadge(item.status || messages.unknown, item.status === "active" ? "ok" : item.status === "expired" ? "warn" : "bad")}
                ${statusBadge(prefix ? `${messages.prefix}: ${prefix}` : "—", "neutral")}
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn-secondary api-key-rotate" data-key-id="${escapeHtml(id || "")}">${escapeHtml(messages.rotate)}</button>
              <button type="button" class="btn-secondary api-key-delete" data-key-id="${escapeHtml(id || "")}">${escapeHtml(messages.delete)}</button>
            </div>
          </div>
          <div class="mt-4 grid gap-2 text-sm text-ink-soft md:grid-cols-2">
            <p><span class="font-medium text-ink">${escapeHtml(messages.createdAt)}:</span> ${escapeHtml(formatTimestamp(item.created_at || item.createdAt))}</p>
            <p><span class="font-medium text-ink">${escapeHtml(messages.lastUsed)}:</span> ${escapeHtml(lastUsed ? formatTimestamp(lastUsed) : messages.never)}</p>
            <p><span class="font-medium text-ink">${escapeHtml(messages.expiresAt)}:</span> ${escapeHtml(item.expires_at ? formatTimestamp(item.expires_at) : messages.never)}</p>
            <p><span class="font-medium text-ink">${escapeHtml(messages.scopes)}:</span> ${escapeHtml(scopes || "—")}</p>
          </div>
          <form class="mt-4 api-key-scopes-form" data-key-id="${escapeHtml(id || "")}">
            <div class="grid gap-3 md:grid-cols-[1fr_180px]">
              <input class="field api-key-scopes-input" value="${escapeHtml(scopes)}" placeholder="events:write,snapshots:write" />
              <button type="submit" class="btn-secondary w-full">${escapeHtml(messages.updateScopes)}</button>
            </div>
          </form>
        </article>
      `;
    })
    .join("");

  root.querySelectorAll(".api-key-rotate").forEach((button) => {
    button.addEventListener("click", async () => {
      const confirmed = await confirmAction(messages.confirmRotateKey);
      if (!confirmed) return;
      try {
        const payload = await apiRequest({ path: `/api-keys/${encodeURIComponent(button.dataset.keyId)}/rotate`, method: "POST" });
        const reveal = el("apiKeyReveal");
        reveal.className = "notice mt-4";
        reveal.style.borderColor = "rgb(var(--ok) / 0.55)";
        reveal.style.background = "rgb(var(--ok-soft))";
        reveal.style.color = "rgb(var(--ok))";
        reveal.textContent = `${messages.rotated} ${messages.apiKeyCreated} ${payload.key || ""} ${messages.copiedNow}`;
        showToast(messages.rotated, "success");
        await loadApiKeys();
      } catch (error) {
        showToast(formatApiError(error), "error");
      }
    });
  });

  root.querySelectorAll(".api-key-delete").forEach((button) => {
    button.addEventListener("click", async () => {
      const confirmed = await confirmAction(messages.confirmDeleteKey);
      if (!confirmed) return;
      button.disabled = true;
      try {
        await apiRequest({ path: `/api-keys/${encodeURIComponent(button.dataset.keyId)}`, method: "DELETE" });
        setStatus("apiKeyCreateStatus", messages.deleted, "success", true);
        await loadApiKeys();
      } catch (error) {
        setStatus("apiKeyCreateStatus", formatApiError(error), "error", true);
      } finally {
        button.disabled = false;
      }
    });
  });

  root.querySelectorAll(".api-key-scopes-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = form.querySelector(".api-key-scopes-input");
      const scopes = String(input.value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      if (!scopes.length) return;
      try {
        await apiRequest({
          path: `/api-keys/${encodeURIComponent(form.dataset.keyId)}/scopes`,
          method: "PATCH",
          body: { scopes },
        });
        showToast(messages.scopeSaved, "success");
        await loadApiKeys();
      } catch (error) {
        showToast(formatApiError(error), "error");
      }
    });
  });
}

function renderApiKeyError(error) {
  const root = el("apiKeysList");
  const errorNode = el("apiKeysError");
  if (errorNode) {
    errorNode.classList.remove("hidden");
    errorNode.textContent = formatApiError(error);
  }
  root.innerHTML = "";
}

function renderBarns() {
  const root = el("barnsList");
  if (!state.barns.length) {
    root.innerHTML = renderEmptyState({
      title: messages.emptyBarnsTitle,
      copy: messages.emptyBarnsCopy,
      actionLabel: locale === "uk" ? "До пристроїв" : "Go to devices",
      actionTab: "devices",
    });
    bindEmptyStateActions(root);
    return;
  }

  root.innerHTML = state.barns.map((barn) => `
    <article class="rounded-[14px_28px_18px_30px] border border-edge/45 bg-paper-warm/72 p-5 shadow-panel">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-ink-mute">${escapeHtml(messages.barn)}</p>
          <h3 class="mt-2 font-display text-xl font-semibold text-ink">${escapeHtml(barn.name || `${messages.barn} ${barn.barn_id || barn.id || ""}`)}</h3>
        </div>
        <span class="rounded-[10px_18px_12px_20px] bg-hay/40 px-3 py-1 font-mono text-xs font-semibold text-ochre-deep">${escapeHtml(barn.barn_id || barn.id || "—")}</span>
      </div>
      <div class="mt-4 grid gap-2 text-sm text-ink-soft">
        <p><span class="font-medium text-ink">${escapeHtml(messages.location)}:</span> ${escapeHtml(barn.location || "—")}</p>
        <p><span class="font-medium text-ink">${escapeHtml(messages.description)}:</span> ${escapeHtml(barn.description || "—")}</p>
        <p><span class="font-medium text-ink">${escapeHtml(messages.account)}:</span> ${escapeHtml(barn.account_id || "—")}</p>
      </div>
    </article>
  `).join("");
}

function renderCamerasAndZones() {
  const camerasRoot = el("camerasList");
  const zonesRoot = el("zonesList");

  camerasRoot.innerHTML = state.cameras.length
    ? state.cameras.map((camera) => `
      <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-display text-lg font-semibold text-ink">${escapeHtml(camera.name || camera.camera_id || messages.camera)}</p>
            <p class="mt-1 font-mono text-xs text-ink-mute">${escapeHtml(camera.camera_id || "—")}</p>
          </div>
          ${statusBadge(camera.status || messages.unknown, getDeviceTone(camera.status))}
        </div>
        <p class="mt-3 text-sm text-ink-soft">${escapeHtml(messages.barn)} ${escapeHtml(camera.barn_id || "—")} · ${escapeHtml(messages.device)} ${escapeHtml(camera.device_id || "—")}</p>
      </article>
    `).join("")
    : renderEmptyState({
        title: messages.emptyCamerasTitle,
        copy: messages.emptyCamerasCopy,
        actionLabel: locale === "uk" ? "Додати камеру" : "Add camera",
        actionTab: "cameras",
      });

  zonesRoot.innerHTML = state.zones.length
    ? state.zones.map((zone) => `
      <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-display text-lg font-semibold text-ink">${escapeHtml(zone.label || zone.zone_id || messages.zone)}</p>
            <p class="mt-1 font-mono text-xs text-ink-mute">${escapeHtml(zone.zone_id || "—")}</p>
          </div>
          ${statusBadge(zone.enabled === false ? messages.disabled : messages.enabled, zone.enabled === false ? "neutral" : "ok")}
        </div>
        <p class="mt-3 text-sm text-ink-soft">${escapeHtml(messages.camera)} ${escapeHtml(zone.camera_id || "—")} · ${escapeHtml(messages.barn)} ${escapeHtml(zone.barn_id || "—")}</p>
      </article>
    `).join("")
    : renderEmptyState({
        title: messages.emptyZonesTitle,
        copy: messages.emptyZonesCopy,
        actionLabel: locale === "uk" ? "Створити зону" : "Create zone",
        actionTab: "cameras",
      });

  bindEmptyStateActions(camerasRoot);
  bindEmptyStateActions(zonesRoot);
}

function renderEventsNotice() {
  const node = el("eventsNotice");
  const meta = state.eventsMeta || {};
  if (!meta.partial) {
    node.classList.add("hidden");
    node.innerHTML = "";
    return;
  }
  node.className = "notice is-warn mt-3";
  node.classList.remove("hidden");
  const skipped = meta.skippedWindows || 0;
  node.innerHTML = locale === "uk"
    ? `Частина історичних подій пропущена через невалідне поле <code>image_snapshot</code>${skipped ? ` · пропущено вікон: ${skipped}` : ""}.`
    : `Some historical events were skipped due to an invalid <code>image_snapshot</code> field${skipped ? ` · skipped windows: ${skipped}` : ""}.`;
}

function renderEvents(events = state.events) {
  const root = el("eventsList");
  renderEventsNotice();
  if (!events.length) {
    root.innerHTML = renderEmptyState({
      title: messages.emptyEventsTitle,
      copy: messages.emptyEventsCopy,
      actionLabel: locale === "uk" ? "Оновити" : "Refresh",
      actionTab: "events",
    });
    bindEmptyStateActions(root);
    return;
  }

  root.innerHTML = events.map((event) => {
    const imageSrc = toImageSrc(event.image_snapshot);
    const conf = typeof event.confidence === "number" ? `${Math.round(event.confidence * 100)}%` : (event.confidence ?? "—");
    const status = getEventStatus(event);
    const title = `${event.camera_id || messages.camera} · ${formatTimestamp(event.timestamp)}`;
    return `
      <article class="rounded-[14px_28px_18px_30px] border border-edge/45 bg-paper-warm/72 p-4 shadow-panel">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-mono text-xs uppercase tracking-[0.18em] text-ink-mute">${escapeHtml(event.camera_id || `${messages.camera}?`)}</p>
            <p class="mt-1 text-sm font-semibold text-ink">${escapeHtml(formatTimestamp(event.timestamp))}</p>
          </div>
          <div class="flex flex-col items-end gap-2">
            ${statusBadge(status.label, status.tone)}
            <span class="rounded-[10px_18px_12px_20px] bg-hay/40 px-3 py-1 text-xs font-semibold text-ochre-deep">${escapeHtml(conf)}</span>
          </div>
        </div>
        ${imageSrc ? `
          <button type="button" class="snapshot-trigger mt-3 w-full" data-image-src="${escapeHtml(imageSrc)}" data-image-title="${escapeHtml(title)}" data-image-meta="${escapeHtml(`${messages.barn} ${event.barn_id || "—"} · ${messages.device} ${event.device_id || "—"}`)}" aria-label="${escapeHtml(messages.openPreview)}">
            <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(title)}" class="h-40 w-full rounded-[10px_18px_12px_20px] border border-edge/45 object-cover" loading="lazy" />
          </button>
        ` : ""}
        <div class="mt-3 grid gap-1 text-xs text-ink-soft">
          <p><span class="font-medium text-ink">${escapeHtml(messages.device)}:</span> ${escapeHtml(event.device_id || "—")}</p>
          <p><span class="font-medium text-ink">${escapeHtml(messages.barn)}:</span> ${escapeHtml(event.barn_id || "—")}</p>
          <p><span class="font-medium text-ink">${escapeHtml(messages.reviewer)}:</span> ${escapeHtml(event.reviewer || event.reviewed_by || "—")}</p>
          <p><span class="font-medium text-ink">ID:</span> <span class="font-mono">${escapeHtml(event._id || event.id || "—")}</span></p>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <button type="button" class="btn-secondary event-status-action" data-event-id="${escapeHtml(event._id || event.id || "")}" data-status="reviewed">${escapeHtml(messages.markReviewed)}</button>
          <button type="button" class="btn-secondary event-status-action" data-event-id="${escapeHtml(event._id || event.id || "")}" data-status="resolved">${escapeHtml(messages.markResolved)}</button>
          <button type="button" class="btn-secondary event-status-action" data-event-id="${escapeHtml(event._id || event.id || "")}" data-status="false_positive">${escapeHtml(messages.markFalsePositive)}</button>
          <button type="button" class="btn-secondary event-status-action" data-event-id="${escapeHtml(event._id || event.id || "")}" data-status="ignored">${escapeHtml(messages.markIgnored)}</button>
        </div>
        <form class="mt-3 event-note-form" data-event-id="${escapeHtml(event._id || event.id || "")}">
          <div class="grid gap-3 md:grid-cols-[1fr_160px]">
            <input class="field event-note-input" maxlength="2000" placeholder="${escapeHtml(messages.reviewNotePlaceholder)}" />
            <button type="submit" class="btn-secondary w-full">${escapeHtml(messages.addNote)}</button>
          </div>
        </form>
      </article>
    `;
  }).join("");

  root.querySelectorAll(".snapshot-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      openImagePreview({
        src: button.dataset.imageSrc,
        title: button.dataset.imageTitle,
        meta: button.dataset.imageMeta,
      });
    });
  });

  root.querySelectorAll(".event-status-action").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await apiRequest({
          path: `/events/${encodeURIComponent(button.dataset.eventId)}/status`,
          method: "PATCH",
          body: { status: button.dataset.status },
        });
        setStatus("eventActionStatus", `${messages.saved}: ${button.dataset.status}`, "success", true);
        await loadEvents();
      } catch (error) {
        setStatus("eventActionStatus", formatApiError(error), "error", true);
      }
    });
  });

  root.querySelectorAll(".event-note-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = form.querySelector(".event-note-input");
      const note = String(input.value || "").trim();
      if (!note) return;
      try {
        await apiRequest({
          path: `/events/${encodeURIComponent(form.dataset.eventId)}/notes`,
          method: "POST",
          body: { note },
        });
        input.value = "";
        setStatus("eventActionStatus", messages.noteSaved, "success", true);
      } catch (error) {
        setStatus("eventActionStatus", formatApiError(error), "error", true);
      }
    });
  });
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

  chart.innerHTML = normalized.map((item) => `
    <div class="flex min-h-[220px] flex-col justify-end gap-3 rounded-[10px_18px_12px_20px] bg-paper-warm/75 p-3">
      <div class="flex flex-1 items-end gap-2">
        <div class="flex-1 rounded-t-xl bg-ochre/85" style="height:${Math.max(10, (item.events / maxEvents) * 100)}%"></div>
        <div class="flex-1 rounded-t-xl bg-ink/80" style="height:${Math.max(10, (item.confidence / maxConfidence) * 100)}%"></div>
      </div>
      <div class="text-center">
        <p class="font-mono text-xs font-semibold text-ink">${escapeHtml(item.label)}</p>
        <p class="text-[11px] text-ink-mute">${escapeHtml(String(item.events))} / ${escapeHtml(String(item.confidence))}</p>
      </div>
    </div>
  `).join("");

  const detections = Number(state.report?.total_detections ?? 0);
  const zones = Array.isArray(state.report?.high_risk_zones) ? state.report.high_risk_zones.length : 0;
  const trend = state.analytics?.trend || state.report?.trend || "—";

  highlights.innerHTML = [
    [messages.detections, detections],
    [messages.highRiskZones, zones],
    [messages.trend, trend],
  ].map(([label, value]) => `
    <article class="rounded-[10px_18px_12px_20px] border border-edge/45 bg-paper-warm/65 p-4">
      <p class="text-xs uppercase tracking-[0.18em] text-ink-mute">${escapeHtml(label)}</p>
      <p class="mt-2 font-display text-3xl font-bold text-ink">${escapeHtml(value)}</p>
    </article>
  `).join("");

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
    ? items.slice(0, 6).map((event) => {
        const conf = typeof event.confidence === "number" ? `${Math.round(event.confidence * 100)}%` : (event.confidence ?? "—");
        const status = getEventStatus(event);
        return `
          <article class="rounded-[10px_18px_12px_20px] border border-edge/45 bg-paper-warm/72 p-3">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-mono text-sm font-semibold text-ink">${escapeHtml(event.camera_id || `${messages.camera}?`)}</p>
                <p class="mt-1 text-xs text-ink-mute">${escapeHtml(formatTimestamp(event.timestamp))}</p>
              </div>
              ${statusBadge(conf, status.tone)}
            </div>
            <p class="mt-2 text-xs text-ink-soft">${escapeHtml(messages.barn)} ${escapeHtml(event.barn_id || "—")} · ${escapeHtml(messages.device)} ${escapeHtml(event.device_id || "—")}</p>
          </article>
        `;
      }).join("")
    : `<p class="text-sm text-ink-soft">${escapeHtml(messages.noCalendarEvents)}</p>`;
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
    root.innerHTML = renderEmptyState({
      title: locale === "uk" ? "Колег для цієї ролі немає" : "No coworkers in this role",
      copy: locale === "uk" ? "Створіть фермерів або персонал, щоб розподілити доступ до господарств і подій." : "Create farmers or staff to distribute access to barns and events.",
      actionLabel: locale === "uk" ? "Додати колегу" : "Add coworker",
      actionTab: "admin",
    });
    bindEmptyStateActions(root);
    return;
  }
  root.innerHTML = items.map((user) => `
    <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/65 p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="font-display text-lg font-semibold text-ink">${escapeHtml(`${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "—")}</p>
          <p class="mt-1 text-sm text-ink-soft">${escapeHtml(user.username || "—")}</p>
          <p class="mt-1 text-xs text-ink-mute">${escapeHtml(user.email || "—")}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <select class="field coworker-role-select" data-username="${escapeHtml(user.username || "")}" style="width:auto">
            <option value="admins" ${user.role === "admins" ? "selected" : ""}>admins</option>
            <option value="farmers" ${user.role === "farmers" ? "selected" : ""}>farmers</option>
            <option value="staff" ${user.role === "staff" ? "selected" : ""}>staff</option>
          </select>
          <button type="button" class="btn-secondary coworker-delete" data-username="${escapeHtml(user.username || "")}">${escapeHtml(messages.delete)}</button>
        </div>
      </div>
    </article>
  `).join("");

  root.querySelectorAll(".coworker-role-select").forEach((select) => {
    select.addEventListener("change", async () => {
      try {
        await apiRequest({
          path: `/admin/users/${encodeURIComponent(select.dataset.username)}/role`,
          method: "PATCH",
          body: { new_role: select.value },
        });
        setStatus("coworkerStatus", messages.saved, "success", true);
        await loadAdminData();
      } catch (error) {
        setStatus("coworkerStatus", formatApiError(error), "error", true);
      }
    });
  });

  root.querySelectorAll(".coworker-delete").forEach((button) => {
    button.addEventListener("click", async () => {
      const confirmed = await confirmAction(messages.confirmDeleteUser);
      if (!confirmed) return;
      try {
        await apiRequest({ path: `/users/${encodeURIComponent(button.dataset.username)}`, method: "DELETE" });
        setStatus("coworkerStatus", messages.deleted, "success", true);
        await loadAdminData();
      } catch (error) {
        setStatus("coworkerStatus", formatApiError(error), "error", true);
      }
    });
  });

  renderAuditLogs();
}

function renderAuditLogs() {
  const root = el("auditLogsList");
  if (!root) return;
  if (!state.auditLogs.length) {
    root.innerHTML = `<p class="text-sm text-ink-soft">${escapeHtml(messages.auditEmpty)}</p>`;
    return;
  }

  root.innerHTML = state.auditLogs.slice(0, 20).map((entry) => `
    <article class="rounded-[12px_22px_14px_24px] border border-edge/45 bg-paper-warm/72 p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="font-display text-lg font-semibold text-ink">${escapeHtml(entry.action || entry.event || entry.type || "audit")}</p>
          <p class="mt-1 text-xs text-ink-mute">${escapeHtml(formatTimestamp(entry.timestamp || entry.created_at))}</p>
        </div>
        ${statusBadge(entry.status || entry.result || "log", "neutral")}
      </div>
      <pre class="mt-3 overflow-auto rounded-[10px_18px_12px_20px] bg-paper-soft p-3 text-xs text-ink-soft">${escapeHtml(JSON.stringify(entry, null, 2))}</pre>
    </article>
  `).join("");
}

function renderSystemCards() {
  const root = el("systemCards");
  if (!root) return;
  const cards = [
    ["Version", state.systemVersion],
    ["System health", state.systemHealth],
    ["Admin health", state.adminSystemHealth],
    ["Config", state.systemConfig],
  ].filter(([, value]) => value);

  root.innerHTML = cards.map(([label, value]) => `
    <div class="rounded-[1.2rem_1.8rem_1.4rem_2rem] border border-edge/45 bg-paper-warm/65 p-4">
      <p class="text-xs uppercase tracking-[0.18em] text-ink-mute">${escapeHtml(label)}</p>
      <pre class="mt-2 overflow-auto text-xs text-ink-soft">${escapeHtml(JSON.stringify(value, null, 2))}</pre>
    </div>
  `).join("");
}

async function loadProfile() {
  state.me = await apiRequest({ path: "/user/me" });
  const fullName = [state.me.first_name, state.me.middle_name, state.me.last_name].filter(Boolean).join(" ") || state.me.username || messages.userFallback;
  setText("meName", fullName);
  setText("meUsername", state.me.username || "—");
  renderProfile();
}

async function loadSessions() {
  try {
    const response = await apiRequest({ path: "/user/me/sessions" });
    state.sessions = Array.isArray(response) ? response : response.items || response.sessions || [];
  } catch {
    state.sessions = [];
  }
  setText("sessionCountValue", String(state.sessions.length));
  setText("sessionCountLabel", `${messages.loaded}: ${state.sessions.length}`);
  renderSessions();
}

async function loadApiKeys() {
  try {
    const response = await apiRequest({ path: "/api-keys" });
    const candidate = response?.api_keys ?? response?.keys ?? response?.items ?? response;
    const normalized = Array.isArray(candidate)
      ? candidate
      : Array.isArray(candidate?.items)
        ? candidate.items
        : Array.isArray(candidate?.api_keys)
          ? candidate.api_keys
          : [];

    state.apiKeys = normalized;
  } catch {
    state.apiKeys = [];
  }

  const lastUsed = state.apiKeys
    .map((item) => item?.last_used_at || item?.last_used || item?.last_used_date)
    .filter(Boolean)
    .sort()
    .at(-1);
  setText("apiKeyCountValue", String(state.apiKeys.length));
  setText("apiKeyCountLabel", `${messages.lastUsed}: ${lastUsed ? formatTimestamp(lastUsed) : messages.never}`);
  renderApiKeys();
}

async function loadEvents() {
  let partial = false;
  let skippedWindows = 0;
  try {
    const response = await apiRequest({ path: "/events", query: buildQuery({ limit: 120 }) });
    state.events = response.events || response.items || response || [];
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

async function loadHealthAndMetrics() {
  const dot = document.querySelector("[data-api-health]");
  const label = document.querySelector("[data-api-health-label]");
  try {
    const response = await fetch("/app/api/health");
    const data = await response.json();
    const ok = response.ok && String(data.status || "").toLowerCase() === "ok";
    setText("systemHealth", ok ? messages.systemHealthy : messages.systemDegraded);
    if (dot) dot.className = `status-dot ${ok ? "is-ok" : "is-bad"}`;
    if (label) label.textContent = ok ? `API · ${data.status || "ok"}` : `API · ${messages.unavailable}`;
  } catch {
    setText("systemHealth", messages.unavailable);
    if (dot) dot.className = "status-dot is-bad";
    if (label) label.textContent = `API · ${messages.unavailable}`;
  }
  try {
    state.systemHealth = await apiRequest({ path: "/system/health" });
  } catch {
    state.systemHealth = null;
  }
  try {
    state.systemVersion = await apiRequest({ path: "/system/version" });
  } catch {
    state.systemVersion = null;
  }
  try {
    state.systemConfig = await apiRequest({ path: "/system/config" });
  } catch {
    state.systemConfig = null;
  }
  if (role === "admins") {
    try {
      state.adminSystemHealth = await apiRequest({ path: "/admin/system-health" });
    } catch {
      state.adminSystemHealth = null;
    }
  }
  renderSystemCards();
  try {
    const metrics = await apiRequest({ path: "/metrics", expectText: true });
    setText("metricsOutput", metrics || "");
  } catch {
    setText("metricsOutput", messages.metricsUnavailable);
  }
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
  try {
    const audit = await apiRequest({ path: "/admin/audit-logs", query: buildQuery({ limit: 20 }) });
    state.auditLogs = Array.isArray(audit) ? audit : audit.items || audit.logs || [];
  } catch {
    state.auditLogs = [];
  }
  renderAdmin();
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
  el("refreshSessionsBtn")?.addEventListener("click", loadSessions);
  el("refreshAuditLogsBtn")?.addEventListener("click", loadAdminData);

  el("listApiKeysBtn")?.addEventListener("click", async () => {
    setStatus("apiKeyCreateStatus", messages.loading);
    try {
      await loadApiKeys();
      setStatus("apiKeyCreateStatus", messages.loaded, "success", true);
    } catch (error) {
      renderApiKeyError(error);
      setStatus("apiKeyCreateStatus", formatApiError(error), "error", true);
    }
  });

  el("createApiKeyBtn")?.addEventListener("click", () => {
    el("apiKeyName").focus();
    el("apiKeyForm").requestSubmit();
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
      setStatus("profileStatus", messages.saved, "success", true);
    } catch (error) {
      setStatus("profileStatus", formatApiError(error), "error", true);
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
      setStatus("profileStatus", messages.saved, "success", true);
    } catch (error) {
      setStatus("profileStatus", formatApiError(error), "error", true);
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
      setStatus("profileStatus", messages.saved, "success", true);
    } catch (error) {
      setStatus("profileStatus", formatApiError(error), "error", true);
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
      setStatus("profileStatus", messages.saved, "success", true);
    } catch (error) {
      setStatus("profileStatus", formatApiError(error), "error", true);
    }
  });

  el("apiKeyForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const scopes = String(el("apiKeyScopes").value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const payload = await apiRequest({
        path: "/api-keys",
        method: "POST",
        body: {
          name: el("apiKeyName").value || "BarnSight Edge Device",
          device_id: el("apiKeyDeviceId").value || undefined,
          barn_id: el("apiKeyBarnId").value || undefined,
          expires_in_days: el("apiKeyExpiresDays").value ? Number(el("apiKeyExpiresDays").value) : undefined,
          scopes,
        },
      });
      ["apiKeyName", "apiKeyDeviceId", "apiKeyBarnId", "apiKeyExpiresDays", "apiKeyScopes"].forEach((id) => {
        if (el(id)) el(id).value = "";
      });
      const reveal = el("apiKeyReveal");
      reveal.className = "notice mt-4";
      reveal.style.borderColor = "rgb(var(--ok) / 0.55)";
      reveal.style.background = "rgb(var(--ok-soft))";
      reveal.style.color = "rgb(var(--ok))";
      reveal.textContent = `${messages.apiKeyCreated} ${payload.key || ""} ${messages.copiedNow}`;
      setStatus("apiKeyCreateStatus", messages.created, "success", true);
      await loadApiKeys();
    } catch (error) {
      renderApiKeyError(error);
      setStatus("apiKeyCreateStatus", formatApiError(error), "error", true);
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
        setStatus("coworkerStatus", messages.created, "success", true);
        await loadAdminData();
      } catch (error) {
        setStatus("coworkerStatus", formatApiError(error), "error", true);
      }
    });
  }
}

function bindDialogs() {
  el("imagePreviewClose").addEventListener("click", () => el("imagePreviewModal").close());
}

function setInitialLoadingState() {
  renderSkeletonCards("apiKeysList", 2);
  renderSkeletonCards("eventsList", 3);
}

async function init() {
  setActiveTab(state.currentTab);
  renderQuickActions();
  setInitialLoadingState();
  setLastRefresh();
  const primary = await Promise.allSettled([
    loadProfile(),
    loadSessions(),
    loadApiKeys(),
    loadEvents(),
    loadHealthAndMetrics(),
  ]);
  const secondary = await Promise.allSettled([loadAdminData()]);

  const failures = [...primary, ...secondary].filter((item) => item.status === "rejected");
  const apiKeyFailure = primary[2];
  if (apiKeyFailure?.status === "rejected") {
    renderApiKeyError(apiKeyFailure.reason);
  }

  renderSetupChecklist();
  if (failures.length) {
    return;
  }
}

bindTabs();
bindForms();
bindDialogs();
init();
