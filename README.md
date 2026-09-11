# React Learning Playground

一个面向 React 学习、实验和源码对照的 Workbench，基于 React 19、Vite、MDX、Shiki 和 Playwright 构建。

在线地址：<https://coderlambert.github.io/react-learning-playground/>

当前所有已注册学习单元都配有对应的 MDX 笔记，并保留 12 个章节 checkpoint。学习方式是：**左侧选择知识点，中间运行 Demo，右侧阅读 Notes 或查看 Source。**

## 本地运行

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run lint
npm run build
npm run test:e2e
npm run preview
```

Vite 使用 GitHub Pages base path，因此本地开发页面通常从下面的路径访问：

```text
http://localhost:5173/react-learning-playground/
```

也可以直接通过 Demo id 打开指定学习单元：

```text
http://localhost:5173/react-learning-playground/?demo=props
```

## Workbench 怎么用

Workbench 分成三个区域：

- **左侧 Navigation**：按分类浏览、搜索和选择学习单元，也可以折叠。
- **中间 Demo**：真正执行实验、操作交互、观察 React 行为。
- **右侧 Learning Inspector**：`Notes` 阅读知识笔记，`Source` 查看当前 Demo 的源码；支持调整宽度、折叠和 Focus Mode。

项目保持一条明确边界：**Center Demo = experiment；MDX = explanation。** Demo 用来制造和观察现象，笔记负责解释心智模型、机制、边界和工程实践。

## 项目目录

```text
src/
├── App.jsx
├── components/
│   ├── learning-inspector/     # Notes / Source Inspector
│   └── mdx/                    # MDX 教学组件
├── content/
│   └── notes/                  # 每个学习单元对应一个 .mdx 笔记
├── demos/
│   ├── index.js                # Demo registry / metadata source of truth
│   └── *Demo.jsx               # 可运行实验
├── lib/                        # 共享运行时，例如 Shiki
└── workbench/                  # Workbench 状态、URL、note registry 等

tests/
├── e2e/
└── workbench-state-url.test.mjs
```

## 修改已有笔记

笔记位于：

```text
src/content/notes/<demo-id>.mdx
```

例如 Props Demo 的 id 是 `props`，对应笔记就是：

```text
src/content/notes/props.mdx
```

只修改已有笔记时，通常**不需要**修改 `src/demos/index.js`、`App.jsx` 或 Workbench 代码。保存 MDX 后，Vite 会自动刷新。

推荐先打开对应 Demo：

```text
http://localhost:5173/react-learning-playground/?demo=props
```

然后一边操作中间 Demo，一边修改右侧 Notes。

## 新增笔记

新增笔记时，文件名必须和已有 Demo 的 `id` 完全一致：

```text
src/content/notes/<learning-unit-id>.mdx
```

例如 registry 中存在：

```js
{
  id: "use-ref",
  // ...
}
```

那么笔记文件必须是：

```text
src/content/notes/use-ref.mdx
```

不需要手动 import 或注册笔记。`src/workbench/noteRegistry.js` 会通过 `import.meta.glob(...)` 按 id 懒加载对应 MDX。

笔记可以直接使用项目提供的教学组件，不需要额外 import。常用组件包括：

```text
Callout
MentalModel
Concept
Experiment
Observation
Compare
Timeline
Flow
Boundary
AntiPattern
CodeBlock
CodeDiff
DemoReference
Summary
FurtherReading
```

一个最小示例：

```mdx
# Props

<MentalModel title="Props 是当前 render 的输入">
Props 由父组件传给子组件，子组件应把它视为只读输入。
</MentalModel>

<Experiment title="观察父 → 子的数据流">
在中间 Demo 中修改父级输入，观察子组件下一次 render 的结果。
</Experiment>

<Observation>
子组件读取的是当前 render 对应的 props snapshot。
</Observation>

<AntiPattern title="复制 props 到 state 后持续同步">
如果数据可以直接从 props 派生，就不要再维护第二份 state。
</AntiPattern>

