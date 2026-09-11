#!/usr/bin/env node

import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const demosDirectory = path.join(projectRoot, "src", "demos");
const registryPath = path.join(demosDirectory, "index.js");
const importMarker = "// @demo-imports";
const entryMarker = "  // @demo-entries";

function printHelp() {
  console.log(`用法：
  npm run demo:new
  npm run demo:new -- <name> [title] --category <category-id>
  npm run demo:new -- <name> --title <title> --category <category-id>

示例：
  npm run demo:new -- use-effect "useEffect 基础" --category effects
  npm run demo:new -- state-batching --title "State 批处理" -c render-model

非交互模式必须显式指定 --category / -c；可用 category 来自 src/demos/index.js 的 CATEGORIES。
`);
}

export function parseArguments(argumentsList) {
  let name = "";
  let title = "";
  let category = "";

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument === "--help" || argument === "-h") {
      return { help: true, name, title, category };
    }

    if (argument === "--title" || argument === "-t") {
      title = argumentsList[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (argument === "--category" || argument === "-c") {
      category = argumentsList[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (argument.startsWith("-")) {
      throw new Error(`未知参数：${argument}`);
    }

    if (!name) {
      name = argument;
    } else {
      title = title ? `${title} ${argument}` : argument;
    }
  }

  return { help: false, name, title, category };
}

export function buildNames(rawName) {
  const baseName = rawName.trim().replace(/(?:[-_\s]?demo)$/i, "");
  const words = baseName
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);

  if (words.length === 0 || !/^[A-Za-z]/.test(words[0])) {
    throw new Error("Demo 名称需使用英文字母开头，例如 use-effect 或 StateBatching。");
  }

  const normalizedWords = words.map((word) => word.toLowerCase());
  const pascalName = normalizedWords
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
  const camelName = pascalName[0].toLowerCase() + pascalName.slice(1);

  return {
    componentName: `${pascalName}Demo`,
    defaultTitle: normalizedWords
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" "),
    id: normalizedWords.join("-"),
    rawVariableName: `${camelName}Raw`,
  };
}

export function readCategories(registry) {
  const categoriesBlock = registry.match(/export const CATEGORIES\s*=\s*\[([\s\S]*?)\n\];/);
  if (!categoriesBlock) {
    throw new Error("无法读取 CATEGORIES，请检查 src/demos/index.js。");
  }

  const categories = [];
  const categoryPattern = /\{\s*id:\s*["']([^"']+)["'],\s*name:\s*["']([^"']+)["']/g;
  let match;
  while ((match = categoryPattern.exec(categoriesBlock[1])) !== null) {
    categories.push({ id: match[1], name: match[2] });
  }

  if (categories.length === 0) {
    throw new Error("CATEGORIES 中没有可用分类，请检查 src/demos/index.js。");
  }

  return categories;
}

export function validateCategory(category, categories) {
  if (!category) {
    throw new Error("缺少 category。非交互模式请使用 --category <category-id>（或 -c）。");
  }

  if (!categories.some((item) => item.id === category)) {
    throw new Error(`未知 category：${category}。可用值：${categories.map((item) => item.id).join(", ")}`);
  }

  return category;
}

export function createDemoSource(componentName, title) {
  return `export function ${componentName}() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>{${JSON.stringify(`🧪 ${title}`)}}</h2>
        <p style={{ color: "#475569", lineHeight: "1.6" }}>
          在这里记录这个 React 知识点的说明与实验目标。
        </p>
      </div>

      <section style={{ marginBottom: "28px" }}>
        <h3>实验区域</h3>
        <p>开始编写你的 Demo 吧。</p>
      </section>
    </div>
  );
}

export default ${componentName};
`;
}

export function buildRegistryUpdate(registry, { componentName, id, title, category, rawVariableName }) {
  if (!registry.includes(importMarker) || !registry.includes(entryMarker)) {
    throw new Error("Demo 注册文件缺少生成标记，请检查 src/demos/index.js。");
  }

  if (registry.includes(`id: ${JSON.stringify(id)}`)) {
    throw new Error(`Demo id 已存在：${id}`);
  }

  if (registry.includes(`Component: ${componentName}`)) {
    throw new Error(`Demo 组件已注册：${componentName}`);
  }

  const importLines = [
    `import { ${componentName} } from "./${componentName}";`,
    `import ${rawVariableName} from "./${componentName}.jsx?raw";`,
    "",
  ].join("\n");
  const entry = `  {
    id: ${JSON.stringify(id)},
    label: ${JSON.stringify(title)},
    category: ${JSON.stringify(category)},
    Component: ${componentName},
    files: [{ name: ${JSON.stringify(`${componentName}.jsx`)}, code: ${rawVariableName} }],
  },
`;

  return registry
    .replace(importMarker, `${importLines}${importMarker}`)
    .replace(entryMarker, `${entry}${entryMarker}`);
}

async function promptForDemo(registry) {
  if (!process.stdin.isTTY) {
    throw new Error("缺少 Demo 名称。请执行 npm run demo:new -- <name> [title] --category <category-id>。");
  }

  const categories = readCategories(registry);
  const readline = createInterface({ input: process.stdin, output: process.stdout });

  try {
    const name = (await readline.question("Demo 名称（如 use-effect）：")).trim();
    const names = buildNames(name);
    const title = (
      await readline.question(`展示标题（默认 ${names.defaultTitle}）：`)
    ).trim();
    console.log("可用分类：");
    for (const item of categories) {
      console.log(`  ${item.id} — ${item.name}`);
    }
    const category = (await readline.question("Category id：")).trim();
    validateCategory(category, categories);

    return { name, title: title || names.defaultTitle, category };
  } finally {
    readline.close();
  }
}

async function createDemo(rawName, rawTitle, rawCategory, registry) {
  const { componentName, defaultTitle, id, rawVariableName } = buildNames(rawName);
  const title = rawTitle.trim() || defaultTitle;
  const categories = readCategories(registry);
  const category = validateCategory(rawCategory.trim(), categories);
  const demoPath = path.join(demosDirectory, `${componentName}.jsx`);
  const nextRegistry = buildRegistryUpdate(registry, {
    componentName,
    id,
    title,
    category,
    rawVariableName,
  });

  await writeFile(demoPath, createDemoSource(componentName, title), {
    encoding: "utf8",
    flag: "wx",
  });

  try {
    await writeFile(registryPath, nextRegistry, "utf8");
  } catch (error) {
    await unlink(demoPath);
    throw error;
  }

  console.log(`已创建 src/demos/${componentName}.jsx`);
  console.log(`已注册 Demo：${id} → ${title} [${category}]`);
  console.log(`已注册 Source：${componentName}.jsx`);
}

async function main() {
  const parsed = parseArguments(process.argv.slice(2));

  if (parsed.help) {
    printHelp();
    return;
  }

  const registry = await readFile(registryPath, "utf8");
  const input = parsed.name ? parsed : await promptForDemo(registry);
  await createDemo(input.name, input.title, input.category, registry);
}

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) {
  main().catch((error) => {
    console.error(`创建失败：${error.message}`);
    process.exitCode = 1;
  });
}
