import { chromium } from "@playwright/test";
const [url, expected] = process.argv.slice(2);
if (!url || !expected) throw new Error("usage: node smoke.mjs <url> <expected text>");
const browser = await chromium.launch({ headless: true });
try { const page = await browser.newPage(); const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); }); await page.goto(url, { waitUntil: "networkidle" }); await page.getByText(expected, { exact: false }).first().waitFor(); if (errors.length) throw new Error(errors.join("\n")); console.log(`PASS ${url} contains ${expected}`); } finally { await browser.close(); }
