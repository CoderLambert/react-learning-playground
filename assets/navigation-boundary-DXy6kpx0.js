var e=`# Navigation Boundary：把“跳转”当成 history 状态转换

<MentalModel title="导航同时改变 location、history 与 route match">
客户端导航不是普通组件里的 \`setState\`。一次导航会产生目标 location，并根据 push / replace / Back / Forward 语义改变浏览器 history；Router 再用新的 location 计算 route match。未匹配 URL 也需要明确进入 Not Found / route boundary，而不是静默空白。
</MentalModel>

<Timeline steps={[
  "用户点击 Link / NavLink，或程序代码发起 navigation",
  "Router 根据 push / replace / history delta 更新目标 location",
  "新的 location 参与 route matching",
  "匹配成功时渲染目标 route；未匹配时进入明确的 Not Found boundary",
  "Back / Forward 激活已有 history entry，而不是创建新的 push entry"
]} />

<Experiment title="比较 push、replace、Back / Forward 与未匹配路由">
在中间 Demo 中连续进入几个已知路径，观察 history stack 如何增长；再执行 \`replace → /account\`，确认当前 entry 被替换而不是新增。随后使用 Demo 的 Back / Forward，在已有 entry 间移动；最后打开 \`/missing-page\`，观察它如何进入 Not Found boundary。当前 Demo 使用本地数组模拟 history，不是真实 React Router runtime。
</Experiment>

<DemoReference action="依次执行 push、replace、Back、Forward，并打开不存在页面" observe="比较 history stack 的新增/替换/游标移动，以及 matched route 与 Not Found boundary 的变化。" />

<Observation>
\`push\`、\`replace\` 和 history delta 表达的是不同的用户历史语义。普通用户导航优先使用具备链接语义的 \`Link\` / \`NavLink\`；命令式 \`useNavigate\` 更适合无法自然表达为普通链接的流程。Data / Framework 模式下，loader/action 流程中的数据驱动跳转通常优先使用 \`redirect\`。
</Observation>

<AntiPattern title="按钮伪装所有链接">
如果行为本质是“导航到另一个 URL”，却统一使用 \`<button>\` + JavaScript 跳转，会丢失标准链接的右键菜单、新标签页、复制地址以及更自然的键盘/辅助技术语义。用户导航首先应尊重 Web 平台的链接模型。
</AntiPattern>

<Boundary title="history 语义与 pending navigation 是两层问题">
本 Demo 只验证 location/history/match/404，不演示真实 Router 的异步 loader 或 pending navigation。React Router 的 Data / Framework 模式还会提供 navigation pending、loader/action、redirect 等能力；这些不能从本地 history 数组模拟器推导为真实运行时行为。
</Boundary>

<Summary>
- 导航同时涉及 location、history 和 route match，而不是普通组件 state 切换。
- push 新增 entry，replace 替换当前 entry，Back / Forward 在已有 history 中移动。
- 普通用户导航优先 Link / NavLink；命令式导航只在语义上必要时使用。
- 未匹配 URL 应有明确的 Not Found / route boundary。
- pending navigation 属于真实 Router runtime 的另一层能力，本 Demo 不声称覆盖它。
</Summary>

<FurtherReading items={[
  { label: "React Router: Navigating", href: "https://reactrouter.com/start/framework/navigating" },
  { label: "React Router: Pending UI", href: "https://reactrouter.com/start/framework/pending-ui" },
  { label: "MDN: History API", href: "https://developer.mozilla.org/docs/Web/API/History_API" }
]} />`;export{e as default};