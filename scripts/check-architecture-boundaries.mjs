import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ARCHITECTURE_OWNERS,
  getArchitectureOwner,
  isCuratedPublicEntry,
  normalizeRepositoryPath,
} from "../architecture/ownership-manifest.mjs";
import { ARCHITECTURE_DEBT, findArchitectureDebt } from "../architecture/debt-register.mjs";

const DEFAULT_ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const SOURCE_EXTENSIONS = [".js", ".jsx", ".mjs", ".cjs"];

function stripComments(source) {
  let result = "";
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") {
        lineComment = false;
        result += char;
      } else result += " ";
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        result += "  ";
        index += 1;
      } else result += char === "\n" ? "\n" : " ";
      continue;
    }
    if (quote) {
      result += char;
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      result += char;
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      result += "  ";
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      result += "  ";
      index += 1;
      continue;
    }
    result += char;
  }
  return result;
}

export function collectModuleSpecifiers(source) {
  const code = stripComments(String(source ?? ""));
  const found = [];
  const patterns = [
    /\b(?:import|export)\s+(?:[^;]*?\s+from\s*)?["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of code.matchAll(pattern)) found.push(match[1]);
  }
  return [...new Set(found)];
}

export function normalizeModuleSpecifier(specifier) {
  return String(specifier ?? "").split(/[?#]/, 1)[0];
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function candidatePaths(sourcePath, specifier) {
  const clean = normalizeModuleSpecifier(specifier);
  if (!clean.startsWith(".")) return [];
  const base = normalizeRepositoryPath(path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), clean)));
  const ext = path.posix.extname(base);
  if (ext) return [base];
  return [
    base,
    ...SOURCE_EXTENSIONS.map((suffix) => `${base}${suffix}`),
    ...SOURCE_EXTENSIONS.map((suffix) => `${base}/index${suffix}`),
  ];
}

export function resolveRepositoryImport(sourcePath, specifier, repositoryFiles) {
  const files = repositoryFiles instanceof Set ? repositoryFiles : new Set(repositoryFiles);
  return candidatePaths(sourcePath, specifier).find((candidate) => files.has(candidate)) ?? null;
}

function findCycles(graph) {
  const cycles = [];
  const visited = new Set();
  const stack = [];
  const active = new Set();

  function visit(node) {
    if (active.has(node)) {
      const index = stack.indexOf(node);
      cycles.push([...stack.slice(index), node]);
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    active.add(node);
    stack.push(node);
    for (const next of graph.get(node) ?? []) visit(next);
    stack.pop();
    active.delete(node);
  }

  for (const node of graph.keys()) visit(node);
  return cycles;
}

export async function analyzeArchitecture(root = DEFAULT_ROOT) {
  const sourceRoot = path.join(root, "src");
  const absoluteFiles = await walk(sourceRoot);
  const repositoryFiles = new Set(
    absoluteFiles.map((file) => normalizeRepositoryPath(path.relative(root, file))),
  );
  const sourceFiles = [...repositoryFiles].filter((file) => SOURCE_EXTENSIONS.includes(path.posix.extname(file)));
  const violations = [];
  const observedDebt = new Set();
  const graph = new Map(ARCHITECTURE_OWNERS.filter((owner) => owner.kind === "domain" || owner.kind === "platform").map((owner) => [owner.id, new Set()]));

  for (const sourcePath of sourceFiles) {
    const sourceOwner = getArchitectureOwner(sourcePath);
    if (!sourceOwner || !graph.has(sourceOwner.id)) continue;
    const source = await readFile(path.join(root, sourcePath), "utf8");

    for (const specifier of collectModuleSpecifiers(source)) {
      const targetPath = resolveRepositoryImport(sourcePath, specifier, repositoryFiles);
      if (!targetPath) continue;
      const targetOwner = getArchitectureOwner(targetPath);
      if (!targetOwner || sourceOwner.id === targetOwner.id || !graph.has(targetOwner.id)) continue;

      const debt = findArchitectureDebt(sourcePath, targetOwner.id, targetPath);
      if (debt) {
        observedDebt.add(debt.id);
        continue;
      }

      if (sourceOwner.id === "platform") {
        violations.push({ type: "platform-reverse-dependency", sourcePath, targetPath, sourceOwner: sourceOwner.id, targetOwner: targetOwner.id });
        continue;
      }

      if (targetOwner.publicEntries.length > 0 && !isCuratedPublicEntry(targetOwner.id, targetPath)) {
        violations.push({ type: "peer-domain-deep-import", sourcePath, targetPath, sourceOwner: sourceOwner.id, targetOwner: targetOwner.id });
        continue;
      }

      graph.get(sourceOwner.id).add(targetOwner.id);
    }
  }

  const cycles = findCycles(graph).map((cycle) => ({ type: "domain-dependency-cycle", cycle }));
  violations.push(...cycles);

  const staleDebt = ARCHITECTURE_DEBT.filter((entry) => !observedDebt.has(entry.id));
  return { violations, staleDebt, observedDebt: [...observedDebt].sort() };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await analyzeArchitecture();
  if (result.violations.length || result.staleDebt.length) {
    console.error(JSON.stringify(result, null, 2));
    process.exitCode = 1;
  } else {
    console.log(`[architecture] boundaries valid; observed debt: ${result.observedDebt.join(", ") || "none"}`);
  }
}
