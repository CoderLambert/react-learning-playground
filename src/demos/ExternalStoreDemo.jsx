import { useSyncExternalStore } from "react";

let value = 0;
let snapshot = { value, version: 0 };
const listeners = new Set();

function emit(nextValue) {
  value = nextValue;
  snapshot = { value, version: snapshot.version + 1 };
  listeners.forEach((listener) => listener());
}

const counterStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return snapshot;
  },
  increment() {
    emit(value + 1);
  },
  reset() {
    emit(0);
  },
  getListenerCount() {
    return listeners.size;
  },
};

function StoreReader({ label }) {
  const current = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot);
  return (
    <div className="demo-alert demo-alert-tip">
      <strong>{label}</strong>
      <p>snapshot.value = {current.value} · version = {current.version}</p>
      <p>当前订阅者：{counterStore.getListenerCount()}</p>
    </div>
  );
}

export function ExternalStoreDemo() {
  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📡</span> useSyncExternalStore：把 React 接到外部真源</h2><span className="badge badge-blue">Chapter 08</span></div>
        <p className="demo-desc">外部 Store 的值不归 React State 所有。React 通过 subscribe 得知“可能变了”，再调用 getSnapshot 读取快照；只有快照按 Object.is 真的变化时才需要更新 UI。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">subscribe</span><span className="badge badge-gray">getSnapshot</span><span className="badge badge-gray">Object.is</span><span className="badge badge-gray">unsubscribe</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> 两个组件订阅同一个 React 外部 Store</h3><p className="demo-section-desc">点击按钮直接修改 React 之外的 store。两个 Reader 不共享 React State，却都从同一 external source 读取一致快照。</p></div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}><button className="btn btn-primary" onClick={counterStore.increment}>externalStore.increment()</button><button className="btn" onClick={counterStore.reset}>reset</button></div>
        <div className="demo-grid-2"><StoreReader label="Reader A" /><StoreReader label="Reader B" /></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧠</span> getSnapshot 为什么不能每次都 return {'{ value }'}？</h3></div>
        <div className="demo-alert demo-alert-warning"><strong>反模式：</strong>如果 store 没变化时 getSnapshot 仍创建全新对象，React 会看到一个新的 identity。官方要求未变化期间重复调用 getSnapshot 必须返回相同值；可变 store 应缓存 immutable snapshot。</div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}><strong>正确模型：</strong>store 变化 → notify subscribers → React 再读 snapshot → Object.is 比较 → 必要时 render。</div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🏗️</span> 真实项目选型边界</h3></div>
        <div className="demo-grid-2">
          <div className="demo-alert"><strong>React 自带能力优先</strong><p>局部 UI State 用 useState；复杂页面状态用 useReducer；跨子树传递用 Context。没有外部真源时不要为了“全局”两个字先加 Store。</p></div>
          <div className="demo-alert"><strong>外部 Store 何时有价值</strong><p>跨 React root、已有非 React store、浏览器 API、复杂全局领域状态、需要 devtools/middleware/selector 生态时再评估 Zustand / Redux Toolkit / Jotai。</p></div>
        </div>
        <div className="demo-alert demo-alert-tip"><strong>定位：</strong>Zustand 偏轻量 store + selectors；Redux Toolkit 偏约束化可预测状态流和成熟生态；Jotai 偏原子化依赖图。它们不是 React Core，也不是 Server State cache 的替代品。</div>
      </div>
    </div>
  );
}

export default ExternalStoreDemo;
