import { useState } from "react";

const LEVELS = [
  {
    id: "unit",
    title: "Vitest · Fast feedback",
    focus: "纯函数、Reducer、Hook 和可在测试环境中确定复现的逻辑",
    rule: "Vitest 是测试运行器，不等于只做 unit test；这里把它放在快速逻辑反馈层。",
  },
  {
    id: "integration",
    title: "React Testing Library · User-observable UI",
    focus: "用户如何看到、点击、输入，以及异步 UI 如何变化",
    rule: "Testing Library 不是固定的“integration test 层级”；核心原则是按用户可观察行为查询和断言 UI。",
  },
  {
    id: "e2e",
    title: "Playwright · Real browser E2E",
    focus: "真实浏览器中的关键业务路径、路由、网络、焦点与浏览器行为",
    rule: "把跨系统关键路径放进 E2E，不把所有组件细节都塞进浏览器测试。",
  },
];

export function TestingStrategyDemo() {
  const [active, setActive] = useState("integration");
  const [status, setStatus] = useState("idle");
  const selected = LEVELS.find((item) => item.id === active);

  async function simulateUserFlow() {
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 550));
    setStatus("success");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🧪</span> Testing：测试行为，而不是实现细节</h2><span className="badge badge-blue">Chapter 11</span></div>
        <p className="demo-desc">按反馈速度和系统边界组织测试组合：Vitest 提供测试运行环境，Testing Library 强调用户可观察 UI，Playwright 在真实浏览器覆盖关键端到端路径。工具与“unit / integration / E2E”并不是严格一一对应。</p>
      </div>
      <div className="demo-section">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{LEVELS.map((item) => <button key={item.id} className="btn" aria-pressed={active === item.id} onClick={() => setActive(item.id)}>{item.title}</button>)}</div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><strong>{selected.title}</strong><p>{selected.focus}</p><p>{selected.rule}</p></div>
      </div>
      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 异步 UI 的用户视角</h3></div>
        <button className="btn btn-primary" disabled={status === "loading"} onClick={simulateUserFlow}>{status === "loading" ? "保存中…" : "保存资料"}</button>
        {status === "success" && <p role="status">保存成功</p>}
        <p className="demo-section-desc">RTL 应模拟点击并等待“保存成功”出现在可访问 UI 中，而不是断言内部 setState 调用了几次。</p>
      </div>
      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><strong>User-centric query</strong><p>优先 getByRole（通常结合 accessible name），表单控件可使用 getByLabelText；只有确实缺少合适语义查询时再退回 text/testid 等选择方式。</p></div>
        <div className="demo-alert demo-alert-warning"><strong>Mock 边界</strong><p>Mock 不稳定或昂贵的系统边界，例如网络、时间、第三方 SDK；不要 mock 掉被测组件真正需要协作的每一层，否则测试只证明 mock 自己。</p></div>
      </div>
      <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><strong>反模式：</strong>通过 CSS class、组件实例、私有 State 或实现函数调用次数断言业务行为。重构实现而用户行为不变时，这类测试会产生无意义失败。</div>
    </div>
  );
}

export default TestingStrategyDemo;
