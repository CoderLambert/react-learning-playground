import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const NOTES_DIR_URL = new URL("../src/content/notes/", import.meta.url);
const NOTES_DIR = fileURLToPath(NOTES_DIR_URL);
const REGISTRY_FILE = new URL("../src/demos/index.js", import.meta.url);
const TEACHING_COMPONENTS_FILE = new URL("../src/components/mdx/TeachingComponents.jsx", import.meta.url);

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
  Summary: new Set(["title", "items"]), // items is a temporary compatibility alias.
  FurtherReading: new Set(["items", "links"]), // links is a temporary compatibility alias.
};

const COMPONENT_PATTERN = new RegExp(
  `<(${Object.keys(TEACHING_PROPS).join("|")})\\b([\\s\\S]*?)(/?)>`,
  "g",
);

function noteFiles() {
  return readdirSync(NOTES_DIR)
    .filter((name) => name.endsWith(".mdx") && name !== "runtime-smoke.mdx")
    .sort();
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
    selfClosing: match[3] === "/",
  }));
}

function demoIds() {
  const registry = readFileSync(REGISTRY_FILE, "utf8");
  const demosStart = registry.indexOf("export const demos = [");
  assert.notEqual(demosStart, -1, "src/demos/index.js must export the demos registry");
  return [...registry.slice(demosStart).matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);
}

test("every registered learning unit has a convention-based note", () => {
  const available = new Set(noteFiles().map((name) => name.slice(0, -4)));
  const missing = demoIds().filter((id) => !available.has(id));
  assert.deepEqual(missing, [], "every registered demo must have a matching note");
});

test("teaching primitives use supported props and do not silently render empty self-closing blocks", () => {
  const problems = [];

  for (const fileName of noteFiles()) {
    const source = readFileSync(join(NOTES_DIR, fileName), "utf8");

    for (const tag of openingTags(source)) {
      const allowed = TEACHING_PROPS[tag.component];
      const unsupported = tag.attributes.filter((name) => !allowed.has(name));
      if (unsupported.length > 0) {
        problems.push(`${fileName}: <${tag.component}> unsupported props: ${unsupported.join(", ")}`);
      }

      const props = new Set(tag.attributes);
      if (tag.component === "DemoReference" && (!props.has("action") || !props.has("observe"))) {
        problems.push(`${fileName}: <DemoReference> must provide both action and observe`);
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
      if (tag.component === "Summary" && !props.has("items")) {
        problems.push(`${fileName}: self-closing <Summary> has no content`);
      }
      if (tag.component === "FurtherReading" && !props.has("items") && !props.has("links")) {
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
