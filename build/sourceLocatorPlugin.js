import { readFileSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const REGISTRY_PATH = fileURLToPath(new URL("../src/demos/index.js", import.meta.url));
const REGISTRY_DIRECTORY = dirname(REGISTRY_PATH);
const RAW_IMPORT_PATTERN = /import\s+[A-Za-z_$][\w$]*\s+from\s+["']([^"']+)\?raw["']/g;
const SOURCE_ATTRIBUTE = "data-source-loc";

function parserLanguage(filePath) {
  switch (extname(filePath).toLowerCase()) {
    case ".tsx": return "tsx";
    case ".ts": return "ts";
    case ".jsx": return "jsx";
    default: return "js";
  }
}

function normalizePath(value) {
  return String(value ?? "").replace(/\\/g, "/");
}

function jsxName(node) {
  if (!node) return "";
  if (node.type === "JSXIdentifier") return node.name ?? "";
  if (node.type === "JSXMemberExpression") {
    const object = jsxName(node.object);
    const property = jsxName(node.property);
    return object && property ? `${object}.${property}` : property || object;
  }
  return "";
}

function isNode(value) {
  return Boolean(value && typeof value === "object" && typeof value.type === "string");
}

function walk(node, visitor, parents = []) {
  if (!isNode(node)) return;
  visitor(node, parents);
  const nextParents = [...parents, node];
  for (const [key, value] of Object.entries(node)) {
    if (key === "loc" || key === "range" || key === "parent" || key === "comments" || key === "tokens") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isNode(item)) walk(item, visitor, nextParents);
      }
    } else if (isNode(value)) {
      walk(value, visitor, nextParents);
    }
  }
}

function nearest(parents, predicate) {
  for (let index = parents.length - 1; index >= 0; index -= 1) {
    if (predicate(parents[index])) return parents[index];
  }
  return null;
}

function buildLineIndex(source) {
  const starts = [0];
  for (let index = 0; index < source.length; index += 1) {
    if (source.charCodeAt(index) === 10) starts.push(index + 1);
  }
  return starts;
}

function offsetToLine(offset, starts) {
  const target = Math.max(0, Number(offset) || 0);
  let low = 0;
  let high = starts.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (starts[middle] <= target) low = middle + 1;
    else high = middle - 1;
  }
  return Math.max(1, high + 1);
}

function nodeLines(node, lineStarts) {
  if (node?.loc?.start?.line && node?.loc?.end?.line) {
    return {
      startLine: Math.max(1, node.loc.start.line),
      endLine: Math.max(node.loc.start.line, node.loc.end.line),
    };
  }
  const start = Number.isFinite(node?.start) ? node.start : 0;
  const end = Number.isFinite(node?.end) ? Math.max(start, node.end - 1) : start;
  const startLine = offsetToLine(start, lineStarts);
  return { startLine, endLine: Math.max(startLine, offsetToLine(end, lineStarts)) };
}

function isIntrinsicOpeningElement(node) {
  if (node?.type !== "JSXOpeningElement" || node.name?.type !== "JSXIdentifier") return false;
  const name = node.name.name ?? "";
  return /^[a-z]/.test(name) || name.includes("-");
}

function alreadyInstrumented(node) {
  return (node.attributes ?? []).some((attribute) => (
    attribute?.type === "JSXAttribute" && jsxName(attribute.name) === SOURCE_ATTRIBUTE
  ));
}

function collectRegisteredSourceFiles() {
  const registrySource = readFileSync(REGISTRY_PATH, "utf8");
  const paths = new Set();
  RAW_IMPORT_PATTERN.lastIndex = 0;
  let match = RAW_IMPORT_PATTERN.exec(registrySource);
  while (match) {
    paths.add(resolve(REGISTRY_DIRECTORY, match[1]));
    match = RAW_IMPORT_PATTERN.exec(registrySource);
  }
  return paths;
}

