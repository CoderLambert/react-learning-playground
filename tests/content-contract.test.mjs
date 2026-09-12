import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const NOTES_DIR_URL = new URL("../src/content/notes/", import.meta.url);
const NOTES_DIR = fileURLToPath(NOTES_DIR_URL);
const REGISTRY_FILE = new URL("../src/demos/index.js", import.meta.url);
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

function readRepoFile(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
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
      const unsupported = tag.attributes.filter((name) => !allowed.has(name));
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
        !props.has("items")
      ) {
        problems.push(`${fileName}: self-closing <Summary> has no content`);
      }
      if (
        tag.component === "FurtherReading" &&
        !props.has("items")
      ) {
        problems.push(`${fileName}: self-closing <FurtherReading> has no links`);
      }
    }
  }

  assert.deepEqual(problems, []);
});

test("audit-sensitive lesson claims stay aligned with their demos", () => {
  const childrenNote = readRepoFile("src/content/notes/children.mdx");
  const childrenDemo = readRepoFile("src/demos/ChildrenSlotDemo.jsx");
  assert.doesNotMatch(childrenDemo, /React 19 全新架构|默认支持编译器指令|任意 HTML/);
  assert.match(childrenNote, /结构由调用者变化 → composition/);
  assert.match(childrenNote, /稳定语义参数 → props/);

  const pureRenderNote = readRepoFile("src/content/notes/component-jsx-pure-render.mdx");
  assert.doesNotMatch(pureRenderNote, /区分组件函数执行、返回 JSX 与最终 DOM 更新/);
  assert.match(pureRenderNote, /本 Demo 不测量真实 render\/commit 次数/);
  assert.match(pureRenderNote, /本次 render 内新创建、尚未逃逸的局部对象/);

  const stateReducerNote = readRepoFile("src/content/notes/state-reducer.mdx");
  const stateReducerDemo = readRepoFile("src/demos/StateReducerDemo.jsx");
  const reducerActions = [...stateReducerDemo.matchAll(/case "([A-Z_]+)"/g)].map((match) => match[1]);
  const demoReferenceActions = stateReducerNote.match(/<DemoReference\s+action="([^"]+)"/)?.[1] ?? "";

  assert.deepEqual(
    reducerActions.sort(),
    ["INCREMENT", "DECREMENT", "SET_STEP", "RESET", "UNDO"].sort(),
    "StateReducerDemo reducer action set changed; update the lesson contract intentionally",
  );
  for (const actionType of reducerActions) {
    assert.match(demoReferenceActions, new RegExp(`\\b${actionType}\\b`));
  }
  assert.doesNotMatch(stateReducerNote, /add\/update\/remove/);
  assert.match(stateReducerNote, /不代表完整 action trace/);
  assert.match(stateReducerDemo, /这里仅记录 INCREMENT、DECREMENT、RESET 产生的 count 转换/);
});

test("second-round notes preserve production boundary semantics", () => {
  const rscNote = readRepoFile("src/content/notes/rsc-boundary.mdx");
  assert.match(rscNote, /\.server|\.client/);
  assert.match(rscNote, /(不是|并非).*(React.*标准|standard)/i);
  assert.match(rscNote, /(序列化|serializ)/i);
  assert.match(rscNote, /(secret|敏感|机密)/i);
  assert.match(rscNote, /(浏览器边界|client boundary|客户端边界)/i);

  const urlNote = readRepoFile("src/content/notes/url-state.mdx");
  for (const concept of [/parse|解析/i, /default|默认/i, /enum|枚举/i, /range|范围/i, /canonical|规范化|归一/i]) {
    assert.match(urlNote, concept);
  }
  assert.match(urlNote, /(不可信|untrusted)/i);

  const routeDataNote = readRepoFile("src/content/notes/route-data-boundary.mdx");
  assert.match(routeDataNote, /(setTimeout|simulat|模拟)/i);
  assert.match(routeDataNote, /(cancellation|cancel|取消)/i);
  assert.match(routeDataNote, /(race|stale|过时|陈旧)/i);

  const memoNote = readRepoFile("src/content/notes/react-memo.mdx");
  assert.match(memoNote, /(性能优化|performance optimization)/i);
  assert.match(memoNote, /(function prop|函数.*prop|函数.*属性)/i);
  assert.doesNotMatch(memoNote, /(props.*相同|相同.*props).*(保证|一定|绝不).*(执行|render|渲染)/i);

  const useMemoNote = readRepoFile("src/content/notes/use-memo.mdx");
  assert.match(useMemoNote, /(组件实例|component instance).*(缓存|cache)/i);
  assert.match(useMemoNote, /(application cache|server-state cache|request cache|应用缓存|server-state|请求缓存)/i);
  assert.match(useMemoNote, /(不是|并非|不等于|≠|not)/i);

  const useCallbackNote = readRepoFile("src/content/notes/use-callback.mdx");
  assert.match(useCallbackNote, /(函数.*表达式|function expression)/i);
  assert.match(useCallbackNote, /(不是|并非|不.*避免|not).*(创建|函数.*creation|function creation)/i);

  const accessibilityNote = readRepoFile("src/content/notes/accessibility-basics.mdx");
  assert.match(accessibilityNote, /placeholder.*(不能|不应|不能替代|not).*(label|标签)/i);
  assert.match(accessibilityNote, /(axe|automated|自动).*(不.*完整|不能.*完整|not.*complete)/i);

  const updatedAdviceFiles = [
    "rsc-boundary",
    "react-compiler",
    "url-state",
    "nested-routes",
    "route-data-boundary",
    "reference-equality",
    "react-memo",
    "use-memo",
    "use-callback",
    "profiler",
    "testing-strategy",
    "accessibility-basics",
    "lazy-suspense",
    "controlled-form",
    "form-action",
    "custom-hooks",
  ];
  for (const id of updatedAdviceFiles) {
    const advice = readRepoFile(`src/content/notes-advice/${id}.mdx`);
    assert.doesNotMatch(advice, /## 建议修改|建议补充/);
  }
});
