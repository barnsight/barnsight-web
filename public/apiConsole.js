const locale = window.APP_LOCALE === "en" ? "en" : "uk";
const ui = {
  uk: {
    invalidJson: "Некоректний JSON body",
    loading: "Завантаження...",
    edgeRequired: "bs_... потрібен для edge-only запитів",
    edgeOptional: "Опційно: bs_...",
  },
  en: {
    invalidJson: "Invalid JSON body",
    loading: "Loading...",
    edgeRequired: "bs_... required for edge-only calls",
    edgeOptional: "Optional: bs_...",
  },
}[locale];

const endpoints = [
  {
    group: "Authentication",
    items: [
      { method: "POST", path: "/auth/token", note: "Refresh/revoke current JWT" },
      { method: "POST", path: "/auth/logout", note: "Logout through API" },
      { method: "GET", path: "/auth/google", note: "Google OAuth redirect; open API URL directly" },
    ],
  },
  {
    group: "Profile",
    items: [
      { method: "GET", path: "/user/me", note: "Current profile with assigned barns" },
      {
        method: "PATCH",
        path: "/user/me",
        note: "Update current profile",
        body: { first_name: "First name", middle_name: "Middle name", last_name: "Last name" },
      },
      {
        method: "PATCH",
        path: "/user/me/password",
        note: "Change password",
        body: { current_password: "current-password", new_password: "new-password" },
      },
      {
        method: "PATCH",
        path: "/user/email",
        note: "Update email",
        body: { email: "user@example.com", password: "current-password" },
      },
      {
        method: "PATCH",
        path: "/user/password",
        note: "Recover password by email",
        body: { email: "user@example.com", new_password: "new-password" },
      },
    ],
  },
  {
    group: "API Keys",
    items: [
      { method: "GET", path: "/api-keys", note: "List edge API keys" },
      { method: "POST", path: "/api-keys", note: "Create edge API key", body: { name: "Barn 1 Edge Device" } },
      { method: "DELETE", path: "/api-keys/{key_id}", note: "Revoke edge API key" },
    ],
  },
  {
    group: "Barns",
    items: [
      { method: "GET", path: "/barns", note: "List accessible barns" },
      { method: "GET", path: "/barns/{barn_id}", note: "Read one barn" },
      { method: "GET", path: "/barns/{barn_id}/devices", note: "List barn devices" },
      { method: "GET", path: "/barns/{barn_id}/cameras", note: "List barn cameras" },
      { method: "GET", path: "/barns/{barn_id}/hygiene-summary", note: "Barn hygiene summary" },
    ],
  },
  {
    group: "Devices",
    items: [
      {
        method: "POST",
        path: "/devices",
        note: "Create/update edge host",
        body: { device_id: "edge-01", barn_id: "1", name: "North gateway", location: "North aisle", status: "offline" },
      },
      { method: "GET", path: "/devices", note: "List devices; optional ?barn_id=1" },
      { method: "GET", path: "/devices/{device_id}", note: "Read device" },
      { method: "GET", path: "/devices/{device_id}/status", note: "Device online status" },
      { method: "GET", path: "/devices/{device_id}/config", note: "Read remote config" },
      {
        method: "PUT",
        path: "/devices/{device_id}/config",
        note: "Replace remote config",
        body: {
          enabled: true,
          inference_fps: 2,
          img_size: 640,
          min_confidence: 0.5,
          cooldown_seconds: 10,
          image_cooldown_seconds: 60,
          region_overlap_threshold: 0.3,
          jpeg_quality: 85,
          send_image_snapshot: true,
          snapshot_mode: "on_detection",
          max_image_bytes: 2000000,
          detection_zones: [],
        },
      },
      {
        method: "POST",
        path: "/devices/heartbeat",
        note: "Edge heartbeat; requires edge API key field",
        edge: true,
        body: { device_id: "edge-01", camera_id: "cam-01", barn_id: "1", status: "online" },
      },
    ],
  },
  {
    group: "Cameras & Zones",
    items: [
      {
        method: "POST",
        path: "/devices/{device_id}/cameras",
        note: "Create/update camera",
        body: { camera_id: "cam-01", device_id: "edge-01", barn_id: "1", name: "North camera", stream_label: "rtsp-redacted-a", status: "offline" },
      },
      { method: "GET", path: "/devices/{device_id}/cameras", note: "List device cameras" },
      { method: "GET", path: "/cameras/{camera_id}", note: "Read camera" },
      { method: "GET", path: "/cameras/{camera_id}/status", note: "Camera online status" },
      { method: "GET", path: "/devices/zones", note: "List zones; optional ?camera_id=cam-01&barn_id=1" },
      { method: "GET", path: "/cameras/{camera_id}/zones", note: "List camera zones" },
      {
        method: "POST",
        path: "/cameras/{camera_id}/zones",
        note: "Create camera zone",
        body: {
          zone_id: "north-floor",
          barn_id: "1",
          device_id: "edge-01",
          camera_id: "cam-01",
          polygon: [{ x: 0.1, y: 0.1 }, { x: 0.8, y: 0.1 }, { x: 0.8, y: 0.8 }],
          enabled: true,
          label: "North floor",
        },
      },
      { method: "PUT", path: "/cameras/{camera_id}/zones/{zone_id}", note: "Update camera zone" },
      { method: "DELETE", path: "/cameras/{camera_id}/zones/{zone_id}", note: "Delete camera zone" },
      { method: "GET", path: "/cameras/{camera_id}/detections", note: "Recent camera detections; optional ?limit=100" },
    ],
  },
  {
    group: "Events & Analytics",
    items: [
      {
        method: "POST",
        path: "/events",
        note: "Create detection event; JWT or edge API key",
        edge: true,
        body: {
          timestamp: new Date().toISOString(),
          camera_id: "cam-01",
          device_id: "edge-01",
          confidence: 0.92,
          bounding_box: { x: 100, y: 120, width: 80, height: 60 },
          barn_id: "1",
        },
      },
      { method: "GET", path: "/events", note: "Query events; optional ?limit=30&barn_id=1&camera_id=cam-01" },
      { method: "GET", path: "/analytics", note: "Analytics; requires ?start=YYYY-MM-DD&end=YYYY-MM-DD" },
      { method: "GET", path: "/detections", note: "Detections; requires ?start=YYYY-MM-DD&end=YYYY-MM-DD" },
      { method: "GET", path: "/reports/custom", note: "Report; requires ?start=YYYY-MM-DD&end=YYYY-MM-DD" },
    ],
  },
  {
    group: "Admin",
    admin: true,
    items: [
      { method: "GET", path: "/admin/dashboard", note: "Admin statistics" },
      {
        method: "POST",
        path: "/farmers",
        note: "Create farmer",
        body: { first_name: "First name", middle_name: "Middle name", last_name: "Last name", username: "farmer1", email: "farmer@example.com", password: "password123" },
      },
      {
        method: "POST",
        path: "/staff",
        note: "Create staff",
        body: { first_name: "First name", middle_name: "Middle name", last_name: "Last name", username: "staff1", email: "staff@example.com", password: "password123" },
      },
      { method: "GET", path: "/users/all/{role}", note: "List users by role: admins, farmers, staff, edge" },
      { method: "GET", path: "/users/{username}", note: "Read user" },
      { method: "PATCH", path: "/users/{username}", note: "Update user", body: { first_name: "Updated" } },
      { method: "DELETE", path: "/users/{username}", note: "Delete user" },
      { method: "PATCH", path: "/admin/users/{username}/role", note: "Change user role", body: { new_role: "staff" } },
    ],
  },
  {
    group: "System",
    items: [
      { method: "GET", path: "/health", note: "Health check" },
      { method: "GET", path: "/metrics", note: "Prometheus metrics; proxied separately because it is outside /api/v1" },
      { method: "GET", path: "/ws?token={jwt}", note: "WebSocket endpoint; use a WS client" },
    ],
  },
];

