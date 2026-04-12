import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { callApi, getApiBaseUrl, loginWithPassword, normalizeApiError } from "./apiClient.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));

app.use(
  session({
    name: "barnsight.sid",
    secret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

app.use("/assets", express.static(path.join(__dirname, "..", "public", "assets")));
app.use("/public", express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user?.token) {
    return res.status(401).json({ message: "Потрібна авторизація" });
  }
  return next();
}

async function proxyJson(req, res, { path: apiPath, method = "GET", queryFromReq = true, bodyFromReq = false }) {
  try {
    const token = req.session.user?.token;
    const query = queryFromReq ? req.query : undefined;
    const body = bodyFromReq ? req.body : undefined;
    const result = await callApi({ path: apiPath, method, token, query, body });
    if (!result.ok) {
      return res.status(result.status).json(result.error);
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(502).json({
      message: "Не вдалося отримати відповідь від BarnSight API.",
      status: 502,
      endpoint: apiPath,
      details: [{ field: null, message: error?.message || "Unknown network error", type: "network_error" }],
    });
  }
}

app.get("/", (req, res) => {
  res.render("index", {
    apiBaseUrl: getApiBaseUrl(),
  });
});

app.get("/login", (req, res) => {
  if (req.session.user?.token) {
    return res.redirect("/dashboard");
  }

  return res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).render("login", { error: "Вкажіть логін і пароль." });
  }

  try {
    const result = await loginWithPassword(username, password);
    if (!result.ok || !result.data?.access_token) {
      const errorLines = [
        `Помилка авторизації (HTTP ${result.status})`,
        result.error?.message || "Невірний логін або пароль.",
      ];
      if (result.error?.details?.length) {
        for (const detail of result.error.details) {
          errorLines.push(`- ${detail.field || "payload"}: ${detail.message}`);
        }
      }
      return res.status(result.status).render("login", { error: errorLines.join("\n") });
    }

    req.session.user = {
      username,
      token: result.data.access_token,
      role: result.data.role || "user",
    };

    return res.redirect("/dashboard");
  } catch (error) {
    return res.status(502).render("login", {
      error: `Помилка підключення до BarnSight API.\n${error?.message || "Unknown network error"}`,
    });
  }
});

app.post("/logout", async (req, res) => {
  try {
    if (req.session.user?.token) {
      await callApi({ path: "/api/v1/auth/logout", method: "POST", token: req.session.user.token });
    }
  } catch {
    // Continue regardless of upstream logout result.
  }

  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user?.token) {
    return res.redirect("/login");
  }

  return res.render("dashboard", {
    role: req.session.user.role || "user",
  });
});

app.get("/app/api/health", async (_req, res) => {
  try {
    const result = await callApi({ path: "/api/v1/health", method: "GET" });
    if (!result.ok) {
      return res.status(result.status).json(result.error);
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(502).json(
      normalizeApiError({
        status: 502,
        path: "/api/v1/health",
        data: { message: error?.message || "API недоступне" },
      }),
    );
  }
});

app.get("/app/api/user/me", requireAuth, async (req, res) => proxyJson(req, res, { path: "/api/v1/user/me" }));
app.get("/app/api/barns", requireAuth, async (req, res) => proxyJson(req, res, { path: "/api/v1/barns" }));
app.get("/app/api/barns/:barnId", requireAuth, async (req, res) =>
  proxyJson(req, res, { path: `/api/v1/barns/${req.params.barnId}`, queryFromReq: false }),
);
app.get("/app/api/events", requireAuth, async (req, res) => proxyJson(req, res, { path: "/api/v1/events" }));
app.get("/app/api/analytics", requireAuth, async (req, res) => proxyJson(req, res, { path: "/api/v1/analytics" }));
app.get("/app/api/detections", requireAuth, async (req, res) => proxyJson(req, res, { path: "/api/v1/detections" }));
app.get("/app/api/reports/custom", requireAuth, async (req, res) =>
  proxyJson(req, res, { path: "/api/v1/reports/custom" }),
);
app.get("/app/api/admin/dashboard", requireAuth, async (req, res) =>
  proxyJson(req, res, { path: "/api/v1/admin/dashboard", queryFromReq: false }),
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`BarnSight UA site running at http://localhost:${port}`);
});
