function getDateRange() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const barnId = document.getElementById("barnId").value;

  return { start, end, barn_id: barnId };
}

function buildQuery(params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const normalized = String(value).trim();
    if (!normalized || normalized === "undefined" || normalized === "null") continue;
    query.set(key, normalized);
  }
  return query;
}

function setPrettyJson(id, payload) {
  document.getElementById(id).textContent = JSON.stringify(payload, null, 2);
}

function setFiltersStatus(text, tone = "neutral") {
  const el = document.getElementById("filtersStatus");
  if (!el) return;
  el.textContent = text;
  if (tone === "error") {
    el.className = "mt-3 text-xs text-red-300";
    return;
  }
  if (tone === "success") {
    el.className = "mt-3 text-xs text-zinc-300";
    return;
  }
  el.className = "mt-3 text-xs text-zinc-500";
}

function formatApiError(err) {
  if (!err) return { message: "Unknown error" };
  return {
    message: err.message || "Помилка запиту.",
    status: err.status || null,
    endpoint: err.endpoint || null,
    details: Array.isArray(err.details) ? err.details : [],
    upstream: err.upstream || null,
  };
}

function formatTimestamp(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function toImageSrc(snapshot) {
  if (!snapshot || typeof snapshot !== "string") return null;
  const trimmed = snapshot.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("data:image/")) return trimmed;
  const isPng = trimmed.startsWith("iVBOR");
  return `data:image/${isPng ? "png" : "jpeg"};base64,${trimmed}`;
}

async function fetchJson(url) {
  const response = await fetch(url, { credentials: "include" });
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = { message: "Некоректна JSON-відповідь від сервера." };
  }
  if (!response.ok) {
    const error = new Error(data?.message || `HTTP ${response.status}`);
    error.status = data?.status || response.status;
    error.endpoint = data?.endpoint || url;
    error.details = data?.details || [];
    error.upstream = data?.upstream ?? data;
    throw error;
  }
  return data;
}

function renderEvents(events) {
  const root = document.getElementById("eventsList");
  root.innerHTML = "";
  if (!Array.isArray(events) || events.length === 0) {
    root.innerHTML = '<p class="text-sm text-zinc-400">Події за вибраний період не знайдено.</p>';
    return;
  }

  for (const event of events) {
    const card = document.createElement("article");
    card.className = "rounded-xl border border-zinc-800 bg-zinc-900 p-3";

    const imageSrc = toImageSrc(event.image_snapshot);
    const head = document.createElement("div");
    head.className = "mb-2 text-xs text-zinc-400";
    head.textContent = `${event.camera_id || "camera?"} • ${formatTimestamp(event.timestamp)}`;
    card.appendChild(head);

    if (imageSrc) {
      const img = document.createElement("img");
      img.src = imageSrc;
      img.loading = "lazy";
      img.alt = "Snapshot детекції";
      img.className = "mb-3 h-40 w-full rounded-lg border border-zinc-800 object-cover";
      card.appendChild(img);
    }

    const info = document.createElement("div");
    info.className = "space-y-1 text-xs text-zinc-300";
    info.innerHTML = `
      <p><span class="text-zinc-500">ID:</span> ${event._id || "-"}</p>
      <p><span class="text-zinc-500">Confidence:</span> ${event.confidence ?? "-"}</p>
      <p><span class="text-zinc-500">Device:</span> ${event.device_id || "-"}</p>
    `;
    card.appendChild(info);

    root.appendChild(card);
  }
}

async function loadDashboard() {
  const me = await fetchJson("/app/api/user/me");
  const barns = await fetchJson("/app/api/barns");

  const meName =
    [me.first_name, me.middle_name, me.last_name].filter(Boolean).join(" ") ||
    me.username ||
    "Користувач";

  document.getElementById("meName").textContent = meName;
  document.getElementById("barnCount").textContent = String((barns.barns || []).length);
}

