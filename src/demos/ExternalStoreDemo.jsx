import { useState, useSyncExternalStore } from "react";

let value = 0;
let version = 0;
let snapshot = { value, version };
const listeners = new Set();

let lifecycleSequence = 0;
let lifecycleSnapshot = { listenerCount: 0, events: [] };
const lifecycleListeners = new Set();

function publishLifecycle(type) {
  lifecycleSequence += 1;
  lifecycleSnapshot = {
    listenerCount: listeners.size,
    events: [
      ...lifecycleSnapshot.events,
      { id: lifecycleSequence, type, listenerCount: listeners.size },
    ].slice(-8),
  };
  lifecycleListeners.forEach((listener) => listener());
}

const lifecycleStore = {
  subscribe(listener) {
    lifecycleListeners.add(listener);
    return () => lifecycleListeners.delete(listener);
  },
  getSnapshot() {
    return lifecycleSnapshot;
  },
  clear() {
    lifecycleSnapshot = { ...lifecycleSnapshot, events: [] };
    lifecycleListeners.forEach((listener) => listener());
  },
};

function emit(nextValue) {
  value = nextValue;
  version += 1;
  snapshot = { value, version };
  listeners.forEach((listener) => listener());
}

const counterStore = {
  subscribe(listener) {
    listeners.add(listener);
    publishLifecycle("subscribe");

    return () => {
      listeners.delete(listener);
      publishLifecycle("unsubscribe");
    };
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
};

function StoreReader({ label }) {
  const current = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot);
  return (
    <div className="demo-alert demo-alert-tip">
      <strong>{label}</strong>
      <p>snapshot.value = {current.value} · version = {current.version}</p>
      <p>这个组件没有复制 counter 到 React State；它始终读取 external snapshot。</p>
    </div>
  );
}

function SubscriptionInspector() {
  const lifecycle = useSyncExternalStore(lifecycleStore.subscribe, lifecycleStore.getSnapshot);

  return (
    <div className="demo-alert demo-alert-info" style={{ marginTop: 12 }}>
      <div className="demo-alert-title">真实 subscribe / unsubscribe 记录</div>
      <p>counterStore 当前订阅者：<strong>{lifecycle.listenerCount}</strong></p>
      {lifecycle.events.length === 0 ? (
        <p>暂无记录。</p>
      ) : (
        <ol style={{ marginBottom: 8 }}>
          {lifecycle.events.map((event) => (
            <li key={event.id}>
              {event.type} → listenerCount = {event.listenerCount}
            </li>
          ))}
        </ol>
      )}
      <button type="button" className="btn btn-sm" onClick={lifecycleStore.clear}>清空生命周期记录</button>
      <p style={{ marginTop: 8, marginBottom: 0 }}>开发 Strict Mode 下可能看到额外的 subscribe → unsubscribe → subscribe 验证周期；判断 cleanup 时关注最终订阅数量和成对释放，而不是假设 setup 只发生一次。</p>
    </div>
  );
}

export function ExternalStoreDemo() {
  const [showReaderB, setShowReaderB] = useState(true);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📡</span> useSyncExternalStore：把 React 接到外部真源</h2><span className="badge badge-blue">Chapter 08</span></div>
        <p className="demo-desc">外部 Store 的值不归 React State 所有。React 通过 subscribe 得知“可能变了”，再调用 getSnapshot 读取快照；只有快照按 Object.is 真的变化时才需要更新 UI。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">subscribe</span><span className="badge badge-gray">getSnapshot</span><span className="badge badge-gray">Object.is</span><span className="badge badge-gray">unsubscribe</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> 两个组件订阅同一个 React 外部 Store</h3><p className="demo-section-desc">点击按钮直接修改 React 之外的 store。Reader 不共享 React State，却都从同一 external source 读取一致快照。再卸载 Reader B，观察 counterStore 的真实 cleanup。</p></div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={counterStore.increment}>externalStore.increment()</button>
          <button className="btn" onClick={counterStore.reset}>reset</button>
          <button className="btn" type="button" onClick={() => setShowReaderB((value) => !value)}>{showReaderB ? "卸载 Reader B" : "挂载 Reader B"}</button>
        </div>
        <div className="demo-grid-2">
          <StoreReader label="Reader A" />
          {showReaderB ? <StoreReader label="Reader B" /> : <div className="demo-alert">Reader B 已卸载。</div>}
        </div>
        <SubscriptionInspector />
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧠</span> getSnapshot 为什么不能每次都 return {'{ value }'}？</h3></div>
        <div className="demo-alert demo-alert-warning"><strong>反模式：</strong>如果 store 没变化时 getSnapshot 仍创建全新对象，React 会看到一个新的 identity。官方要求未变化期间重复调用 getSnapshot 必须返回相同值；可变 store 应缓存 immutable snapshot。</div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}><strong>正确模型：</strong>store 变化 → notify subscribers → React 再读 snapshot → Object.is 比较 → 必要时 render。生命周期统计与业务 snapshot 在本 Demo 中分开，避免为了“显示订阅数量”反过来篡改业务快照。</div>
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
