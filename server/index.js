import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import {
  callApi,
  fetchEventsResilient,
  getApiBaseUrl,
  loginWithPassword,
  normalizeApiError,
  registerAccount,
} from "./apiClient.js";
import { createTranslator, normalizeLocale, supportedLocales } from "./i18n.js";

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
  if (typeof req.query.lang === "string") {
    req.session.locale = normalizeLocale(req.query.lang);
  }
  const locale = normalizeLocale(req.session.locale || req.acceptsLanguages(supportedLocales) || "uk");
  const t = createTranslator(locale);
  const queryWithoutLang = { ...req.query };
  delete queryWithoutLang.lang;
  res.locals.locale = locale;
  res.locals.t = t;
  res.locals.languageLinks = supportedLocales.map((language) => {
    const params = new URLSearchParams(queryWithoutLang);
    params.set("lang", language);
    return {
      label: language.toUpperCase(),
      href: `${req.path}?${params.toString()}`,
      active: language === locale,
    };
  });
  res.locals.currentUser = req.session.user || null;
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user?.token) {
    return res.status(401).json({ message: res.locals.t("error.authRequired") });
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
      message: res.locals.t("error.apiResponse"),
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

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/faq", (req, res) => {
  res.render("faq");
});

app.get("/pricing", (req, res) => {
  res.render("pricing");
});

app.get("/api-console", (req, res) => {
  if (!req.session.user?.token) {
    return res.redirect("/login");
  }

  return res.render("api-console", {
    role: req.session.user.role || "user",
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
    return res.status(400).render("login", { error: res.locals.t("error.loginRequired") });
  }

  try {
    const result = await loginWithPassword(username, password);
    if (!result.ok || !result.data?.access_token) {
      const errorLines = [
        `Помилка авторизації (HTTP ${result.status})`,
        result.error?.message || res.locals.t("error.invalidLogin"),
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
      error: `${res.locals.t("error.apiConnection")}\n${error?.message || "Unknown network error"}`,
    });
  }
});

function renderRegistration(req, res, statusCode = 200, data = {}) {
  return res.status(statusCode).render("register", {
    error: null,
    success: null,
    form: {},
    isAdmin: req.session.user?.role === "admins",
    ...data,
  });
}

function formatRegistrationError(result) {
  const errorLines = [
    `Помилка реєстрації (HTTP ${result.status})`,
    result.error?.message || "Не вдалося створити акаунт.",
  ];
  if (result.error?.details?.length) {
    for (const detail of result.error.details) {
      errorLines.push(`- ${detail.field || "payload"}: ${detail.message}`);
    }
  }
  return errorLines.join("\n");
}

app.get("/register", (req, res) => renderRegistration(req, res));

app.post("/register", async (req, res) => {
  const { first_name, middle_name, last_name, username, email, password } = req.body;
  const requestedType = req.body.accountType || "admin";
  const isAdmin = req.session.user?.role === "admins";
  const accountType = isAdmin ? (["farmers", "staff"].includes(requestedType) ? requestedType : "farmers") : "admin";

  const form = { first_name, middle_name, last_name, username, email, accountType };
  if (!first_name || !middle_name || !last_name || !username || !email || !password) {
    return renderRegistration(req, res, 400, {
      error: res.locals.t("error.registrationRequired"),
      form,
    });
  }

  if (password.length < 8) {
    return renderRegistration(req, res, 400, {
      error: res.locals.t("error.passwordLength"),
      form,
    });
  }

  try {
    const result = await registerAccount({
      accountType,
      token: accountType === "admin" ? undefined : req.session.user?.token,
      payload: {
        first_name,
        middle_name,
        last_name,
        username,
        email,
        password,
      },
    });

    if (!result.ok) {
      return renderRegistration(req, res, result.status, { error: formatRegistrationError(result), form });
    }

    if (accountType === "admin") {
      const loginResult = await loginWithPassword(username, password);
      if (loginResult.ok && loginResult.data?.access_token) {
        req.session.user = {
          username,
          token: loginResult.data.access_token,
          role: loginResult.data.role || "admins",
        };
        return res.redirect("/dashboard");
      }
    }

    return renderRegistration(req, res, 201, {
      success:
        accountType === "admin"
          ? res.locals.t("register.adminCreated")
          : res.locals.t("register.userCreated"),
      form: {},
    });
  } catch (error) {
    return renderRegistration(req, res, 502, {
      error: `${res.locals.t("error.apiConnection")}\n${error?.message || "Unknown network error"}`,
      form,
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
app.get("/app/api/events", requireAuth, async (req, res) => {
  try {
    const result = await fetchEventsResilient({
      token: req.session.user?.token,
      query: req.query,
    });
    if (!result.ok) {
      return res.status(result.status).json(result.error);
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(502).json({
      message: res.locals.t("error.apiResponse"),
      status: 502,
      endpoint: "/api/v1/events",
      details: [{ field: null, message: error?.message || "Unknown network error", type: "network_error" }],
    });
  }
});
app.get("/app/api/analytics", requireAuth, async (req, res) => proxyJson(req, res, { path: "/api/v1/analytics" }));
app.get("/app/api/detections", requireAuth, async (req, res) => proxyJson(req, res, { path: "/api/v1/detections" }));
app.get("/app/api/reports/custom", requireAuth, async (req, res) =>
  proxyJson(req, res, { path: "/api/v1/reports/custom" }),
);
app.get("/app/api/admin/dashboard", requireAuth, async (req, res) =>
  proxyJson(req, res, { path: "/api/v1/admin/dashboard", queryFromReq: false }),
);

app.get("/app/api/metrics", requireAuth, async (req, res) => {
  try {
    const result = await callApi({ path: "/metrics", method: "GET", token: req.session.user?.token });
    if (!result.ok) {
      return res.status(result.status).json(result.error);
    }
    return res.status(result.status).send(
      typeof result.data === "string" ? result.data : JSON.stringify(result.data, null, 2),
    );
  } catch (error) {
    return res.status(502).json({
      message: "Не вдалося отримати metrics від BarnSight API.",
      status: 502,
      endpoint: "/metrics",
      details: [{ field: null, message: error?.message || "Unknown network error", type: "network_error" }],
    });
  }
});

app.all(/^\/app\/api\/v1\/(.+)$/, requireAuth, async (req, res) => {
  const apiPath = `/api/v1/${req.params[0]}`;
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : { ...req.body };
  const apiKey = req.get("x-edge-api-key") || body?.__apiKey;
  if (body && "__apiKey" in body) {
    delete body.__apiKey;
  }

  try {
    if (apiPath === "/api/v1/events" && req.method === "GET") {
      const result = await fetchEventsResilient({
        token: apiKey ? undefined : req.session.user?.token,
        apiKey,
        query: req.query,
      });
      if (!result.ok) {
        return res.status(result.status).json(result.error);
      }
      return res.status(result.status).json(result.data);
    }

    const result = await callApi({
      path: apiPath,
      method: req.method,
      token: apiKey ? undefined : req.session.user?.token,
      apiKey,
      query: req.query,
      body,
    });
    if (!result.ok) {
      return res.status(result.status).json(result.error);
    }
    if (result.status === 204) {
      return res.status(204).send();
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
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`BarnSight UA site running at http://localhost:${port}`);
});
