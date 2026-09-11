var e=`# Accessible Modal：焦点管理是交互协议的一部分

<MentalModel title="Modal 不只是盖一层遮罩">
真正的 modal dialog 建立了临时交互边界：背景内容对当前任务不可操作，键盘焦点进入 dialog，在其中按合理顺序移动，关闭后返回触发点。视觉上的 z-index 只是其中一小部分。
</MentalModel>

<Timeline steps={[
  "用户激活触发按钮，记录触发元素",
  "dialog 打开并获得可理解的名称/描述",
  "焦点移动到 dialog 内合理起点",
  "Tab/Shift+Tab 保持在 modal 交互范围；Escape 按产品协议关闭",
  "关闭后焦点回到触发元素或下一个合理位置"
]} />

<Experiment title="用键盘验证完整焦点生命周期">
从触发按钮打开中间 Demo 的 modal，不使用鼠标连续按 Tab/Shift+Tab，再按 Escape。观察焦点是否逃到背景、关闭后是否回到触发按钮，以及标题是否为 dialog 提供可访问名称。
</Experiment>

<DemoReference action="打开 modal → 键盘遍历 → Escape 关闭" observe="焦点应进入并受控于 dialog，关闭后恢复到合理触发位置。" />

<Observation>
Portal 只改变 DOM 挂载位置，不会自动实现 modal 语义、focus trap、背景 inert、滚动锁定或 focus restoration。React \`createPortal\` 也不会替你完成这些可访问性协议。
</Observation>

<Compare>
### 原生 \`<dialog>\`
浏览器提供 dialog/top-layer 等基础能力，\`showModal()\` 具有 modal 语义；仍需验证产品需要的 focus/close 行为与浏览器支持。

### 自定义 dialog
需要严格实现 ARIA Dialog Pattern，包括 role/name、焦点进入/循环/恢复和背景交互约束。
</Compare>

<AntiPattern title="打开后只 autofocus 第一个 input">
这并不能构成完整 focus management。复杂 dialog 的合理初始焦点可能是标题、说明区域或最安全操作；关闭时还必须恢复焦点，并处理触发元素已消失等边界。
</AntiPattern>

<Boundary title="不要轻易手写通用 Focus Trap">
焦点管理涉及动态内容、嵌套 overlay、Shadow DOM、禁用元素等大量边界。生产组件库应优先采用经过可访问性验证的 dialog primitive，并对真实业务流程做键盘/屏幕阅读器测试。
</Boundary>

<Summary>
- Modal 是语义 + 焦点 + 背景交互的完整边界。
- Portal 不等于 accessible modal。
- 验证必须覆盖打开、Tab 循环、Escape、关闭后的焦点恢复。
- 复杂生产场景优先使用成熟可访问 primitive。
</Summary>

<FurtherReading items={[
  { label: "WAI-ARIA APG: Modal Dialog", href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" },
  { label: "MDN: dialog", href: "https://developer.mozilla.org/docs/Web/HTML/Element/dialog" },
  { label: "React: createPortal", href: "https://react.dev/reference/react-dom/createPortal" }
]} />`;export{e as default};