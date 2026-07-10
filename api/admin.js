const OWNER = process.env.GITHUB_OWNER || "mandyaispace-glitch";
const REPO = process.env.GITHUB_REPO || "nextt-sustainable-salon";
const ALLOWED_ORIGINS = new Set([
  "https://mandyaispace-glitch.github.io",
  "http://localhost:8767",
  "http://127.0.0.1:8767",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function getCorsHeaders(req) {
  const origin = req.headers.origin;
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://mandyaispace-glitch.github.io",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function sendJson(res, status, payload, headers = {}) {
  res.statusCode = status;
  Object.entries({
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  }).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(payload));
}

function parseRsvpIssue(issue) {
  const match = issue.body?.match(/<!-- nextt-rsvp-json\s*([\s\S]*?)\s*-->/);
  let data = {};
  if (match) {
    try {
      data = JSON.parse(match[1]);
    } catch {
      data = {};
    }
  }

  return {
    id: issue.number,
    title: issue.title,
    createdAt: issue.created_at,
    url: issue.html_url,
    name: data.name || "",
    company: data.company || "",
    phone: data.phone || "",
    email: data.email || "",
    sessions: data.sessions || "",
    notes: data.notes || "",
    submittedAt: data.submittedAt || issue.created_at,
  };
}

module.exports = async function handler(req, res) {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
    res.end();
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" }, corsHeaders);
    return;
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    sendJson(res, 500, { ok: false, error: "後台尚未設定 ADMIN_PASSWORD。" }, corsHeaders);
    return;
  }

  const password = req.headers["x-admin-password"] || req.query?.password || "";
  if (password !== expectedPassword) {
    sendJson(res, 401, { ok: false, error: "後台密碼錯誤" }, corsHeaders);
    return;
  }

  if (!process.env.GITHUB_TOKEN) {
    sendJson(
      res,
      500,
      { ok: false, error: "後台尚未設定 GITHUB_TOKEN，無法讀取報名資料。" },
      corsHeaders
    );
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=open&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "nextt-sustainable-salon-admin",
        },
      }
    );
    const issues = await response.json().catch(() => []);
    if (!response.ok) {
      throw new Error(issues.message || "GitHub Issues 讀取失敗");
    }

    const items = issues
      .filter((issue) => issue.title?.startsWith("[NextT RSVP]"))
      .map(parseRsvpIssue)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    sendJson(res, 200, { ok: true, count: items.length, items }, corsHeaders);
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || "後台讀取失敗" }, corsHeaders);
  }
};
