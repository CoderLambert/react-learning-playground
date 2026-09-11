import assert from "node:assert/strict";
import test from "node:test";

import {
  buildNames,
  buildRegistryUpdate,
  parseArguments,
  readCategories,
  validateCategory,
} from "../scripts/create-demo.mjs";

const registryFixture = `import { ExistingDemo } from "./ExistingDemo";
import existingRaw from "./ExistingDemo.jsx?raw";

// @demo-imports

export const CATEGORIES = [
  { id: "components", name: "组件通信与插槽", icon: "🧩" },
  { id: "effects", name: "Hooks 与副作用深度", icon: "🎣" },
];

export const demos = [
  { id: "existing", label: "Existing", category: "components", Component: ExistingDemo, files: [{ name: "ExistingDemo.jsx", code: existingRaw }] },
  // @demo-entries
];
`;

test("parseArguments reads title and explicit category", () => {
  assert.deepEqual(
    parseArguments(["use-id", "useId", "--category", "components"]),
    { help: false, name: "use-id", title: "useId", category: "components" },
  );

  assert.deepEqual(
    parseArguments(["state-batching", "--title", "State 批处理", "-c", "effects"]),
    { help: false, name: "state-batching", title: "State 批处理", category: "effects" },
  );
});

test("buildNames preserves existing normalization and derives raw variable", () => {
  assert.deepEqual(buildNames("use-id"), {
    componentName: "UseIdDemo",
    defaultTitle: "Use Id",
    id: "use-id",
    rawVariableName: "useIdRaw",
  });

  assert.equal(buildNames("StateBatchingDemo").id, "state-batching");
});

test("readCategories derives valid ids from registry source", () => {
  assert.deepEqual(readCategories(registryFixture), [
    { id: "components", name: "组件通信与插槽" },
    { id: "effects", name: "Hooks 与副作用深度" },
  ]);
});

test("validateCategory rejects missing and unknown categories", () => {
  const categories = readCategories(registryFixture);

  assert.throws(() => validateCategory("", categories), /缺少 category/);
  assert.throws(() => validateCategory("missing", categories), /未知 category：missing/);
  assert.equal(validateCategory("effects", categories), "effects");
});

test("buildRegistryUpdate creates an immediately valid Workbench entry and raw source", () => {
  const nextRegistry = buildRegistryUpdate(registryFixture, {
    componentName: "UseIdDemo",
    id: "use-id",
    title: "useId",
    category: "components",
    rawVariableName: "useIdRaw",
  });

  assert.match(nextRegistry, /import \{ UseIdDemo \} from "\.\/UseIdDemo";/);
  assert.match(nextRegistry, /import useIdRaw from "\.\/UseIdDemo\.jsx\?raw";/);
  assert.match(nextRegistry, /id: "use-id"/);
  assert.match(nextRegistry, /label: "🧪 useId"/);
  assert.match(nextRegistry, /category: "components"/);
  assert.match(nextRegistry, /Component: UseIdDemo/);
  assert.match(nextRegistry, /files: \[\{ name: "UseIdDemo\.jsx", code: useIdRaw \}\]/);
  assert.match(nextRegistry, /\/\/ @demo-imports/);
  assert.match(nextRegistry, /\/\/ @demo-entries/);
});

test("buildRegistryUpdate keeps duplicate protections", () => {
  assert.throws(
    () => buildRegistryUpdate(registryFixture, {
      componentName: "AnotherDemo",
      id: "existing",
      title: "Another",
      category: "components",
      rawVariableName: "anotherRaw",
    }),
    /Demo id 已存在：existing/,
  );

  assert.throws(
    () => buildRegistryUpdate(`${registryFixture}\nconst x = { Component: UseIdDemo };`, {
      componentName: "UseIdDemo",
      id: "use-id",
      title: "useId",
      category: "components",
      rawVariableName: "useIdRaw",
    }),
    /Demo 组件已注册：UseIdDemo/,
  );
});
