import { useEffect, useState } from "react";

function fakePurchase(product) {
  return new Promise((resolve) => setTimeout(() => resolve(`${product} 下单成功`), 650));
}

export function EventVsEffectDemo() {
  const [product, setProduct] = useState("React 课程");
  const [online, setOnline] = useState(true);
  const [message, setMessage] = useState("尚未购买");
  const [syncLog, setSyncLog] = useState([]);

  useEffect(() => {
    const line = `Effect: 与外部在线状态同步 → ${online ? "online" : "offline"}`;
    setSyncLog((items) => [...items.slice(-3), line]);
  }, [online]);

  async function handleBuy() {
    setMessage("购买请求处理中…");
    setMessage(await fakePurchase(product));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🎯</span> Event vs Effect：动作与同步不是一回事</h2><span className="badge badge-blue">04-05</span></div>
        <p className="demo-desc">用户明确做了某件事，用 Event Handler；组件因为“当前已处于某状态”而需要与外部系统保持一致，才使用 Effect。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 两条因果链</h3></div>
        <div className="demo-grid-2">
          <div>
            <h4>用户动作 → Event Handler</h4>
            <select className="form-input" value={product} onChange={(e) => setProduct(e.target.value)}>
              <option>React 课程</option><option>TypeScript 课程</option>
            </select>
            <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handleBuy}>购买当前商品</button>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}>{message}</div>
          </div>
          <div>
            <h4>当前状态 → Effect 同步</h4>
            <button className="btn" onClick={() => setOnline((v) => !v)}>切换为 {online ? "offline" : "online"}</button>
            <div style={{ marginTop: 10, display: "grid", gap: 6 }}>{syncLog.map((line, i) => <code key={`${line}-${i}`}>{line}</code>)}</div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <strong>反模式：</strong>点击购买 → setIsBuying(true) → Effect 监听 isBuying 再发请求。这样把“事件因果”绕成了“状态同步”，容易造成重复触发和恢复状态后的意外副作用。
      </div>
      <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}>
        <strong>真实项目边界：</strong>支付、删除、提交、下载等明确用户动作放事件处理器；WebSocket、订阅、浏览器 API、第三方实例等“只要当前状态成立就必须保持同步”的关系放 Effect。
      </div>
    </div>
  );
}

export default EventVsEffectDemo;
