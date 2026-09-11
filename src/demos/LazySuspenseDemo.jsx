import { lazy, Suspense, useState } from "react";

const LazyLessonPanel = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return import("../components/LazyLessonPanel.jsx");
});

export function LazySuspenseDemo() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📦</span> lazy + Suspense：代码什么时候真的加载？</h2>
          </div>
          <span className="badge badge-blue">Code Splitting</span>
        </div>
        <p className="demo-desc">
          <code>lazy(load)</code> 把组件代码的加载推迟到第一次渲染它；加载 Promise pending 时，最近的 Suspense boundary 显示 fallback。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 首次加载实验</h3>
          <p className="demo-section-desc">点击后观察 fallback → lazy module ready。再次隐藏再显示时，loader 结果已缓存，不会重复等待同一模块。</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShow((value) => !value)}>
          {show ? "隐藏 lazy 组件" : "显示 lazy 组件"}
        </button>
        <div style={{ marginTop: 16 }}>
          <Suspense fallback={<div className="demo-alert">⏳ 正在加载独立 chunk…</div>}>
            {show && <LazyLessonPanel />}
          </Suspense>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">正确边界</div>
          <p>适合路由级页面、重型编辑器、图表面板等“不是首屏立刻需要”的代码。Suspense 管的是这棵子树的等待 UI。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">反模式</div>
          <p>不要在组件内部每次 render 都重新声明 <code>lazy()</code>；这会创建新的组件类型并可能导致 State 被重置。</p>
        </div>
      </div>
    </div>
  );
}

export default LazySuspenseDemo;
