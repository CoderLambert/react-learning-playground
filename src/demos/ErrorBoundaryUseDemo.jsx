import { Component, Suspense, use, useState } from "react";

function createMessagePromise(mode, attempt) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === "error") {
        reject(new Error(`模拟服务失败（attempt ${attempt}）`));
      } else {
        resolve(`Promise 已成功解析（attempt ${attempt}）`);
      }
    }, 900);
  });
}

class DemoErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">Error Boundary fallback</div>
          <p>{this.state.error.message}</p>
          <p>Render / lazy / use(Promise) 抛出的错误可以由最近的 Error Boundary 隔离。</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function PromiseReader({ resource }) {
  const message = use(resource);
  return <div className="demo-alert demo-alert-tip">✅ {message}</div>;
}

export function ErrorBoundaryUseDemo() {
  const [attempt, setAttempt] = useState(1);
  const [mode, setMode] = useState("success");
  const [resource, setResource] = useState(() => createMessagePromise("success", 1));

  function retry(nextMode) {
    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);
    setMode(nextMode);
    setResource(createMessagePromise(nextMode, nextAttempt));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧯</span> Error Boundary + React 19 use：pending 与 rejected Promise 去哪里？</h2>
          </div>
          <span className="badge badge-blue">React 19</span>
        </div>
        <p className="demo-desc">
          <code>use(promise)</code> 在 render 中读取资源：pending 时交给 Suspense，rejected 时错误继续传播给最近的 Error Boundary。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> Promise 状态路由实验</h3>
          <p className="demo-section-desc">每次点击都在事件阶段创建新的稳定 Promise，并把 Promise 本身存进 State；render 只负责用 <code>use</code> 读取它。</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <button type="button" className="btn btn-primary" onClick={() => retry("success")}>加载成功资源</button>
          <button type="button" className="btn" onClick={() => retry("error")}>加载失败资源</button>
        </div>

        <DemoErrorBoundary key={`${mode}-${attempt}`}>
          <Suspense fallback={<div className="demo-alert">⏳ Promise pending → Suspense fallback</div>}>
            <PromiseReader resource={resource} />
          </Suspense>
        </DemoErrorBoundary>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">Error Boundary 能捕获</div>
          <p>子树 render、constructor、lifecycle，以及 lazy / use 传播出来的 render-time error。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">不能当万能 try/catch</div>
          <p>普通事件 handler 或任意异步 callback 中的异常不会因为附近有 Error Boundary 就自动被捕获；这些流程需要自己的错误处理。</p>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title">关键边界：不要在 render 中创建不稳定 Promise</div>
        <p>
          <code>use(fetch(...))</code> 如果每次 render 都创建新 Promise，会持续重新 suspend。真实项目应使用 Suspense-enabled framework/data cache，或由更上层创建并复用 Promise。
        </p>
      </div>
    </div>
  );
}

export default ErrorBoundaryUseDemo;
