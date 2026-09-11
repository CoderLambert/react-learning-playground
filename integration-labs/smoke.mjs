import { chromium } from "@playwright/test";
const [kind, url] = process.argv.slice(2);
if (!kind || !url) throw new Error("usage: node smoke.mjs <router|query|next> <url>");
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage(); const errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  if (kind === "router") {
    await page.getByRole("link", { name: "Alpha", exact: true }).click(); await page.getByRole("heading", { name: "Alpha" }).waitFor();
    await page.getByRole("link", { name: "Activity child" }).click(); await page.getByRole("heading", { name: "Nested activity" }).waitFor();
    await page.getByRole("link", { name: "404 boundary" }).click(); await page.getByRole("alert").waitFor();
  } else if (kind === "query") {
    await page.getByText("Server item 1").waitFor();
    const primary = await page.getByTestId("primary-request").textContent(); const mirror = await page.getByTestId("mirror-request").textContent(); if (primary !== mirror) throw new Error(`query observers did not share request: ${primary} vs ${mirror}`);
    await page.getByRole("button", { name: "Run deterministic flaky query" }).click(); await page.getByText("retry recovered", { exact: false }).waitFor();
    await page.getByRole("textbox", { name: "New item" }).fill("fail mutation"); await page.getByRole("button", { name: "Add" }).click(); await page.getByText("fail mutation", { exact: true }).waitFor(); await page.getByText("mock server rejected mutation", { exact: false }).waitFor(); await page.getByText("fail mutation", { exact: true }).waitFor({ state: "detached" });
  } else if (kind === "next") {
    await page.getByRole("heading", { name: /Next.js 16 App Router/ }).waitFor();
    await page.getByPlaceholder("note persisted in server memory").fill("CI Server Action note"); await page.getByRole("button", { name: "Run Server Action" }).click(); await page.getByRole("status").getByText("Server saved note", { exact: false }).waitFor(); await page.getByText("CI Server Action note", { exact: true }).waitFor();
  } else throw new Error(`unknown smoke kind: ${kind}`);
  if (errors.length) throw new Error(errors.join("\n")); console.log(`PASS ${kind} interaction smoke ${url}`);
} finally { await browser.close(); }
