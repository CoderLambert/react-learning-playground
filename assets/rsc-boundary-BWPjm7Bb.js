var e=`# RSC Boundary：按执行环境切分组件模块图

<MentalModel title="Server / Client 是模块执行边界，不是两套 UI">
React Server Components 允许一部分组件只在服务端环境执行，把渲染结果通过 RSC payload 交给框架与客户端组合；需要 state、事件处理或浏览器 API 的交互区域进入 Client Component 模块图。目标是把能力放在正确环境，而不是把整个页面二选一。
</MentalModel>

<Flow items={[
  "Framework 构建 Server/Client 模块图",
  "Server Components 在服务端读取允许的服务端资源并生成 RSC 表示",
  "Client Component 边界以引用/可序列化 props 连接",
  "框架把 RSC payload 与 HTML/导航响应组合传输",
  "客户端保留/加载需要交互的 Client Components，并与服务端结果组合"
]} />

<Experiment title="寻找真正需要客户端能力的最小边界">
观察中间 Demo 的 Server/Client 分界。逐项判断：读取数据库/文件、使用 secret、\`useState\`、事件 handler、\`window\` 分别应该在哪一侧。尝试把 Client boundary 向叶子移动，理解为什么这能减少进入客户端模块图的代码。
</Experiment>

### Guided Debugging：先找出“use client 越多越安全”的错误模型

在查看下方解释前，先判断下面这个修复方案哪里有问题：**“遇到 Server/Client boundary 报错时，给父组件和整棵子树都加 \`"use client"\`，这样最省事。”** 写出至少两个代价，并指出哪些能力因此被错误推入客户端模块图。

随后再用 Demo 的能力矩阵逐项核对你的判断。

<details>
<summary>验证后再展开：检查你的边界模型</summary>

把整个子树标成客户端模块会扩大客户端 bundle 与序列化边界，并让本来只应在服务端使用的数据/依赖无法继续停留在服务端环境。正确做法通常是定位真正需要 state、事件或浏览器 API 的交互叶子，让 \`use client\` 边界尽量靠近这些叶子。

同时要记住：Client Component 在支持预渲染的 RSC 框架中仍可能参与服务器生成初始 HTML，\`use client\` 不是 \`ssr: false\`。

**Decision boundary：**按运行时能力切边界，不按“哪里报错就整棵树客户端化”处理。
</details>

<DemoReference action="检查 RSC Demo 中的 Server/Client 能力矩阵" observe="不要按页面切分，而要按模块需要的运行时能力切分。" />

<Observation>
\`"use client"\` 声明的是客户端模块图入口。它并不意味着该组件首次 HTML 一定只在浏览器生成；在支持预渲染的 RSC 框架中，Client Components 仍可能参与服务端生成初始 HTML，然后在客户端 hydration。
</Observation>

<Boundary title="文件后缀与 Server → Client 数据边界">
本 Demo 中的 \`.server\` / \`.client\` 只是教学命名，不是 React 标准文件约定。真实应用的边界可能由 \`"use client"\`、module graph、route/module convention 或 bundler integration 决定；不要把文件名后缀当成 React API。

Server-only data 的安全判断要先于传输判断：

\`\`\`text
Server-only data
      ↓
Server Component 内部可使用

需要跨 Client boundary
      ↓
必须同时满足：
1. 数据允许暴露给浏览器
2. 数据满足 React / Framework 支持的序列化约束
\`\`\`

Server Component 可以访问 secret，但 secret 一旦作为 prop 发送给 Client Component，就已经进入浏览器边界；“数据来自服务器”不等于“数据可以安全暴露”。
</Boundary>

<AntiPattern title="给所有文件加 use client 解决报错">
这样会扩大客户端 bundle 和序列化边界，也失去 Server Component 直接使用服务端资源的优势。遇到边界错误应识别真正需要交互/浏览器能力的叶子，而不是把整棵树推到客户端。
</AntiPattern>

<Boundary title="RSC 的产品化依赖 Framework">
React 定义 Server Components、\`use client\`/Server Functions 等语义，但 bundler 集成、route convention、缓存、RSC payload 传输和部署拓扑需要框架实现。裸 Vite SPA 不能因为 React 版本支持相关 API 就自动获得完整 RSC 架构。
</Boundary>

<Summary>
- RSC 按执行环境切分组件模块图。
- Server Components 适合服务端数据/依赖；交互叶子进入 Client boundary。
- \`use client\` 不是 \`ssr: false\`。
- 尽量把 Client boundary 下沉，但以清晰 API 和可维护性为前提。
</Summary>

<FurtherReading items={[
  { label: "React: Server Components", href: "https://react.dev/reference/rsc/server-components" },
  { label: "React: use client", href: "https://react.dev/reference/rsc/use-client" },
  { label: "Next.js: Server and Client Components", href: "https://nextjs.org/docs/app/getting-started/server-and-client-components" }
]} />
`;export{e as default};