import { readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const REGISTRY_PATH = fileURLToPath(new URL("../src/demos/index.js", import.meta.url));
const REGISTRY_DIRECTORY = dirname(REGISTRY_PATH);
const RAW_IMPORT_PATTERN = /import\s+[A-Za-z_$][\w$]*\s+from\s+["']([^"']+)\?raw["']/g;
const SOURCE_ATTRIBUTE = "data-source-loc";

function normalizePath(value) {
  return String(value ?? "").replace(/\\/g, "/");
}

function cleanFilename(value) {
  return String(value ?? "").split("?", 1)[0].split("#", 1)[0];
}

function collectRegisteredSourcePaths() {
  const registrySource = readFileSync(REGISTRY_PATH, "utf8");
  const paths = new Set();
  let match = RAW_IMPORT_PATTERN.exec(registrySource);
  while (match) {
    paths.add(resolve(REGISTRY_DIRECTORY, match[1]));
    match = RAW_IMPORT_PATTERN.exec(registrySource);
  }
  return paths;
}

const REGISTERED_SOURCE_PATHS = collectRegisteredSourcePaths();

function isIntrinsicJsxName(types, nameNode) {
  if (!types.isJSXIdentifier(nameNode)) return false;
  return /^[a-z]/.test(nameNode.name ?? "") || (nameNode.name ?? "").includes("-");
}

function hasLocatorAttribute(types, attributes) {
  return attributes.some((attribute) => (
    types.isJSXAttribute(attribute) &&
    types.isJSXIdentifier(attribute.name, { name: SOURCE_ATTRIBUTE })
  ));
}

function makeLocatorValue(filename, location) {
  const sourcePath = normalizePath(relative(PROJECT_ROOT, filename));
  const startLine = Math.max(1, Number(location?.start?.line) || 1);
  const endLine = Math.max(startLine, Number(location?.end?.line) || startLine);
  return `${sourcePath}|${startLine}|${endLine}`;
}

export function jsxSourceLocatorBabelPlugin({ types }) {
  return {
    name: "react-learning-jsx-source-locator",
    visitor: {
      JSXOpeningElement(path, state) {
        const filename = cleanFilename(state.file?.opts?.filename);
        if (!filename) return;
        const resolvedFilename = resolve(filename);
        if (!REGISTERED_SOURCE_PATHS.has(resolvedFilename)) return;
        if (!isIntrinsicJsxName(types, path.node.name)) return;
        if (hasLocatorAttribute(types, path.node.attributes ?? [])) return;

        const elementNode = path.parentPath?.isJSXElement() ? path.parentPath.node : path.node;
        const location = elementNode.loc ?? path.node.loc;
        if (!location?.start?.line) return;

        path.node.attributes.push(
          types.jsxAttribute(
            types.jsxIdentifier(SOURCE_ATTRIBUTE),
            types.stringLiteral(makeLocatorValue(resolvedFilename, location)),
          ),
        );
      },
    },
  };
}

export default jsxSourceLocatorBabelPlugin;
