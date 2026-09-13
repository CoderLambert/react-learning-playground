import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const IGNORED_DIRECTORIES = new Set([
  ".git",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

async function walkFiles(directory, { ignoreDirectories = false } = {}) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoreDirectories && IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      files.push(
        ...(await walkFiles(path.join(directory, entry.name), {
          ignoreDirectories,
        })),
      );
      continue;
    }

    if (entry.isFile()) {
      files.push(path.join(directory, entry.name));
    }
  }

  return files;
}

async function filesIfDirectoryExists(directory, options) {
  try {
    return await walkFiles(directory, options);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function discoverDeterministicTests(root = DEFAULT_ROOT) {
  const testsRoot = path.join(root, "tests");
  const files = await filesIfDirectoryExists(testsRoot);

  return files
    .filter((file) => file.endsWith(".test.mjs"))
    .map((file) => toPosix(path.relative(root, file)))
    .sort();
}

export async function discoverRequiredTests(root = DEFAULT_ROOT) {
  const deterministicTests = await discoverDeterministicTests(root);
  const workerTestRoot = path.join(root, "worker", "deepseek-assistant", "test");
  const workerTests = (await filesIfDirectoryExists(workerTestRoot))
    .filter((file) => file.endsWith(".test.js"))
    .map((file) => toPosix(path.relative(root, file)))
    .sort();

  return [...deterministicTests, ...workerTests];
}

export async function findOrphanDeterministicTests(root = DEFAULT_ROOT) {
  const repositoryFiles = await walkFiles(root, { ignoreDirectories: true });
  const testsRootPrefix = `${toPosix(path.relative(root, path.join(root, "tests")))}/`;

  return repositoryFiles
    .filter((file) => file.endsWith(".test.mjs"))
    .map((file) => toPosix(path.relative(root, file)))
    .filter((file) => !file.startsWith(testsRootPrefix))
    .sort();
}

export async function runRequiredTests(root = DEFAULT_ROOT) {
  const orphanTests = await findOrphanDeterministicTests(root);
  if (orphanTests.length > 0) {
    console.error("[required-tests] deterministic tests outside tests/** are not owned:");
    for (const file of orphanTests) {
      console.error(`  - ${file}`);
    }
    return 1;
  }

  const tests = await discoverRequiredTests(root);
  if (tests.length === 0) {
    console.error("[required-tests] no deterministic tests discovered");
    return 1;
  }

  console.log(`[required-tests] running ${tests.length} required deterministic tests`);
  for (const file of tests) {
    console.log(`  - ${file}`);
  }

  return await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--test", ...tests], {
      cwd: root,
      stdio: "inherit",
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) {
        console.error(`[required-tests] node --test terminated by ${signal}`);
        resolve(1);
        return;
      }
      resolve(code ?? 1);
    });
  });
}

const invokedAsScript =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedAsScript) {
  process.exitCode = await runRequiredTests();
}
