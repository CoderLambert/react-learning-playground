import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const NOTES_DIR_URL = new URL("../src/content/notes/", import.meta.url);
const NOTES_DIR = fileURLToPath(NOTES_DIR_URL);
const REGISTRY_FILE = new URL("../src/demos/index.js", import.meta.url);
const TEACHING_COMPONENTS_FILE = new URL("../src/components/mdx/TeachingComponents.jsx", import.meta.url);
const NOTE_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

const TEACHING_PROPS = {
  Callout: new Set(["type", "title"]),
  MentalModel: new Set(["title"]),
  Concept: new Set(["title"]),
  Experiment: new Set(["title"]),
  Observation: new Set(["title"]),
  Compare: new Set(["left", "right", "leftTitle", "rightTitle"]),
  Timeline: new Set(["steps"]),
  Flow: new Set(["items"]),
  Boundary: new Set(["title"]),
  AntiPattern: new Set(["title"]),
  CodeBlock: new Set(["code", "language", "fileName", "caption"]),
  CodeDiff: new Set(["before", "after", "beforeTitle", "afterTitle", "language"]),
  DemoReference: new Set(["action", "observe"]),
  Summary: new Set(["title"]),
  FurtherReading: new Set(["items"]),
};

// Runtime PR #82 owns this lesson and already rewrites it substantially. Keep the
// old aliases accepted only for that unreconciled file so new notes cannot add debt.
const TEMPORARY_ALIAS_PROPS = new Map([
  ["event-vs-effect.mdx", new Set(["Summary:items", "FurtherReading:links"])],
]);

const COMPONENT_PATTERN = new RegExp(
  `<(${Object.keys(TEACHING_PROPS).join("|")})\\b([\\s\\S]*?)(/?)>`,
  "g",
);

function allNoteFiles() {
  return readdirSync(NOTES_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .sort();
}

function noteFiles() {
  return allNoteFiles().filter((name) => name !== "runtime-smoke.mdx");
}

function parseAttributes(source) {
  const names = [];
  let index = 0;

  function skipQuoted(quote) {
    index += 1;
    while (index < source.length) {
      if (source[index] === "\\") {
        index += 2;
        continue;
      }
      if (source[index] === quote) {
        index += 1;
        return;
      }
      index += 1;
    }
  }

  function skipExpression() {
    let depth = 0;
    while (index < source.length) {
      const char = source[index];
      if (char === '"' || char === "'" || char === "`") {
        skipQuoted(char);
        continue;
      }
      if (char === "{") depth += 1;
      if (char === "}") {
        depth -= 1;
        index += 1;
        if (depth === 0) return;
        continue;
      }
      index += 1;
    }
  }

  while (index < source.length) {
    while (/\s/.test(source[index] ?? "")) index += 1;
    if (index >= source.length || source[index] === "/") break;

    const nameMatch = source.slice(index).match(/^([A-Za-z_$][\w$:-]*)/);
    if (!nameMatch) {
      index += 1;
      continue;
    }

    const name = nameMatch[1];
    names.push(name);
    index += name.length;
    while (/\s/.test(source[index] ?? "")) index += 1;

    if (source[index] !== "=") continue;
    index += 1;
    while (/\s/.test(source[index] ?? "")) index += 1;

    const valueStart = source[index];
    if (valueStart === '"' || valueStart === "'") skipQuoted(valueStart);
    else if (valueStart === "{") skipExpression();
    else {
      while (index < source.length && !/\s/.test(source[index])) index += 1;
    }
  }

  return names;
}

function openingTags(source) {
  return [...source.matchAll(COMPONENT_PATTERN)].map((match) => ({
    component: match[1],
    attributes: parseAttributes(match[2]),
    attributeSource: match[2],
    selfClosing: match[3] === "/",
  }));
}

function isTemporaryAlias(fileName, component, prop) {
  return TEMPORARY_ALIAS_PROPS.get(fileName)?.has(`${component}:${prop}`) ?? false;
}

function hasLiteralEmptyProp(attributeSource, prop) {
  const escapedProp = prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `(?:^|\\s)${escapedProp}\\s*=\\s*(?:"\\s*"|'\\s*'|\\{\\s*"\\s*"\\s*\\}|\\{\\s*'\\s*'\\s*\\}|\\{\\s*\\[\\s*\\]\\s*\\})`,
  );
  return pattern.test(attributeSource);
}

function demoIds() {
  const registry = readFileSync(REGISTRY_FILE, "utf8");
  const demosStart = registry.indexOf("export const demos = [");
  assert.notEqual(demosStart, -1, "src/demos/index.js must export the demos registry");
  return [...registry.slice(demosStart).matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);
}