function buildByteOffsetMap(source, offsets) {
  const wanted = new Set(offsets);
  const resolved = new Map();
  let byteOffset = 0;
  let stringIndex = 0;

  while (stringIndex < source.length && wanted.size > 0) {
    if (wanted.has(byteOffset)) {
      resolved.set(byteOffset, stringIndex);
      wanted.delete(byteOffset);
    }
    const codePoint = source.codePointAt(stringIndex);
    const character = String.fromCodePoint(codePoint);
    byteOffset += Buffer.byteLength(character, "utf8");
    stringIndex += character.length;
  }

  if (wanted.has(byteOffset)) resolved.set(byteOffset, stringIndex);
  return resolved;
}

function resolveOpeningEnd(source, nodeEnd, byteOffsetMap) {
  if (!Number.isFinite(nodeEnd)) return null;
  if (source[nodeEnd - 1] === ">") return nodeEnd;
  const mapped = byteOffsetMap.get(nodeEnd);
  if (mapped && source[mapped - 1] === ">") return mapped;
  return null;
}

function instrumentSource(ast, source, filePath) {
  const lineStarts = buildLineIndex(source);
  const sourcePath = normalizePath(relative(PROJECT_ROOT, filePath));
  const candidates = [];

  walk(ast, (node, parents) => {
    if (!isIntrinsicOpeningElement(node) || alreadyInstrumented(node)) return;
    const elementNode = nearest(parents, (candidate) => candidate.type === "JSXElement") ?? node;
    const { startLine, endLine } = nodeLines(elementNode, lineStarts);
    candidates.push({ node, startLine, endLine });
  });

  if (candidates.length === 0) return null;
  const unresolvedOffsets = candidates
    .map((candidate) => candidate.node.end)
    .filter((offset) => Number.isFinite(offset) && source[offset - 1] !== ">");
  const byteOffsetMap = buildByteOffsetMap(source, unresolvedOffsets);
  const edits = [];

  for (const candidate of candidates) {
    const openingEnd = resolveOpeningEnd(source, candidate.node.end, byteOffsetMap);
    if (!openingEnd) continue;
    const closingBracket = openingEnd - 1;
    const insertAt = source[closingBracket - 1] === "/" ? closingBracket - 1 : closingBracket;
    const locator = `${sourcePath}|${candidate.startLine}|${candidate.endLine}`;
    edits.push({ insertAt, text: ` ${SOURCE_ATTRIBUTE}=${JSON.stringify(locator)}` });
  }

  if (edits.length === 0) return null;
  edits.sort((left, right) => right.insertAt - left.insertAt);
  let output = source;
  for (const edit of edits) {
    output = `${output.slice(0, edit.insertAt)}${edit.text}${output.slice(edit.insertAt)}`;
  }
  return output;
}

export function sourceLocatorPlugin() {
  let registeredSourceFiles = new Set();

  const refreshRegisteredSources = function refreshRegisteredSources() {
    this.addWatchFile(REGISTRY_PATH);
    registeredSourceFiles = collectRegisteredSourceFiles();
    for (const filePath of registeredSourceFiles) this.addWatchFile(filePath);
  };

  return {
    name: "react-learning-visual-source-locator",
    enforce: "pre",

    buildStart() {
      refreshRegisteredSources.call(this);
    },

    transform(code, id) {
      if (id.includes("?")) return null;
      const filePath = resolve(id);
      if (!registeredSourceFiles.has(filePath)) return null;

      try {
        const ast = this.parse(code, { lang: parserLanguage(filePath) });
        const instrumented = instrumentSource(ast, code, filePath);
        return instrumented ? { code: instrumented, map: null } : null;
      } catch (error) {
        this.warn(`Visual source locator instrumentation failed for ${relative(PROJECT_ROOT, filePath)}: ${error?.message ?? error}`);
        return null;
      }
    },

    handleHotUpdate(context) {
      if (context.file !== REGISTRY_PATH) return;
      refreshRegisteredSources.call(this);
      context.server.ws.send({ type: "full-reload", path: "*" });
    },
  };
}

export default sourceLocatorPlugin;
