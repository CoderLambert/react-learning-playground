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
  npm run demo:new -- <name> [title]
  npm run demo:new -- <name> --title <title>

示例：
  npm run demo:new -- use-effect "useEffect 基础"
  npm run demo:new -- state-batching --title "State 批处理"
`);
}

function parseArguments(argumentsList) {
  let name = "";
  let title = "";

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument === "--help" || argument === "-h") {
      return { help: true, name, title };
    }

    if (argument === "--title" || argument === "-t") {
      title = argumentsList[index + 1] ?? "";
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

  return { help: false, name, title };
}

function buildNames(rawName) {
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

  return {
    componentName: `${pascalName}Demo`,
    defaultTitle: normalizedWords
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" "),
    id: normalizedWords.join("-"),
  };
}

function createDemoSource(componentName, title) {
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

async function promptForDemo() {
  if (!process.stdin.isTTY) {
    throw new Error("缺少 Demo 名称。请执行 npm run demo:new -- <name> [title]。");
  }

  const readline = createInterface({ input: process.stdin, output: process.stdout });

  try {
    const name = (await readline.question("Demo 名称（如 use-effect）：")).trim();
    const names = buildNames(name);
    const title = (
      await readline.question(`展示标题（默认 ${names.defaultTitle}）：`)
    ).trim();

    return { name, title: title || names.defaultTitle };
  } finally {
    readline.close();
  }
}

async function createDemo(rawName, rawTitle) {
  const { componentName, defaultTitle, id } = buildNames(rawName);
  const title = rawTitle.trim() || defaultTitle;
  const demoPath = path.join(demosDirectory, `${componentName}.jsx`);
  const registry = await readFile(registryPath, "utf8");

  if (!registry.includes(importMarker) || !registry.includes(entryMarker)) {
    throw new Error("Demo 注册文件缺少生成标记，请检查 src/demos/index.js。");
  }

  if (registry.includes(`id: ${JSON.stringify(id)}`)) {
    throw new Error(`Demo id 已存在：${id}`);
  }

  if (registry.includes(`Component: ${componentName}`)) {
    throw new Error(`Demo 组件已注册：${componentName}`);
  }

  const importLine = `import { ${componentName} } from "./${componentName}";\n`;
  const entry = `  {
    id: ${JSON.stringify(id)},
    label: ${JSON.stringify(`🧪 ${title}`)},
    Component: ${componentName},
  },
`;
  const nextRegistry = registry
    .replace(importMarker, `${importLine}${importMarker}`)
    .replace(entryMarker, `${entry}${entryMarker}`);

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
  console.log(`已注册 Demo：${id} → ${title}`);
}

async function main() {
  const parsed = parseArguments(process.argv.slice(2));

  if (parsed.help) {
    printHelp();
    return;
  }

  const input = parsed.name ? parsed : await promptForDemo();
  await createDemo(input.name, input.title);
}

main().catch((error) => {
  console.error(`创建失败：${error.message}`);
  process.exitCode = 1;
});
