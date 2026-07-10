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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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

function getRequiredText(body, key, label) {
  const value = typeof body[key] === "string" ? body[key].trim() : "";
  if (!value) throw new Error(`缺少必要欄位：${label}`);
  return value;
}

function buildIssueBody(data) {
  const safeData = {
    submittedAt: data.submittedAt || new Date().toISOString(),
    time: data.time || "",
    source: data.source || "website",
    name: data.name,
    company: data.company,
    phone: data.phone,
    email: data.email,
    sessions: data.sessions,
    notes: data.notes || "",
  };

  return [
    "## NextT 永續沙龍報名",
    "",
    `- 姓名：${safeData.name}`,
    `- 單位 / 職稱：${safeData.company}`,
    `- 電話：${safeData.phone}`,
    `- Email：${safeData.email}`,
    `- 場次：${safeData.sessions}`,
    `- 備註：${safeData.notes || "無"}`,
    `- 送出時間：${safeData.time || safeData.submittedAt}`,
    "",
    "<!-- nextt-rsvp-json",
    JSON.stringify(safeData, null, 2),
    "-->",
  ].join("\n");
}

module.exports = async function handler(req, res) {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" }, corsHeaders);
    return;
  }

  if (!process.env.GITHUB_TOKEN) {
    sendJson(
      res,
      500,
      { ok: false, error: "後台尚未設定 GITHUB_TOKEN，報名資料未送出。" },
      corsHeaders
    );
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const data = {
      ...body,
      name: getRequiredText(body, "name", "姓名"),
      company: getRequiredText(body, "company", "單位 / 職稱"),
      phone: getRequiredText(body, "phone", "聯絡電話"),
      email: getRequiredText(body, "email", "電子信箱"),
      sessions: getRequiredText(body, "sessions", "欲報名場次"),
    };

    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "nextt-sustainable-salon-rsvp",
      },
      body: JSON.stringify({
        title: `[NextT RSVP] ${data.name}｜${data.sessions}`,
        body: buildIssueBody(data),
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || "GitHub Issues 寫入失敗");
    }

    sendJson(
      res,
      200,
      { ok: true, id: result.number, url: result.html_url },
      corsHeaders
    );
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error.message || "報名資料格式錯誤" }, corsHeaders);
  }
};
