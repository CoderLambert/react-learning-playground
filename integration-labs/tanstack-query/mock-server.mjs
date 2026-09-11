import http from "node:http";

let items = Array.from({ length: 10 }, (_, index) => ({ id: index + 1, text: `Server item ${index + 1}` }));
let requestId = 0;
let flakyAttempts = 0;
const json = (res, status, body) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/items" && req.method === "GET") {
    const id = ++requestId; await sleep(350);
    const page = Number(url.searchParams.get("page") || 1); const start = (page - 1) * 3;
    return json(res, 200, { requestId: id, page, items: items.slice(start, start + 3), hasMore: start + 3 < items.length });
  }
  if (url.pathname === "/api/flaky" && req.method === "GET") {
    flakyAttempts += 1; if (flakyAttempts % 3 !== 0) return json(res, 500, { message: `deterministic failure ${flakyAttempts}` });
    return json(res, 200, { attempts: flakyAttempts, message: "retry recovered" });
  }
  if (url.pathname === "/api/items" && req.method === "POST") {
    let raw = ""; for await (const chunk of req) raw += chunk; const body = JSON.parse(raw || "{}"); await sleep(400);
    if (String(body.text).toLowerCase().includes("fail")) return json(res, 500, { message: "mock server rejected mutation" });
    const item = { id: Date.now(), text: String(body.text) }; items = [item, ...items]; return json(res, 201, item);
  }
  json(res, 404, { message: "not found" });
}).listen(4180, "127.0.0.1", () => console.log("mock API http://127.0.0.1:4180"));
