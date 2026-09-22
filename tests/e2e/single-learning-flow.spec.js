import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

async function openComponentPureRender(page) {
  await loadApp(page);
  await openDemo(page, "Component、JSX 与纯渲染");
  return page.locator("[data-learning-flow='single']");
}

async function openImmutableState(page) {
  await loadApp(page);
  await openDemo(page, "对象 / 数组 State 不可变更新");
  return page.locator("[data-learning-flow='single']");
}

async function openStateDry(page) {
  await loadApp(page);
  await openDemo(page, "State 结构设计与单一数据源");
  return page.locator("[data-learning-flow='single']");
}

async function openUseRef(page) {
  await loadApp(page);
  await openDemo(page, "useRef 引用与 DOM 控制");
  return page.locator("[data-learning-flow='single']");
}

async function openUseEffect(page) {
  await loadApp(page);
  await openDemo(page, "useEffect 正确用法与心智");
  return page.locator("[data-learning-flow='single']");
}

async function openListsAndKey(page) {
  await loadApp(page);
  await openDemo(page, "列表渲染与 key 身份");
  return page.locator("[data-learning-flow='single']");
}

async function openStateSnapshot(page) {
  await loadApp(page);
  await openDemo(page, "State Snapshot、Batching 与 Update Queue");
  return page.locator("[data-learning-flow='single']");
}

async function openNotNeedEffect(page) {
  await loadApp(page);
  await openDemo(page, "无需 Effect 的常见反模式");
  return page.locator("[data-learning-flow='single']");
}

async function openPreserveReset(page) {
  await loadApp(page);
  await openDemo(page, "State 保留、重置与 key 身份");
  return page.locator("[data-learning-flow='single']");
}

async function openEffectLifecycle(page) {
  await loadApp(page);
  await openDemo(page, "响应式 Effect 生命周期与依赖");
  return page.locator("[data-learning-flow='single']");
}

