import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

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
  await expect(page.getByText(/不改变本轮分数/)).toBeVisible();

  await page.getByRole("button", { name: "关闭学习面板" }).last().click();

  await page.getByRole("button", { name: "查看依据 2" }).click();
  await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".source-viewer--inspector")).toHaveAttribute("data-source-focus", "22-33");

  await page.getByRole("button", { name: "关闭学习面板" }).last().click();
  await page.getByRole("button", { name: /下一题/ }).click();

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

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "practice");
  await expect(page.getByRole("button", { name: "开始实践" })).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /setCount 会先把当前变量 count 直接改成 1/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  const remediation = page.locator("[data-assessment-misconception='setter-mutates-snapshot']");
  await expect(remediation).toBeVisible();
  await expect(remediation).toContainText("setter 会立即修改当前 render 里的 State 变量");
  await expect(remediation).toContainText("handler snapshot");
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "重新选择" }).click();
  await page.getByRole("radio", { name: /当前 handler 仍读取这次 render 的 count = 0/ }).check();
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
