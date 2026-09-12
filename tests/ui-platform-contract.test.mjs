import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import test from "node:test";

import tailwindConfig from "../tailwind.config.js";
import { cn } from "../src/lib/utils.js";

const ROOT = resolve(import.meta.dirname, "..");
const UI_ROOT = resolve(ROOT, "src/components/ui");
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);

function sourceFiles(directory) {
  const files = [];
  const visit = (path) => {
    for (const name of readdirSync(path)) {
      const child = join(path, name);
      const stat = statSync(child);
      if (stat.isDirectory()) visit(child);
      else if (SOURCE_EXTENSIONS.has(extname(child))) files.push(child);
    }
  };

  visit(directory);
  return files;
}

function projectPath(path) {
  return relative(ROOT, path).split(sep).join("/");
}

// Comments are removed before looking for import statements. This intentionally
// checks module specifiers rather than arbitrary words in UI source files.
function withoutComments(source) {
  let output = "";
  let index = 0;
  let quote = null;

  while (index < source.length) {
    const character = source[index];
    const next = source[index + 1];

    if (quote) {
      output += character;
      if (character === "\\") {
        output += next ?? "";
        index += 2;
        continue;
      }
      if (character === quote) quote = null;
      index += 1;
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      output += character;
      index += 1;
      continue;
    }

    if (character === "/" && next === "/") {
      while (index < source.length && source[index] !== "\n") {
        output += " ";
        index += 1;
      }
      continue;
    }

    if (character === "/" && next === "*") {
      output += "  ";
      index += 2;
      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        output += source[index] === "\n" ? "\n" : " ";
        index += 1;
      }
      output += "  ";
      index += 2;
      continue;
    }

    output += character;
    index += 1;
  }

  return output;
}

function importSpecifiers(source) {
  const uncommented = withoutComments(source);
  const specifiers = new Set();
  const staticImport = /(?:^|[;\n])\s*import\s+(?!\()\s*(?:[\s\S]*?\s+from\s+)?(["'])([^"'\n]+)\1/g;
  const dynamicImport = /\bimport\s*\(\s*(["'])([^"'\n]+)\1\s*\)/g;

  for (const pattern of [staticImport, dynamicImport]) {
    let match;
    while ((match = pattern.exec(uncommented))) specifiers.add(match[2]);
  }

  return [...specifiers];
}

function isAllowedPrimitiveDependency(specifier, sourcePath) {
  // Bare specifiers are external packages (React, CVA, and similar). Project
  // imports must resolve to the generic primitive layer or shared lib layer.
  if (!specifier.startsWith(".") && !specifier.startsWith("/") && !specifier.startsWith("@/")) {
    return true;
  }

  let resolvedPath;
  if (specifier.startsWith(".")) {
    resolvedPath = projectPath(resolve(dirname(sourcePath), specifier));
  } else if (specifier.startsWith("/")) {
    resolvedPath = specifier.slice(1);
  } else {
    resolvedPath = specifier.replace(/^@\//, "");
  }

  return /^(?:src\/components\/ui|src\/lib)(?:\/|$)/.test(resolvedPath);
}

test("Tailwind utilities do not enable the legacy-resetting preflight", () => {
  assert.equal(tailwindConfig.corePlugins?.preflight, false);
});

test("a consumer className can override a primitive utility without class-order coupling", () => {
  // CVA emits default classes, and passing its result through cn is the shared
  // primitive contract. The assertion describes the resulting behavior rather
  // than pinning the order of any primitive's Tailwind class string.
  const primitiveClasses = (variant = "default") =>
    variant === "default" ? "inline-flex px-2 text-sm" : "inline-flex px-1 text-xs";

  assert.equal(cn(primitiveClasses(), "px-4"), "inline-flex text-sm px-4");

  for (const filename of ["button.jsx", "badge.jsx", "card.jsx", "progress.jsx"]) {
    const source = readFileSync(join(UI_ROOT, filename), "utf8");
    assert.match(
      source,
      /className=\{cn\([\s\S]*?,\s*className\s*,?\s*\)\}/,
      `${filename} must compose consumer className through cn()`,
    );
  }
});

test("generic UI primitives use only primitive, shared-lib, or external dependencies", () => {
  assert.equal(existsSync(UI_ROOT), true, "src/components/ui must exist");
  const violations = [];

  for (const path of sourceFiles(UI_ROOT)) {
    for (const specifier of importSpecifiers(readFileSync(path, "utf8"))) {
      if (!isAllowedPrimitiveDependency(specifier, path)) {
        violations.push(`${projectPath(path)} imports non-platform module ${specifier}`);
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    "Generic primitives must remain independent of Assessment, AI, Workbench, notes, source-viewer, and every other feature/domain layer.",
  );
});
