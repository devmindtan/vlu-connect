const msal = require("@azure/msal-node");
const { Client } = require("@microsoft/microsoft-graph-client");
require("dotenv").config();
const session = require("express-session");
const express = require("express");
const path = require("path");

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/common`,
    clientSecret: process.env.CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Info,
    },
  },
};

const SCOPES = ["profile", "User.Read"];

const pca = new msal.ConfidentialClientApplication(msalConfig);

// ─── Express Setup ────────────────────────────────────────────────────────────
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(express.static(path.join(__dirname, "public")));

// ─── Helper: tạo Graph Client ─────────────────────────────────────────────────
function getGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}

async function getValidToken(req) {
  return req.session?.accessToken || null;
}

app.get("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/auth/login", (req, res) => {
  req.session.destroy(() => {});

  pca
    .getAuthCodeUrl({
      scopes: SCOPES,
      redirectUri: process.env.REDIRECT_URI,
      prompt: "consent",
    })
    .then((url) => res.redirect(url))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Lỗi khi tạo URL đăng nhập.");
    });
});

app.get("/auth/callback", async (req, res) => {
  try {
    const response = await pca.acquireTokenByCode({
      code: req.query.code,
      scopes: SCOPES,
      redirectUri: process.env.REDIRECT_URI,
    });

    req.session.account = response.account;
    req.session.accessToken = response.accessToken;

    console.log(
      `[AUTH] Success: ${response.account?.username} | Token: ${response.accessToken.length}`,
    );

    res.redirect("/dashboard.html");
  } catch (error) {
    console.error("[AUTH] Error:", error.message);
    res.status(500).send(error.message || "Xác thực thất bại.");
  }
});

app.get("/api/me", async (req, res) => {
  const token = await getValidToken(req);
  if (!token)
    return res
      .status(401)
      .json({ error: "Chưa đăng nhập. Vào /auth/login để đăng nhập lại." });

  try {
    const client = getGraphClient(token);
    const profile = await client.api("/me").get();
    res.json({ profile });
  } catch (err) {
    console.error("[/api/me] Lỗi:", err.statusCode, err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📝 Đăng nhập tại http://localhost:${PORT}/auth/login`);
});
