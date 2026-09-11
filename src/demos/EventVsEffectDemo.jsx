import { useEffect, useState } from "react";

function fakePurchase(product, delay = 900) {
  return new Promise((resolve) => setTimeout(() => resolve(`${product} 下单成功`), delay));
}

export function EventVsEffectDemo() {
  const [product, setProduct] = useState("React 课程");
  const [directMessage, setDirectMessage] = useState("尚未触发");
  const [directCount, setDirectCount] = useState(0);
  const [requested, setRequested] = useState(false);
  const [effectMessage, setEffectMessage] = useState("尚未触发");
  const [effectCount, setEffectCount] = useState(0);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (!requested) return;

    let ignoreResult = false;
    const purchaseProduct = product;
    setEffectCount((count) => count + 1);
    setEffectMessage(`Effect 正在为 ${purchaseProduct} 发起命令…`);

    fakePurchase(purchaseProduct, 1200).then((message) => {
      if (!ignoreResult) {
        setEffectMessage(message);
        setRequested(false);
      }
    });

    return () => {
      ignoreResult = true;
    };
  }, [requested, product]);

  useEffect(() => {
    console.log(`Effect sync: online=${online}`);
    return () => console.log(`Effect cleanup: online=${online}`);
  }, [online]);

  async function handleDirectBuy() {
    const purchaseProduct = product;
    setDirectCount((count) => count + 1);
    setDirectMessage(`Event Handler 正在为 ${purchaseProduct} 发起命令…`);
    setDirectMessage(await fakePurchase(purchaseProduct));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🎯</span> Event vs Effect：看“为什么执行”</h2><span className="badge badge-blue">04-05</span></div>
        <p className="demo-desc">一次购买命令由这次点击导致；在线状态同步则由“当前状态必须与外部系统保持一致”导致。两者都能有副作用，但因果模型不同。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 同一个业务动作，两种写法</h3><p className="demo-section-desc">先选商品。分别触发两条路径；在右侧 Effect 请求尚未完成时切换商品，观察依赖变化如何让命令再次启动。</p></div>
        <select className="form-input" value={product} onChange={(event) => setProduct(event.target.value)}>
          <option>React 课程</option><option>TypeScript 课程</option>
        </select>

        <div className="demo-grid-2" style={{ marginTop: 12 }}>
          <div>
            <h4>✅ Event：点击直接发命令</h4>
            <button className="btn btn-primary" type="button" onClick={handleDirectBuy}>直接购买</button>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}>{directMessage}</div>
            <code>实际命令启动次数：{directCount}</code>
          </div>
          <div>
            <h4>❌ State + Effect 模拟事件</h4>
            <button className="btn" type="button" disabled={requested} onClick={() => setRequested(true)}>setRequested(true)</button>
            <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>{effectMessage}</div>
            <code>实际命令启动次数：{effectCount}</code>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🔄 Effect 的正确职责：同步外部系统</h3></div>
        <button className="btn" type="button" onClick={() => setOnline((value) => !value)}>切换为 {online ? "offline" : "online"}</button>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}>
          当前 React 状态是 <strong>{online ? "online" : "offline"}</strong>；Effect 的职责是让外部系统与这个当前状态保持同步。
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <strong>项目判断：</strong>“因为用户刚做了这件事” → Event Handler；“只要组件处于这个状态，外部系统就必须与之同步” → Effect。
      </div>
    </div>
  );
}

export default EventVsEffectDemo;
