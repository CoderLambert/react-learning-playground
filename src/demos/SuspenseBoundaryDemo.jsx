import { Suspense, use, useState } from "react";

const promiseCache = new Map();

function readDemoPromise(key, delay, value) {
  if (!promiseCache.has(key)) {
    promiseCache.set(
      key,
      new Promise((resolve) => {
        setTimeout(() => resolve(value), delay);
      }),
    );
  }
  return promiseCache.get(key);
}

function Profile({ version }) {
  const profile = use(readDemoPromise(`profile-${version}`, 700, { name: "Ada", role: "Frontend Engineer" }));
  return (
    <div className="demo-alert demo-alert-tip">
      <strong>{profile.name}</strong> · {profile.role}
    </div>
  );
}

function Activity({ version }) {
  const items = use(readDemoPromise(`activity-${version}`, 1500, ["提交 PR", "修复 hydration bug", "补充测试"]));
  return (
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export function SuspenseBoundaryDemo() {
  const [version, setVersion] = useState(1);
  const [nested, setNested] = useState(true);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧱</span> Suspense Boundary：等待边界决定 loading UX</h2>
          </div>
          <span className="badge badge-blue">Boundary</span>
        </div>
        <p className="demo-desc">
          Suspense 不是“给任意 fetch 一个 loading”。它只响应会 suspend 的数据源或代码加载；离 suspend 点最近的 boundary 决定显示哪块 fallback。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 单层 vs Nested Suspense</h3>
          <p className="demo-section-desc">重新加载后，Profile 约 0.7s 完成，Activity 约 1.5s 完成。切换 nested 模式观察 reveal 顺序。</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <button type="button" className="btn btn-primary" onClick={() => setVersion((value) => value + 1)}>重新加载</button>
          <button type="button" className="btn" onClick={() => setNested((value) => !value)}>
            {nested ? "改为单一 Boundary" : "改为 Nested Boundary"}
          </button>
        </div>

        <Suspense fallback={<div className="demo-alert">⏳ 外层 fallback：等待关键内容…</div>}>
          <Profile version={version} />
          <div style={{ marginTop: 12 }}>
            {nested ? (
              <Suspense fallback={<div className="demo-alert">⏳ 内层 fallback：Activity 仍在加载…</div>}>
                <Activity version={version} />
              </Suspense>
            ) : (
              <Activity version={version} />
            )}
          </div>
        </Suspense>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">Nested boundary</div>
          <p>允许已经准备好的上层内容先显示，再独立等待慢子树。Boundary 应贴合设计中的 loading sequence。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">边界不是越多越好</div>
          <p>每个小节点都包 Suspense 会制造闪烁与碎片化 UX。优先让产品设计决定哪些区域应该一起 reveal。</p>
        </div>
      </div>
    </div>
  );
}

export default SuspenseBoundaryDemo;
