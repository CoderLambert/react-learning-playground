import { readFileSync } from "node:fs";
import { basename, dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SOURCE_SEMANTIC_MANIFEST_ID = "virtual:source-semantic-manifest";
const RESOLVED_SOURCE_SEMANTIC_MANIFEST_ID = `\0${SOURCE_SEMANTIC_MANIFEST_ID}`;
const REGISTRY_PATH = fileURLToPath(new URL("../src/demos/index.js", import.meta.url));
const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const RAW_SUFFIX = "?raw";
const MAX_REGIONS_PER_SOURCE = 24;

const HOOK_KIND = Object.freeze({
  useReducer: "reducer-hook",
  useEffect: "effect",
  useLayoutEffect: "effect",
  useInsertionEffect: "effect",
  useMemo: "memo",
  useCallback: "callback",
  useContext: "context-hook",
  useRef: "ref",
  useImperativeHandle: "ref",
  useTransition: "concurrency",
  useDeferredValue: "concurrency",
  useOptimistic: "action",
  useActionState: "action",
  useFormStatus: "action",
  useSyncExternalStore: "external-store",
  useState: "state",
  useId: "identity",
  use: "async",
});

const KIND_SCORE = Object.freeze({
  reducer: 118,
  effect: 112,
  "custom-hook": 110,
  "external-store": 108,
  provider: 106,
  component: 102,
  action: 100,
  "reducer-hook": 98,
  concurrency: 96,
  memo: 94,
  callback: 94,
  ref: 92,
  context: 90,
  "context-hook": 88,
  hook: 78,
  "event-handler": 76,
  async: 74,
  state: 64,
  identity: 58,
  helper: 48,
});

function parserLanguage(filePath) {
  switch (extname(filePath).toLowerCase()) {
    case ".tsx": return "tsx";
    case ".ts": return "ts";
    case ".jsx": return "jsx";
    default: return "js";
  }
}

function getProperty(objectNode, name) {
  if (!objectNode || objectNode.type !== "ObjectExpression") return null;
  return objectNode.properties?.find((property) => {
    if (!property || property.type !== "Property") return false;
    if (property.computed) return false;
    return property.key?.name === name || property.key?.value === name;
  }) ?? null;
}

function staticString(node) {
  return typeof node?.value === "string" ? node.value : null;
}

function calleeName(node) {
  if (!node) return null;
  if (node.type === "Identifier") return node.name;
  if (node.type === "MemberExpression" && !node.computed) {
    const object = calleeName(node.object);
    const property = node.property?.name;
    return object && property ? `${object}.${property}` : property ?? object;
  }
  return null;
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

function exportedFromParents(parents) {
  return Boolean(nearest(parents, (node) => node.type === "ExportNamedDeclaration" || node.type === "ExportDefaultDeclaration"));
}

function rangeContainer(node, parents) {
  return nearest(parents, (candidate) => candidate.type === "VariableDeclaration")
    ?? nearest(parents, (candidate) => candidate.type === "ExpressionStatement")
    ?? node;
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
  if (!node) return { startLine: 1, endLine: 1 };
  if (node.loc?.start?.line && node.loc?.end?.line) {
    return {
      startLine: Math.max(1, node.loc.start.line),
      endLine: Math.max(node.loc.start.line, node.loc.end.line),
    };
  }
  const start = Number.isFinite(node.start) ? node.start : 0;
  const end = Number.isFinite(node.end) ? Math.max(start, node.end - 1) : start;
  const startLine = offsetToLine(start, lineStarts);
  return { startLine, endLine: Math.max(startLine, offsetToLine(end, lineStarts)) };
}

function normalizeSearch(value) {
  return String(value ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase();
}

function conceptBoost({ demoId, demoTitle, kind, symbol, hookName }) {
  const concept = normalizeSearch(`${demoId} ${demoTitle}`);
  const candidate = normalizeSearch(`${kind} ${symbol} ${hookName}`);
  let boost = 0;

  const rules = [
    [/reducer|reduce/, new Set(["reducer", "reducer-hook"]), 110],
    [/effect/, new Set(["effect"]), 105],
    [/context/, new Set(["context", "context-hook", "provider"]), 95],
    [/memo/, new Set(["memo"]), 90],
    [/callback/, new Set(["callback"]), 90],
    [/(^|-)ref($|-)/, new Set(["ref"]), 85],
    [/transition|deferred|concurrent/, new Set(["concurrency"]), 90],
    [/optimistic|action|form-status/, new Set(["action"]), 90],
    [/external-store/, new Set(["external-store"]), 100],
    [/custom-hooks?/, new Set(["custom-hook"]), 100],
  ];

  for (const [pattern, kinds, amount] of rules) {
    if (pattern.test(concept) && kinds.has(kind)) boost = Math.max(boost, amount);
  }

  const tokens = concept.split("-").filter((token) => token.length >= 4);
  if (tokens.some((token) => candidate.includes(token))) boost += 18;
  return boost;
}

function makeRegion({
  node,
  lineStarts,
  kind,
  symbol,
  hookName = null,
  parentSymbol = null,
  exported = false,
  topLevel = false,
  demoId,
  demoTitle,
  id,
  sourceFileName,
}) {
  const { startLine, endLine } = nodeLines(node, lineStarts);
  const sourceBase = normalizeSearch(basename(sourceFileName, extname(sourceFileName)));
  const symbolNormalized = normalizeSearch(symbol);
  const score = (KIND_SCORE[kind] ?? 40)
    + (exported ? 8 : 0)
    + (topLevel ? 4 : 0)
    + (sourceBase && symbolNormalized.includes(sourceBase.replace(/-demo$/, "")) ? 10 : 0)
    + conceptBoost({ demoId, demoTitle, kind, symbol, hookName });

  return {
    id,
    kind,
    symbol,
    ...(hookName ? { hookName } : {}),
    ...(parentSymbol ? { parentSymbol } : {}),
    startLine,
    endLine,
    score,
  };
}

function functionNameForNode(functionNode, descriptorsByFunction) {
  return descriptorsByFunction.get(functionNode)?.symbol ?? null;
}

function analyzeSource(ast, metadata) {
  const { code, demoId, demoTitle, displayName } = metadata;
  const lineStarts = buildLineIndex(code);
  const functionDescriptors = [];
  const descriptorsByFunction = new Map();
  const contextDescriptors = [];
  const reducerNames = new Set();
  const hookRegions = [];
  const hookOccurrences = new Map();

  walk(ast, (node, parents) => {
    if (node.type === "FunctionDeclaration" && node.id?.name) {
      const descriptor = {
        symbol: node.id.name,
        functionNode: node,
        rangeNode: nearest(parents, (item) => item.type === "ExportNamedDeclaration" || item.type === "ExportDefaultDeclaration") ?? node,
        exported: exportedFromParents(parents),
        topLevel: !nearest(parents, (item) => item.type === "FunctionDeclaration" || item.type === "FunctionExpression" || item.type === "ArrowFunctionExpression"),
        hasJsx: false,
        providesContext: false,
      };
      functionDescriptors.push(descriptor);
      descriptorsByFunction.set(node, descriptor);
      return;
    }

    if (node.type === "VariableDeclarator" && node.id?.type === "Identifier") {
      const init = node.init;
      const declaration = nearest(parents, (item) => item.type === "VariableDeclaration") ?? node;
      const exported = exportedFromParents(parents);
      const outerFunction = nearest(parents, (item) => descriptorsByFunction.has(item));

      if (init?.type === "ArrowFunctionExpression" || init?.type === "FunctionExpression") {
        const descriptor = {
          symbol: node.id.name,
          functionNode: init,
          rangeNode: declaration,
          exported,
          topLevel: !outerFunction,
          hasJsx: false,
          providesContext: false,
        };
        functionDescriptors.push(descriptor);
        descriptorsByFunction.set(init, descriptor);
      } else if (init?.type === "CallExpression" && /(^|\.)createContext$/.test(calleeName(init) ?? "")) {
        contextDescriptors.push({
          symbol: node.id.name,
          rangeNode: declaration,
          exported,
          topLevel: !outerFunction,
        });
      }
      return;
    }
  });

  walk(ast, (node, parents) => {
    const parentFunctionNode = nearest(parents, (item) => descriptorsByFunction.has(item));
    const parentDescriptor = parentFunctionNode ? descriptorsByFunction.get(parentFunctionNode) : null;

    if ((node.type === "JSXElement" || node.type === "JSXFragment") && parentDescriptor) {
      parentDescriptor.hasJsx = true;
    }

    if (node.type === "JSXOpeningElement" && parentDescriptor) {
      const name = jsxName(node.name);
      if (name === "Provider" || name.endsWith(".Provider")) parentDescriptor.providesContext = true;
    }

    if (node.type !== "CallExpression") return;
    const fullCallee = calleeName(node.callee) ?? "";
    const hookName = fullCallee.split(".").pop();

    if (hookName === "useReducer" && node.arguments?.[0]?.type === "Identifier") {
      reducerNames.add(node.arguments[0].name);
    }

    if (!(hookName === "use" || /^use[A-Z]/.test(hookName ?? ""))) return;
    const kind = HOOK_KIND[hookName] ?? "hook";
    const occurrence = (hookOccurrences.get(hookName) ?? 0) + 1;
    hookOccurrences.set(hookName, occurrence);
    const rangeNode = rangeContainer(node, parents);
    const parentSymbol = parentFunctionNode ? functionNameForNode(parentFunctionNode, descriptorsByFunction) : null;

    hookRegions.push(makeRegion({
      node: rangeNode,
      lineStarts,
      kind,
      symbol: hookName,
      hookName,
      parentSymbol,
      topLevel: !parentSymbol,
      demoId,
      demoTitle,
      sourceFileName: displayName,
      id: `hook:${hookName}:${occurrence}`,
    }));
  });

  const functionRegions = functionDescriptors.map((descriptor) => {
    const { symbol } = descriptor;
    const outerFunction = nearestFunctionDescriptor(ast, descriptor.functionNode, descriptorsByFunction);
    const nested = Boolean(outerFunction);
    let kind = "helper";

    if (reducerNames.has(symbol) || /Reducer$/i.test(symbol)) {
      kind = "reducer";
    } else if (/^use[A-Z]/.test(symbol)) {
      kind = "custom-hook";
    } else if (descriptor.providesContext || /Provider$/.test(symbol)) {
      kind = "provider";
    } else if (nested && /^(handle|on|dispatch|submit|toggle|reset|undo|open|close)[A-Z_]/.test(symbol)) {
      kind = "event-handler";
    } else if (/^[A-Z]/.test(symbol) && descriptor.hasJsx) {
      kind = "component";
    }

    return makeRegion({
      node: descriptor.rangeNode,
      lineStarts,
      kind,
      symbol,
      parentSymbol: outerFunction?.symbol ?? null,
      exported: descriptor.exported,
      topLevel: descriptor.topLevel,
      demoId,
      demoTitle,
      sourceFileName: displayName,
      id: `${kind}:${symbol}`,
    });
  });

  const contextRegions = contextDescriptors.map((descriptor) => makeRegion({
    node: descriptor.rangeNode,
    lineStarts,
    kind: "context",
    symbol: descriptor.symbol,
    exported: descriptor.exported,
    topLevel: descriptor.topLevel,
    demoId,
    demoTitle,
    sourceFileName: displayName,
    id: `context:${descriptor.symbol}`,
  }));

  const regions = dedupeRegions([...functionRegions, ...contextRegions, ...hookRegions])
    .filter((region) => region.kind !== "helper" || region.score >= 62)
    .sort((left, right) => right.score - left.score || left.startLine - right.startLine)
    .slice(0, MAX_REGIONS_PER_SOURCE);

  const primaryRegionId = regions[0]?.id ?? null;
  return {
    path: relative(PROJECT_ROOT, metadata.filePath).split("\\").join("/"),
    parser: `rolldown-oxc:${parserLanguage(metadata.filePath)}`,
    primaryRegionId,
    regions,
  };
}

function nearestFunctionDescriptor(ast, targetFunction, descriptorsByFunction) {
  let result = null;
  walk(ast, (node, parents) => {
    if (node !== targetFunction) return;
    const parentFunctionNode = nearest(parents, (item) => descriptorsByFunction.has(item));
    if (parentFunctionNode) result = descriptorsByFunction.get(parentFunctionNode) ?? null;
  });
  return result;
}

function dedupeRegions(regions) {
  const seen = new Set();
  const output = [];
  for (const region of regions) {
    const key = `${region.kind}:${region.startLine}:${region.endLine}:${region.symbol}`;
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(region);
  }
  return output;
}

function extractRegistryEntries(ast, registrySource) {
  const rawImports = new Map();
  for (const node of ast.body ?? []) {
    if (node.type !== "ImportDeclaration") continue;
    const sourceValue = staticString(node.source);
    if (!sourceValue?.endsWith(RAW_SUFFIX)) continue;
    const localName = node.specifiers?.[0]?.local?.name;
    if (localName) rawImports.set(localName, sourceValue.slice(0, -RAW_SUFFIX.length));
  }

  let demosArray = null;
  walk(ast, (node) => {
    if (demosArray || node.type !== "VariableDeclarator" || node.id?.name !== "demos") return;
    if (node.init?.type === "ArrayExpression") demosArray = node.init;
  });
  if (!demosArray) throw new Error("Unable to find exported demos registry array.");

  const registryDirectory = dirname(REGISTRY_PATH);
  const entries = [];
  for (const demoNode of demosArray.elements ?? []) {
    if (demoNode?.type !== "ObjectExpression") continue;
    const id = staticString(getProperty(demoNode, "id")?.value);
    const title = staticString(getProperty(demoNode, "label")?.value) ?? id;
    const filesNode = getProperty(demoNode, "files")?.value;
    if (!id || filesNode?.type !== "ArrayExpression") continue;

    for (const fileNode of filesNode.elements ?? []) {
      if (fileNode?.type !== "ObjectExpression") continue;
      const displayName = staticString(getProperty(fileNode, "name")?.value);
      const codeNode = getProperty(fileNode, "code")?.value;
      const importPath = codeNode?.type === "Identifier" ? rawImports.get(codeNode.name) : null;
      if (!displayName || !importPath) continue;
      entries.push({
        demoId: id,
        demoTitle: title,
        displayName,
        filePath: resolve(registryDirectory, importPath),
      });
    }
  }

  if (entries.length === 0) {
    throw new Error(`No registered raw source files found in ${relative(PROJECT_ROOT, REGISTRY_PATH)}.`);
  }
  return entries;
}

function serializeManifest(manifest) {
  return `export const SOURCE_SEMANTIC_MANIFEST = Object.freeze(${JSON.stringify(manifest)});\n`;
}

export function sourceSemanticManifestPlugin() {
  let manifest = { version: 1, learningUnits: {} };
  let watchedSourceFiles = new Set();

  const rebuild = function rebuild() {
    const registrySource = readFileSync(REGISTRY_PATH, "utf8");
    this.addWatchFile(REGISTRY_PATH);
    const registryAst = this.parse(registrySource, { lang: "js" });
    const entries = extractRegistryEntries(registryAst, registrySource);
    const nextLearningUnits = {};
    const nextWatched = new Set();

    for (const entry of entries) {
      try {
        const code = readFileSync(entry.filePath, "utf8");
        this.addWatchFile(entry.filePath);
        nextWatched.add(entry.filePath);
        const ast = this.parse(code, { lang: parserLanguage(entry.filePath) });
        const semantics = analyzeSource(ast, { ...entry, code });
        nextLearningUnits[entry.demoId] ??= {};
        nextLearningUnits[entry.demoId][entry.displayName] = semantics;
      } catch (error) {
        this.warn(`Semantic source analysis failed for ${entry.displayName}: ${error?.message ?? error}`);
        nextLearningUnits[entry.demoId] ??= {};
        nextLearningUnits[entry.demoId][entry.displayName] = {
          path: relative(PROJECT_ROOT, entry.filePath).split("\\").join("/"),
          parser: `rolldown-oxc:${parserLanguage(entry.filePath)}`,
          primaryRegionId: null,
          regions: [],
        };
      }
    }

    watchedSourceFiles = nextWatched;
    manifest = { version: 1, learningUnits: nextLearningUnits };
  };

  return {
    name: "react-learning-semantic-source-manifest",
    enforce: "pre",

    buildStart() {
      rebuild.call(this);
    },

    resolveId(source) {
      return source === SOURCE_SEMANTIC_MANIFEST_ID ? RESOLVED_SOURCE_SEMANTIC_MANIFEST_ID : null;
    },

    load(id) {
      if (id !== RESOLVED_SOURCE_SEMANTIC_MANIFEST_ID) return null;
      return serializeManifest(manifest);
    },

    handleHotUpdate(context) {
      if (context.file !== REGISTRY_PATH && !watchedSourceFiles.has(context.file)) return;
      rebuild.call(this);
      const semanticModule = context.server.moduleGraph.getModuleById(RESOLVED_SOURCE_SEMANTIC_MANIFEST_ID);
      if (semanticModule) context.server.moduleGraph.invalidateModule(semanticModule);
      context.server.ws.send({ type: "full-reload", path: "*" });
      return [];
    },
  };
}