<Summary>
- Props 是只读输入。
- 数据由拥有它的组件更新。
- 可派生数据通常不需要额外 state。
</Summary>
```

更完整的笔记结构和组件约定见：

```text
src/content/notes/README.md
```

## 新增 Demo

### 1. 使用脚手架生成 Workbench-ready Demo

交互式创建：

```bash
npm run demo:new
```

交互模式会询问 Demo 名称、展示标题和所属 category。

非交互模式需要显式传入已有 category：

```bash
npm run demo:new -- use-id "useId" --category components
```

Demo 名称支持 kebab-case、camelCase 或 PascalCase，并且需要以英文字母开头。`category` 必须使用 `src/demos/index.js` 中 `CATEGORIES` 已声明的 id，例如 `components`、`state`、`effects` 等；不要在脚手架参数里自行发明新的 category id。

修正后的脚手架会自动完成：

1. 创建 `src/demos/UseIdDemo.jsx`。
2. 在 `src/demos/index.js` 中加入组件 import。
3. 生成稳定的 Demo id，例如 `use-id`。
4. 写入满足当前 Workbench contract 的 registry entry。
5. 自动加入该 Demo 自身的 Vite `?raw` import，并把它接入 `files`，因此生成后 Source Inspector 就能看到 Demo 主文件。

### 2. 理解 registry 字段边界

当前 Workbench contract 对一个可运行学习单元要求以下字段：

```text
必需：id / category / label / Component
```

其中：

- `id`：稳定学习单元 id，同时决定对应笔记文件名和 `?demo=<id>` URL。
- `category`：必须引用 `CATEGORIES` 中已有的 category id。
- `label`：导航和页面展示标题。
- `Component`：真正运行的 React Demo。

右侧 `Source` Inspector 是否能显示源码由 `files` 决定。要让某个源码文件出现在 Source 中，需要同时满足：

1. 为该文件添加 Vite `?raw` import。
2. 在 `files` 中使用这个 raw import 变量作为 `code`。

`description`、`badge`、`keywords` 属于可选的展示 / 搜索 metadata，可以按需要补充；它们不是 `toLearningUnit` 的最低运行要求。

一个完整 entry 可以写成：

```js
{
  id: "use-id",
  label: "useId",
  category: "components",
  badge: "Hook",
  description: "说明这个实验要解决什么问题",
  Component: UseIdDemo,
  files: [
    { name: "UseIdDemo.jsx", code: useIdRaw },
  ],
}
```

脚手架会自动为新 Demo 主文件创建类似下面的 raw import：

```js
import useIdRaw from "./UseIdDemo.jsx?raw";
```

如果 Demo 还依赖辅助组件，并且也希望在 Source Inspector 中展示这些辅助源码，则需要手工为每个辅助文件增加对应的 `?raw` import，再补到 `files`。

例如：

```js
import useIdRaw from "./UseIdDemo.jsx?raw";
import fieldRaw from "../components/Field.jsx?raw";

// ...

files: [
  { name: "UseIdDemo.jsx", code: useIdRaw },
  { name: "Field.jsx", code: fieldRaw },
]
```

**`files` 中每一个 `code` 变量都必须有对应的 `?raw` import。** 不要只增加 `files` entry 而遗漏 import，否则构建阶段会出现未定义变量。

如果确实需要新增 category，再单独修改 `CATEGORIES`，并评估导航结构是否也应该随之调整；普通新增 Demo 优先复用已有分类。

### 3. 为新 Demo 新增对应笔记

如果新 Demo id 是：

```text
use-id
```

就创建：

```text
src/content/notes/use-id.mdx
```

无需额外注册。

### 4. 本地验证

打开：

```text
http://localhost:5173/react-learning-playground/?demo=use-id
```

确认：

- 左侧 Navigation 能找到新 Demo。
- 中间 Demo 可以正常运行。
- Notes 可以加载 `use-id.mdx`。
- Source 可以看到 registry 中声明的 `files`。
- 刷新带 `?demo=use-id` 的 URL 后仍然能恢复当前 Demo。

然后至少运行：

```bash
npm run lint
npm run build
```

如果修改了 App、Workbench、Demo 交互、Source/Inspector 或 E2E 相关逻辑，再运行：

```bash
CI=true npm run test:e2e
```

## 推荐开发流程

纯笔记修改建议只改 `src/content/notes/*.mdx`；新增 Demo 时再修改 `src/demos` 和对应 registry。一个常见流程是：

```bash
git checkout main
git pull

git checkout -b docs/improve-props-note
# 或 feat/add-use-id-demo

npm install
npm run dev

npm run lint
npm run build

git add .
git commit -m "docs: improve props note"
git push -u origin HEAD
```

然后创建 PR 合并到 `main`。

## CI 策略

为了避免每个内容 PR 都重复安装 Chromium 和跑整套浏览器测试，当前 CI 分层执行：

- 普通内容 / 文档变更：`npm ci` + lint + build。
- Workbench state / URL 变更：额外运行专门的 Node 测试。
- App、components、demos、workbench、E2E、核心配置或依赖等交互敏感变更：运行完整 Chromium E2E 和 production preview smoke。

同一 PR 出现新提交时，旧的 CI run 会自动取消，避免无意义排队。

## 部署

构建：

```bash
npm run build
```

本地预览 production build：

```bash
npm run preview
```

部署到 GitHub Pages：

```bash
npm run deploy
```

项目的 Pages base path 是：

```text
/react-learning-playground/
```

## 设计原则

这个仓库仍然是学习型 playground，不是业务生产应用。新增内容时优先保持下面的职责边界：

- Demo 负责可运行、可观察、可重复的实验。
- MDX Notes 负责解释 mental model、机制、错误模型、实践边界和官方参考资料。
- `src/demos/index.js` 是学习单元 metadata 的 source of truth。
- 笔记通过稳定的 Demo id 自动发现，不维护第二套 registry。
- 不要在 MDX 中重新实现一整套完整 Demo。