const endpointList = document.getElementById("endpointList");
const methodInput = document.getElementById("method");
const pathInput = document.getElementById("path");
const apiKeyInput = document.getElementById("apiKey");
const bodyInput = document.getElementById("body");
const responseOutput = document.getElementById("responseOutput");
const requestForm = document.getElementById("apiRequestForm");

function setRequest(endpoint) {
  methodInput.value = endpoint.method;
  pathInput.value = endpoint.path;
  bodyInput.value = endpoint.body ? JSON.stringify(endpoint.body, null, 2) : "";
  apiKeyInput.placeholder = endpoint.edge ? ui.edgeRequired : ui.edgeOptional;
}

function renderEndpoints() {
  endpointList.innerHTML = endpoints
    .map(
      (group) => `
        <section class="panel p-4">
          <h3 class="text-lg font-semibold">${group.group}</h3>
          <div class="mt-3 space-y-2">
            ${group.items
              .map(
                (endpoint) => `
                  <button
                    type="button"
                    class="endpoint-btn w-full rounded-lg border border-amber-900/15 bg-white/70 p-3 text-left transition hover:border-amber-700/40 hover:bg-white"
                    data-method="${endpoint.method}"
                    data-path="${endpoint.path}"
                  >
                    <span class="font-mono text-xs font-semibold text-amber-900">${endpoint.method}</span>
                    <span class="ml-2 font-mono text-sm text-zinc-900">${endpoint.path}</span>
                    <span class="mt-1 block text-xs text-zinc-600">${endpoint.note}</span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");

  endpointList.querySelectorAll(".endpoint-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const endpoint = endpoints.flatMap((group) => group.items).find(
        (item) => item.method === button.dataset.method && item.path === button.dataset.path,
      );
      if (endpoint) setRequest(endpoint);
    });
  });
}

function normalizePath(path) {
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return `/${trimmed}`;
  return trimmed;
}

async function submitRequest(event) {
  event.preventDefault();
  const method = methodInput.value;
  const path = normalizePath(pathInput.value);
  let body;

  try {
    body = bodyInput.value.trim() ? JSON.parse(bodyInput.value) : undefined;
  } catch (error) {
    responseOutput.textContent = `${ui.invalidJson}: ${error.message}`;
    return;
  }

  const headers = {};
  if (apiKeyInput.value.trim()) {
    headers["x-edge-api-key"] = apiKeyInput.value.trim();
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  responseOutput.textContent = ui.loading;
  try {
    const targetUrl = path === "/metrics" ? "/app/api/metrics" : `/app/api/v1${path}`;
    const response = await fetch(targetUrl, {
      method,
      headers,
      credentials: "include",
      body: ["GET", "HEAD"].includes(method) ? undefined : JSON.stringify(body ?? {}),
    });
    const text = await response.text();
    let payload = text;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }
    responseOutput.textContent = JSON.stringify({ status: response.status, ok: response.ok, data: payload }, null, 2);
  } catch (error) {
    responseOutput.textContent = JSON.stringify({ error: error.message }, null, 2);
  }
}

renderEndpoints();
setRequest(endpoints[2].items[1]);
requestForm.addEventListener("submit", submitRequest);