test("Batch A Component pure render completes the VNext code-transfer journey", async ({ page }) => {
  const flow = await openComponentPureRender(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "component-jsx-pure-render");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Inputs → Component Function → JSX Description → Commit");
  const evidence = flow.locator("[data-learning-code-evidence-item='pure-vs-impure-calculation']");
  await expect(evidence).toContainText("function buildPureDescription");
  await expect(evidence.locator("[data-code-highlighted='true']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await page.getByRole("button", { name: "开始实践" }).click();
  await page.getByRole("radio", { name: "相同输入得到相同结果" }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill(
    "纯 render 的输出只由当前输入决定；修改模块级变量会让相同输入依赖执行次数。",
  );
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();

  const practice = page.locator("[data-guided-practice-kind='patch-choice']");
  await expect(practice.locator("[data-guided-practice-code-context] [data-code-highlighted='true']")).toBeVisible();
  await practice.locator("input[value='remove-external-sequence']").check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-practice-outcome='correct']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /相同的 UI 描述/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /返回 React 元素描述/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  const transferCode = page.locator("[data-assessment-code-context]");
  await expect(transferCode).toContainText("visits += 1");
  await expect(transferCode.locator("[data-code-highlighted='true']")).toBeVisible();
  await page.getByRole("radio", { name: /visits \+= 1 修改了/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /本次 render 内新建/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /render 先计算元素描述/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("本节验证完成", { exact: true })).toBeVisible();
});

test("Batch B Immutable State completes source-to-patch-to-transfer verification", async ({ page }) => {
  const flow = await openImmutableState(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "immutable-state");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Read current snapshot → Copy changed path → Submit next value");
  const evidence = flow.locator("[data-learning-code-evidence-item='same-reference-vs-copy']");
  await expect(evidence).toContainText("mutationProbe.city");
  await expect(evidence.locator("[data-code-highlighted='true']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await page.getByRole("button", { name: "开始实践" }).click();
  await page.getByRole("radio", { name: /React 可能跳过这次更新/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill(
    "数组 spread 只复制容器；元素对象仍共享引用，所以修改元素会污染旧 snapshot。",
  );
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();

  const practice = page.locator("[data-guided-practice-kind='patch-choice']");
  await expect(practice.locator("[data-guided-practice-code-context]")).toContainText("next[0].done");
  await expect(practice.locator("[data-guided-practice-code-context] [data-code-highlighted='true']")).toBeVisible();
  await practice.locator("input[value='map-copy-item']").check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-practice-outcome='correct']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /把当前值当只读 snapshot/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /true；数组被复制了/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  const transfer = page.locator("[data-assessment-code-context]");
  await expect(transfer).toContainText("next[0].done");
  await expect(transfer.locator("[data-code-highlighted='true']")).toBeVisible();
  await page.getByRole("radio", { name: /next 是新数组/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /变化节点到顶层的每一层/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /旧 State 对象本身已经被改写/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("本节验证完成", { exact: true })).toBeVisible();
});

test("Batch C State Dry completes source-to-patch-to-transfer verification", async ({ page }) => {
  const flow = await openStateDry(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "state-dry");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Independent facts → Derive the rest → Smaller valid state space");
  const evidence = flow.locator("[data-learning-code-evidence-item='derived-vs-stored-name']");
  await expect(evidence).toContainText("derivedFullName");
  await expect(evidence.locator("[data-code-highlighted='true']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await page.getByRole("button", { name: "开始实践" }).click();
  await page.getByRole("radio", { name: /storedFullName 可以过期/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill(
    "State 应只保存独立事实。fullName 能由 firstName 和 lastName 派生，额外副本会制造需要同步的不变量。",
  );
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();

  const practice = page.locator("[data-guided-practice-kind='patch-choice']");
  const practiceCode = practice.locator("[data-guided-practice-code-context]");
  await expect(practiceCode).toContainText("setFullName");
  await expect(practiceCode.locator("[data-code-highlighted='true']")).toBeVisible();
  await practice.locator("input[value='derive-in-render']").check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-practice-outcome='correct']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /在 render 中直接派生 fullName/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /status 只枚举合法阶段/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /selectedId 是独立选择事实/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  const transfer = page.locator("[data-assessment-code-context]");
  await expect(transfer).toContainText("setTotal");
  await expect(transfer.locator("[data-code-highlighted='true']")).toBeVisible();
  await page.getByRole("radio", { name: /移除 total State/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /保存无法从其他当前输入完整推出的独立事实/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("本节验证完成", { exact: true })).toBeVisible();
});

test("Batch D useRef completes State-vs-Ref code transfer", async ({ page }) => {
  const flow = await openUseRef(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "use-ref");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Visible UI fact → State / Silent mutable handle → Ref / DOM node → Commit");
  const evidence = flow.locator("[data-learning-code-evidence-item='dom-ref-event-access']");
  await expect(evidence).toContainText("inputRef.current?.focus()");
  await expect(evidence.locator("[data-code-highlighted='true']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await page.getByRole("button", { name: "开始实践" }).click();
  await page.getByRole("radio", { name: /不会；写 ref\.current 不会请求 React 重新 render/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill(
    "State 是 JSX 的声明式输入；Ref 可以跨 render 保留句柄，但写 current 本身不会请求重新 render。",
  );
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();

  const practice = page.locator("[data-guided-practice-kind='patch-choice']");
  const practiceCode = practice.locator("[data-guided-practice-code-context]");
  await expect(practiceCode).toContainText("countRef.current += 1");
  await expect(practiceCode.locator("[data-code-highlighted='true']")).toBeVisible();
  await practice.locator("input[value='visible-count-state']").check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-practice-outcome='correct']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /State，因为更新需要请求新的 render/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /不会；写 ref\.current 本身不进入 React render 调度/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /DOM ref 在对应节点 commit 后才可靠指向真实 DOM/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  const transfer = page.locator("[data-assessment-code-context]");
  await expect(transfer).toContainText("countRef.current += 1");
  await expect(transfer.locator("[data-code-highlighted='true']")).toBeVisible();
  await page.getByRole("radio", { name: /可见 count 应由 State 驱动/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /interval handle 放 Ref；seconds 和 running 放 State/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("本节验证完成", { exact: true })).toBeVisible();
});

test("Batch D useEffect completes external-sync source-to-patch-to-transfer verification", async ({ page }) => {
  const flow = await openUseEffect(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "use-effect-correct-usage");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Commit → Effect setup → External system / Cleanup reverses old setup");
  const evidence = flow.locator("[data-learning-code-evidence-item='resize-subscription-cleanup']");
  await expect(evidence).toContainText("removeEventListener");
  await expect(evidence.locator("[data-code-highlighted='true']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await page.getByRole("button", { name: "开始实践" }).click();
  await page.getByRole("radio", { name: /cleanup 移除 setup 注册的同一个 listener/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill(
    "Effect 维护 React 与外部系统的同步。订阅 setup 注册什么，cleanup 就撤销同一外部关系；用户点击直接导致的命令留在 handler。",
  );
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();

  const practice = page.locator("[data-guided-practice-kind='patch-choice']");
  const practiceCode = practice.locator("[data-guided-practice-code-context]");
  await expect(practiceCode).toContainText('addEventListener("online"');
  await expect(practiceCode.locator("[data-code-highlighted='true']")).toBeVisible();
  await practice.locator("input[value='return-remove-same-handler']").check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-practice-outcome='correct']")).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /需要把当前 committed React 状态与 React 外部系统保持同步/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: "window.removeEventListener('resize', handleResize)", exact: true }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /Effect 用它决定当前外部 title 应是什么/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  const transfer = page.locator("[data-assessment-code-context]");
  await expect(transfer).toContainText("postPurchase(productId)");
  await expect(transfer.locator("[data-code-highlighted='true']")).toBeVisible();
  await page.getByRole("radio", { name: /组件存在期间订阅浏览器 online\/offline/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /cleanup 的职责是撤销 setup 建立的外部关系/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("本节验证完成", { exact: true })).toBeVisible();
});

test("Lists and Key exposes one deep Understand Practice Verify journey instead of parallel learning modes", async ({ page }) => {
  const flow = await openListsAndKey(page);

  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("key → Component Identity → State preservation");
  await expect(flow).toContainText("先把这些对象分开，再讨论 key");
  await expect(flow).toContainText("Local State");
  await expect(flow).toContainText("DOM");
  await expect(flow).toContainText("index key + reorder");
  await expect(flow).toContainText("stable id + reorder");
  await expect(flow).toContainText("切换 index key ↔ stable id");
  await expect(flow).toContainText("错的不是“DOM 完全没更新”");
  await expect(flow.locator("[data-learning-code-evidence-item='row-local-state']")).toContainText("useState");
  await expect(flow.locator("[data-learning-code-evidence-item='row-local-state'] [data-code-highlighted='true']")).toBeVisible();
  await expect(flow.locator("[data-learning-code-evidence-item='list-key-selection']")).toContainText("key={useIndexKey ? index : task.id}");
  await expect(page.getByRole("tab", { name: "源码", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "AI", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "笔记", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "评测", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "官方文档", exact: true })).toHaveCount(0);

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "practice");
  await expect(page.getByRole("heading", { name: "实践", exact: true })).toBeVisible();
  await expect(page.getByText("Guided Learning", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "开始实践" })).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "verify");
  await expect(page.getByRole("heading", { name: "准备好检查理解了吗？" })).toBeVisible();
  await expect(page.getByRole("button", { name: "开始测试" })).toBeVisible();
  await expect(page.getByRole("button", { name: /让 AI/ })).toHaveCount(0);
});

test("diagnostic verification turns a known wrong model into counter-evidence before the full answer", async ({ page }) => {
  const flow = await openListsAndKey(page);
  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();

  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /给同级元素提供稳定身份线索/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect(page.getByText("回答正确", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /下一题/ }).click();

  await expect(page.getByText(/AAA 还在第一行/)).toBeVisible();
  await page.getByRole("radio", { name: /DOM 没有更新/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  const remediation = page.locator("[data-assessment-misconception='dom-not-updated']");
  await expect(page.getByText("再想一想", { exact: true })).toBeVisible();
  await expect(remediation).toBeVisible();
  await expect(remediation).toContainText("把“组件身份复用”理解成“DOM 没更新”");
  await expect(remediation).toContainText("反证线索");
  await expect(remediation).toContainText("先做这个实验");
  await expect(remediation).toContainText("第一行输入 AAA → 反转顺序");
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);
  await expect(remediation.getByText(/reorder 后 task Props 会正常更新/)).toBeHidden();
  await expect(remediation.getByText("实验后再看完整解释")).toBeVisible();

  await page.getByRole("button", { name: "重新选择" }).click();
  await expect(page.getByText("重新判断一次", { exact: true })).toBeVisible();
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);

  await page.getByRole("radio", { name: /AAA 存在 input DOM 节点内部/ }).check();
  await page.getByRole("button", { name: "再次验证" }).click();

  const secondRemediation = page.locator("[data-assessment-misconception='state-lives-in-dom']");
  await expect(secondRemediation).toBeVisible();
  await expect(secondRemediation).toContainText("把局部 State 当成 DOM 节点保存的数据");

  await page.getByRole("button", { name: "重新选择" }).click();
  await page.getByRole("radio", { name: /同一个 index 让原组件身份按位置延续/ }).check();
  await page.getByRole("button", { name: "再次验证" }).click();

  await expect(page.getByText("已纠正", { exact: true })).toBeVisible();
  await expect(page.locator("[data-assessment-correction='corrected']")).toBeVisible();
  await expect(page.getByText(/第一次错误仍保留在复习记录中/)).toBeVisible();

  const teachBack = page.getByLabel("用自己的话再解释一次");
  await expect(teachBack).toBeVisible();
  await expect(page.getByRole("button", { name: "让 AI 检查这段解释" })).toBeDisabled();

  const explanation = "index key 让组件身份按位置延续，所以 task Props 会更新，但 note State 仍留在原身份；stable id 才能让 State 跟着业务实体移动。";
  await teachBack.fill(explanation);
  await expect(page.getByText(/已写下解释/)).toBeVisible();

  await page.getByRole("button", { name: "让 AI 检查这段解释" }).click();
  await expect(page.getByRole("tab", { name: "AI", exact: true })).toHaveAttribute("aria-selected", "true");
  const aiComposer = page.getByLabel("向 AI 助手提问");
  await expect(aiComposer).toHaveValue(new RegExp("assessment-correction:canonical-rendering-lists-key-reorder"));
  await expect(aiComposer).toHaveValue(new RegExp("index key 让组件身份按位置延续"));
  await expect(aiComposer).toHaveValue(/结论：核心目标已成立/);
  await expect(aiComposer).toHaveValue(/stable key 是同级元素的稳定身份线索/);
  await expect(aiComposer).toHaveValue(/可选进阶：/);
  await expect(page.getByText(/不改变本轮分数/)).toBeVisible();

  await page.getByRole("button", { name: "关闭学习面板" }).last().click();

  await page.getByRole("button", { name: "查看依据 2" }).click();
  await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".source-viewer--inspector")).toHaveAttribute("data-source-focus", "22-33");

  await page.getByRole("button", { name: "关闭学习面板" }).last().click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await expect(page.locator("[data-assessment-code-context]")).toContainText("function TodoList");
  await expect(page.locator("[data-assessment-code-context] [data-code-highlighted='true']")).toBeVisible();
  await expect(page.locator("[data-assessment-code-context]")).toContainText("<TodoRow key={index}");
  await page.getByRole("radio", { name: /数据模型中创建后保持稳定的 todo.id/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /相同 task.id 让 React 在新位置认出同一个组件身份/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /显式 key 从 0 变成 task-a/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("需要复习", { exact: true })).toBeVisible();
  await expect(flow).toContainText("最近一次已完成评测有 1 道错误");
  await expect(page.getByText(/mastery/i)).toHaveCount(0);
});

test("State Snapshot reuses the diagnostic loop for queue reasoning and preserves the first formal error", async ({ page }) => {
  const flow = await openStateSnapshot(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "state-snapshot-queue");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Render Snapshot → Update Queue → Next Render State");
  await expect(flow).toContainText("先区分当前快照、更新请求和下一次 render");
  await expect(flow).toContainText("Replace × 3");
  await expect(flow).toContainText("Updater × 3");
  await expect(flow).toContainText("Replace + Updater + Replace 42");
  await expect(flow.locator("[data-learning-code-evidence-item='replace-updates']")).toContainText("setCount(snapshot + 1)");
  await expect(flow.locator("[data-learning-code-evidence-item='replace-updates'] [data-code-highlighted='true']")).toBeVisible();
  await expect(flow.locator("[data-learning-code-evidence-item='functional-updaters']")).toContainText("setCount((value) => value + 1)");

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "practice");
  await expect(page.getByRole("button", { name: "开始实践" })).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await page.getByRole("button", { name: "开始测试" }).click();

  await expect(page.locator("[data-assessment-code-context]")).toContainText("function handleAdd");
  await expect(page.locator("[data-assessment-code-context] [data-code-highlighted='true']")).toBeVisible();
  await expect(page.locator("[data-assessment-code-context]")).toContainText("track(quantity)");
  await page.getByRole("radio", { name: /setQuantity 会先把当前变量 quantity 直接改成 1/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  const remediation = page.locator("[data-assessment-misconception='setter-mutates-snapshot']");
  await expect(remediation).toBeVisible();
  await expect(remediation).toContainText("setter 会立即修改当前 render 里的 State 变量");
  await expect(remediation).toContainText("handler snapshot");
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "重新选择" }).click();
  await page.getByRole("radio", { name: /track 仍读取这次 render 的 quantity = 0/ }).check();
  await page.getByRole("button", { name: "再次验证" }).click();

  await expect(page.getByText("已纠正", { exact: true })).toBeVisible();
  const teachBack = page.getByLabel("用自己的话再解释一次");
  await expect(teachBack).toBeVisible();
  await teachBack.fill("setter 不会改写当前 render 的 count snapshot；它把更新请求加入队列，React 处理完后下一次 render 才拿到新的 State。");

  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /三次表达式都读取同一个 count = 0 snapshot/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /每个 updater 在 queue processing 时接收前一项 pending State/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /queue 先把 pending 替换成 5/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /React 依次处理前面的 replace 和 updater/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("需要复习", { exact: true })).toBeVisible();
  await expect(flow).toContainText("最近一次已完成评测有 1 道错误");
});


test("You Might Not Need an Effect uses causal-source diagnostics and preserves correction evidence", async ({ page }) => {
  const flow = await openNotNeedEffect(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "not-need-effect");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Why it runs → Where it belongs");
  await expect(flow).toContainText("先问“为什么它需要运行”，再决定放在哪里");
  await expect(flow).toContainText("Render Derivation");
  await expect(flow).toContainText("Event-caused Logic");
  await expect(flow).toContainText("External Synchronization");
  await expect(flow).toContainText("过滤列表：render vs Effect + duplicate State");
  await expect(flow).toContainText("购买 POST / 埋点：Event Handler vs Effect watching State");
  await expect(flow).toContainText("window.resize / subscription：真正的 Effect");
  await expect(flow).toContainText("userId 切换：key reset vs Effect setState reset");

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "practice");
  await expect(page.getByRole("button", { name: "开始实践" })).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: "直接在当前 render 中根据最新 props/state 派生 filteredProducts" }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /先只更新 purchasedCount，再用 Effect 监听/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  const remediation = page.locator("[data-assessment-misconception='state-change-needs-effect']");
  await expect(remediation).toBeVisible();
  await expect(remediation).toContainText("某个 State 变化后要做事");
  await expect(remediation).toContainText("productName");
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "重新选择" }).click();
  await page.getByRole("radio", { name: /在购买按钮的 Event Handler 中直接发送请求/ }).check();
  await page.getByRole("button", { name: "再次验证" }).click();

  await expect(page.getByText("已纠正", { exact: true })).toBeVisible();
  const teachBack = page.getByLabel("用自己的话再解释一次");
  await expect(teachBack).toBeVisible();
  await teachBack.fill("购买逻辑运行是因为这次明确点击，所以应该留在 handler；Effect 用来维持组件与 React 外部系统的同步，不是监听 purchasedCount 来反推购买事件。");

  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: "因为组件生命周期内需要与 React 外部的浏览器事件系统建立 setup/cleanup 同步关系" }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /仍属于 render 数据流；先测量/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /业务身份变化就应该创建新的 CommentForm 身份/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("需要复习", { exact: true })).toBeVisible();
  await expect(flow).toContainText("最近一次已完成评测有 1 道错误");
});

test("Guided Needs Review projects to the lesson level and survives reload", async ({ page }) => {
  let flow = await openStateSnapshot(page);

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await page.getByRole("button", { name: "开始实践" }).click();

  await page.getByRole("radio", { name: "1" }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill(
    "setter 不会改写当前 render snapshot；更新请求会进入 queue。",
  );
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();
  await expect(page.locator("[data-guided-practice-code-context] [data-code-highlighted='true']")).toBeVisible();
  await expect(page.locator("[data-guided-practice-kind='patch-choice'] .guided-flow-practice-option-content > .guided-flow-patch[data-code-highlighted='true']")).toHaveCount(3);
  await page.locator("[data-guided-practice-kind='patch-choice'] input[value='functional-updaters']").check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();

  await page.getByRole("button", { name: "标记为需要复习" }).click();

  const reviewSignal = flow.locator(".single-learning-flow__review-signal");
  await expect(reviewSignal).toBeVisible();
  await expect(reviewSignal).toHaveAttribute("data-learning-review-assessment-errors", "0");
  await expect(reviewSignal).toHaveAttribute("data-learning-review-guided", "true");
  await expect(reviewSignal).toContainText("你在实践回顾中标记了需要复习");

  await page.getByRole("button", { name: "进入验证" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "verify");
  await expect(reviewSignal).toBeVisible();

  await page.reload();
  flow = page.locator("[data-learning-flow='single']");
  await expect(flow).toBeVisible();
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  const restoredSignal = flow.locator(".single-learning-flow__review-signal");
  await expect(restoredSignal).toBeVisible();
  await expect(restoredSignal).toHaveAttribute("data-learning-review-guided", "true");

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await page.getByRole("button", { name: "继续实践" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "review");
  await page.getByRole("button", { name: "取消需要复习" }).click();
  await expect(flow.locator(".single-learning-flow__review-signal")).toHaveCount(0);
});

test("Preserving / Resetting State diagnoses identity preservation before reset-boundary decisions", async ({ page }) => {
  const flow = await openPreserveReset(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "preserving-resetting-state");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Identity match → Preserve State / New identity → Reset State");
  await expect(flow).toContainText("Parent / tree slot");
  await expect(flow).toContainText("同位置 + 同类型 + 无 key 变化");
  await expect(flow).toContainText("同位置 + 同类型 + key={contact.id}");
  await expect(flow).toContainText("只 reset 真正属于新实体的子树");
  await expect(flow).toContainText("随机 / 不稳定 key");
  await expect(flow.locator("[data-learning-code-evidence-item='chat-local-draft']")).toContainText("useState");
  await expect(flow.locator("[data-learning-code-evidence-item='chat-local-draft'] [data-code-highlighted='true']")).toBeVisible();
  await expect(flow.locator("[data-learning-code-evidence-item='same-position-vs-keyed-chat']")).toContainText("key={resetContact.id}");

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "practice");
  await expect(page.getByRole("button", { name: "开始实践" })).toBeVisible();
  await expect(page.getByText("Guided Learning", { exact: true })).toHaveCount(0);

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "verify");
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /contact prop 已变化，React 应自动创建新的 Chat State/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  const remediation = page.locator("[data-assessment-misconception='props-reset-state']");
  await expect(remediation).toBeVisible();
  await expect(remediation).toContainText("Props 变化会自动重置子组件的局部 State");
  await expect(remediation).toContainText("Taylor");
  await expect(remediation).toContainText("Alice");
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "重新选择" }).click();
  await page.getByRole("radio", { name: /父级同一位置仍渲染同一个 Chat 类型/ }).check();
  await page.getByRole("button", { name: "再次验证" }).click();

  await expect(page.getByText("已纠正", { exact: true })).toBeVisible();
  const teachBack = page.getByLabel("用自己的话再解释一次");
  await teachBack.fill("contact Props 可以更新，但同一位置、类型和 key 仍匹配时 Chat identity 被保留，所以 draft State 也继续属于这个 identity。");

  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /key 从 taylor 变为 alice/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  const preserveTransfer = page.locator("[data-assessment-code-context]");
  await expect(preserveTransfer).toContainText("InvoiceEditor customer={customer}");
  await expect(preserveTransfer.locator("[data-code-highlighted='true']")).toBeVisible();
  await page.getByRole("radio", { name: /保留 WorkspaceShell identity，只给 InvoiceEditor/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /key 仍是 alice/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /需要把草稿 State 提升或按 contact.id 存储/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("需要复习", { exact: true })).toBeVisible();
  await expect(flow).toContainText("最近一次已完成评测有 1 道错误");
});

test("Effect Lifecycle diagnoses synchronization order and dependency boundaries", async ({ page }) => {
  const flow = await openEffectLifecycle(page);

  await expect(flow).toHaveAttribute("data-learning-unit", "lifecycle-of-reactive-effects");
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("Render → Commit → Cleanup(old) → Setup(new)");
  await expect(flow).toContainText("Synchronization Target");
  await expect(flow).toContainText("roomId 改变：同步目标真的变了");
  await expect(flow).toContainText("isMuted 改变：行为变了，同步目标没变");
  await expect(flow).toContainText("messages 更新：State 变了，但不需要重连");
  await expect(flow).toContainText("Strict Mode：开发期额外 setup / cleanup");

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "practice");
  await expect(page.getByRole("button", { name: "开始实践" })).toBeVisible();
  await expect(page.getByText("Guided Learning", { exact: true })).toHaveCount(0);

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "verify");
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /先 setup #102/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  const remediation = page.locator("[data-assessment-misconception='setup-before-old-cleanup']");
  await expect(remediation).toBeVisible();
  await expect(remediation).toContainText("先 setup 新同步，再 cleanup 旧同步");
  await expect(remediation).toContainText("cleanup");
  await expect(remediation).toContainText("setup");
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "重新选择" }).click();
  await page.getByRole("radio", { name: /更新触发新 render，commit 后先 cleanup #101/ }).check();
  await page.getByRole("button", { name: "再次验证" }).click();

  await expect(page.getByText("已纠正", { exact: true })).toBeVisible();
  const teachBack = page.getByLabel("用自己的话再解释一次");
  await teachBack.fill("roomId 更新先产生新的 render 和 commit，然后旧连接 cleanup，最后用新的 committed roomId setup 下一轮同步。");

  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /isMuted 只影响收到消息后的通知行为/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /基于上一份 messages 计算下一份 messages/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /不能靠删 roomId 优化/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /Strict Mode 的开发期压力测试/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("需要复习", { exact: true })).toBeVisible();
  await expect(flow).toContainText("最近一次已完成评测有 1 道错误");
});

test("official deep reading returns to the current Understand stage", async ({ page }) => {
  const flow = await openListsAndKey(page);

  await page.getByRole("button", { name: "React 官方解释" }).click();
  await expect(page.locator(".official-docs-pane")).toBeVisible();
  await expect(page.locator(".official-docs-frame")).toHaveAttribute(
    "src",
    /rendering-lists#keeping-list-items-in-order-with-key$/,
  );

  await page.getByRole("button", { name: "返回实验" }).click();
  await expect(flow).toBeVisible();
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
});
// @browser-owner workbench