test("every registered learning unit has one convention-based note", () => {
  const ids = demoIds();
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, ids.length, "registered demo ids must be unique");

  const available = new Set(noteFiles().map((name) => name.slice(0, -4)));
  const missing = ids.filter((id) => !available.has(id));
  assert.deepEqual(missing, [], "every registered demo must have a matching note");
});

test("production note filenames stay compatible with compiled and raw note registries", () => {
  const files = allNoteFiles();
  const invalidFileNames = files.filter((name) => !NOTE_ID_PATTERN.test(name.slice(0, -4)));
  assert.deepEqual(
    invalidFileNames,
    [],
    "every MDX filename must be a valid raw-note registry id so compiled and raw loading stay in sync",
  );

  const registeredIds = [...new Set(demoIds())].sort();
  const productionNoteIds = noteFiles().map((name) => name.slice(0, -4)).sort();
  assert.deepEqual(
    productionNoteIds,
    registeredIds,
    "production notes must map one-to-one to registered learning units; runtime-smoke.mdx is the only fixture exception",
  );
});

test("teaching primitives use supported props and do not silently render empty blocks", () => {
  const problems = [];

  for (const fileName of noteFiles()) {
    const source = readFileSync(join(NOTES_DIR, fileName), "utf8");

    for (const tag of openingTags(source)) {
      const allowed = TEACHING_PROPS[tag.component];
      const unsupported = tag.attributes.filter(
        (name) => !allowed.has(name) && !isTemporaryAlias(fileName, tag.component, name),
      );
      if (unsupported.length > 0) {
        problems.push(`${fileName}: <${tag.component}> unsupported props: ${unsupported.join(", ")}`);
      }

      const props = new Set(tag.attributes);
      if (tag.component === "DemoReference") {
        if (!props.has("action") || !props.has("observe")) {
          problems.push(`${fileName}: <DemoReference> must provide both action and observe`);
        }
        if (hasLiteralEmptyProp(tag.attributeSource, "action")) {
          problems.push(`${fileName}: <DemoReference> action must not be an empty literal`);
        }
        if (hasLiteralEmptyProp(tag.attributeSource, "observe")) {
          problems.push(`${fileName}: <DemoReference> observe must not be an empty literal`);
        }
      }

      if (tag.component === "Timeline" && hasLiteralEmptyProp(tag.attributeSource, "steps")) {
        problems.push(`${fileName}: <Timeline> steps must not be a literal empty value`);
      }
      if (tag.component === "Flow" && hasLiteralEmptyProp(tag.attributeSource, "items")) {
        problems.push(`${fileName}: <Flow> items must not be a literal empty value`);
      }
      if (tag.component === "FurtherReading" && hasLiteralEmptyProp(tag.attributeSource, "items")) {
        problems.push(`${fileName}: <FurtherReading> items must not be a literal empty value`);
      }

      if (!tag.selfClosing) continue;

      if (tag.component === "Timeline" && !props.has("steps")) {
        problems.push(`${fileName}: self-closing <Timeline> has no steps`);
      }
      if (tag.component === "Flow" && !props.has("items")) {
        problems.push(`${fileName}: self-closing <Flow> has no items`);
      }
      if (tag.component === "Compare" && !props.has("left") && !props.has("right")) {
        problems.push(`${fileName}: self-closing <Compare> has no comparison content`);
      }
      if (
        tag.component === "Compare" &&
        (!props.has("left") || hasLiteralEmptyProp(tag.attributeSource, "left")) &&
        (!props.has("right") || hasLiteralEmptyProp(tag.attributeSource, "right"))
      ) {
        problems.push(`${fileName}: self-closing <Compare> has only literal empty comparison content`);
      }
      if (
        tag.component === "Summary" &&
        !props.has("items") &&
        !isTemporaryAlias(fileName, "Summary", "items")
      ) {
        problems.push(`${fileName}: self-closing <Summary> has no content`);
      }
      if (
        tag.component === "FurtherReading" &&
        !props.has("items") &&
        !isTemporaryAlias(fileName, "FurtherReading", "links")
      ) {
        problems.push(`${fileName}: self-closing <FurtherReading> has no links`);
      }
    }
  }

  assert.deepEqual(problems, []);
});

test("runtime keeps temporary aliases until all existing notes are normalized", () => {
  const source = readFileSync(TEACHING_COMPONENTS_FILE, "utf8");
  assert.ok(source.includes("export function Timeline({ steps = [], items = [], children })"));
  assert.ok(source.includes('export function Summary({ title = "核心结论", items = [], children })'));
  assert.ok(source.includes("leftItems = []"));
  assert.ok(source.includes("rightItems = []"));
  assert.ok(source.includes("export function FurtherReading({ items = [], links = [], children })"));
});