async function loadReports() {
  const range = getDateRange();
  if (!range.start || !range.end) {
    throw new Error("Оберіть початкову і кінцеву дати.");
  }

  const query = buildQuery(range);
  const [analyticsResult, reportResult, detectionsResult, eventsResult] = await Promise.allSettled([
    fetchJson(`/app/api/analytics?${query.toString()}`),
    fetchJson(`/app/api/reports/custom?${query.toString()}`),
    fetchJson(`/app/api/detections?${query.toString()}`),
    fetchJson(`/app/api/events?limit=30`),
  ]);

  let analytics = null;
  let report = null;

  if (analyticsResult.status === "fulfilled") {
    analytics = analyticsResult.value;
    setPrettyJson("analyticsOut", analyticsResult.value);
  } else {
    setPrettyJson("analyticsOut", {
      error: formatApiError(analyticsResult.reason),
      hint: "Аналітика недоступна для цього періоду або акаунта.",
    });
  }

  if (reportResult.status === "fulfilled") {
    report = reportResult.value;
    setPrettyJson("reportOut", reportResult.value);
  } else {
    setPrettyJson("reportOut", {
      error: formatApiError(reportResult.reason),
      hint: "Звіт недоступний для цього періоду або акаунта.",
    });
  }

  if (detectionsResult.status === "fulfilled") {
    setPrettyJson("detectionsOut", detectionsResult.value);
  } else {
    setPrettyJson("detectionsOut", {
      error: formatApiError(detectionsResult.reason),
      hint: "Відоме обмеження бекенду: endpoint /detections інколи повертає 500 при порожній/деякій вибірці.",
    });
  }

  if (eventsResult.status === "fulfilled") {
    const events = eventsResult.value;
    document.getElementById("eventCount").textContent = String(events.total || 0);
    renderEvents(events.events || []);
  } else {
    document.getElementById("eventCount").textContent = "—";
    renderEvents([]);
  }

  document.getElementById("trend").textContent = analytics?.trend || report?.trend || "—";
}

function setDefaultDates() {
  const now = new Date();
  const end = now.toISOString().slice(0, 10);
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 7);
  const start = startDate.toISOString().slice(0, 10);
  document.getElementById("startDate").value = start;
  document.getElementById("endDate").value = end;
}

async function init() {
  try {
    setDefaultDates();
    setFiltersStatus("Завантаження даних...");
    await loadDashboard();
    await loadReports();
    setFiltersStatus("Дані завантажено.");
  } catch (error) {
    const formatted = formatApiError(error);
    setPrettyJson("analyticsOut", { error: formatted, hint: "Помилка 4xx/5xx або мережі під час ініціалізації." });
    setPrettyJson("reportOut", { error: formatted, hint: "Звіт не завантажено." });
    setPrettyJson("detectionsOut", { error: formatted, hint: "Детекції не завантажено." });
    setFiltersStatus("Не вдалося завантажити дані при ініціалізації.", "error");
  }
}

document.getElementById("filtersForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = document.getElementById("applyFiltersBtn");
  const previousLabel = button.textContent;
  button.disabled = true;
  button.textContent = "Оновлення...";
  setFiltersStatus("Застосування фільтрів...");
  try {
    await loadReports();
    setFiltersStatus(`Фільтри застосовано: ${new Date().toLocaleTimeString("uk-UA")}`, "success");
  } catch (error) {
    const formatted = formatApiError(error);
    setPrettyJson("analyticsOut", { error: formatted, hint: "Перевірте дати, barn_id та права доступу." });
    setPrettyJson("reportOut", { error: formatted });
    setPrettyJson("detectionsOut", { error: formatted });
    setFiltersStatus("Помилка застосування фільтрів. Дивіться деталі нижче.", "error");
  } finally {
    button.disabled = false;
    button.textContent = previousLabel;
  }
});

document.getElementById("refreshBtn").addEventListener("click", init);
init();
