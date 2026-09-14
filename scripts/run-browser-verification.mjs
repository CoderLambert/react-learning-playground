import { spawn } from "node:child_process";

import { getBrowserSuiteSelection } from "./browser-verification-plan.mjs";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`Browser verification terminated by ${signal}`));
        return;
      }
      resolve(code ?? 1);
    });
  });
}

const tier = process.env.BROWSER_TIER;
const domain = process.env.BROWSER_DOMAIN || null;
const { executedSuites } = getBrowserSuiteSelection(tier, domain);

console.log(`[browser-verification] tier=${tier}`);
console.log(`[browser-verification] domain=${domain ?? "none"}`);
console.log(`[browser-verification] suites=${JSON.stringify(executedSuites)}`);

if (tier === "FULL") {
  process.exitCode = await run("npm", ["run", "test:e2e"]);
} else if (tier === "DOMAIN") {
  process.exitCode = await run("npm", [
    "exec",
    "--",
    "playwright",
    "test",
    ...executedSuites,
  ]);
} else {
  throw new Error(`Browser runner cannot execute tier ${tier ?? "missing"}`);
}
