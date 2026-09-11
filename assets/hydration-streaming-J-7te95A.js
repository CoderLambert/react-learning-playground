var e=`# Hydration 与 Streaming：HTML 到达和交互就绪不是同一时刻

<MentalModel title="服务端 HTML 是起点，hydration 建立客户端能力">
SSR 可以先把 HTML 发给浏览器；hydration 让客户端 React 在已有 DOM 上建立组件树并绑定交互。Streaming 则允许服务端分批发送可展示内容。三者共同优化“看到内容”和“能交互”的路径，但它们不是同一个阶段。
</MentalModel>

<Timeline steps={[
  "服务器开始 render，并可先 flush 已就绪的 shell",
  "浏览器逐步接收/解析 HTML，用户可能已经看到内容",
  "Suspense 边界就绪后，服务器继续 stream 后续片段",
  "客户端 JavaScript 下载执行，hydrateRoot 在已有 HTML 上建立 React 连接",
  "相关 Client Component hydration 完成后，事件处理等交互能力可用"
]} />

<Experiment title="区分可见时间与可交互时间">
在中间 Demo 中观察 shell、延迟内容和 hydration 标记。不要只问“页面什么时候出现”，分别记录 HTML 何时可见、某个 Suspense 区域何时出现、按钮何时真正具备客户端交互。
</Experiment>

<DemoReference action="按时间顺序观察 streaming/hydration 阶段" observe="区分 server render、HTML arrival、boundary reveal 与 client hydration。" />

<Observation>
Hydration 要求客户端首次渲染与服务端 HTML 在语义上匹配。用 \`typeof window\`、随机数、当前时间等让首屏两端输出不同内容，会制造 hydration mismatch；React 可能恢复，但这通常是应修复的 bug，而不是正常控制流。
</Observation>

<AntiPattern title="用 suppressHydrationWarning 普遍掩盖不一致">
\`suppressHydrationWarning\` 是有限的 escape hatch，不会修复错误的数据/渲染模型。应先让服务端与客户端共享确定的首屏输入；只有真正不可避免的局部差异才考虑抑制警告。
</AntiPattern>

<Boundary title="Streaming 管线通常由 Framework 组织">
React DOM Server 提供 \`renderToPipeableStream\` / \`renderToReadableStream\` 等能力，\`hydrateRoot\` 提供 hydration；路由级数据、HTTP flush、资源提示、部署 runtime 与 RSC payload 如何组合通常由框架决定。
</Boundary>

<Summary>
- SSR HTML 可见与客户端交互就绪是不同里程碑。
- Streaming 让服务端按边界逐步发送内容。
- Hydration 在已有 HTML 上建立客户端 React 能力。
- mismatch 应修复根因，不应靠 warning suppression 常态化。
</Summary>

<FurtherReading items={[
  { label: "React: hydrateRoot", href: "https://react.dev/reference/react-dom/client/hydrateRoot" },
  { label: "React: renderToPipeableStream", href: "https://react.dev/reference/react-dom/server/renderToPipeableStream" },
  { label: "React: Suspense", href: "https://react.dev/reference/react/Suspense" }
]} />`;export{e as default};