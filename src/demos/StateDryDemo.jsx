import { useState } from "react";

const INITIAL_CART_ITEMS = [
  { id: 1, name: "红富士苹果", price: 8.5, count: 2 },
  { id: 2, name: "进口香蕉", price: 12, count: 1 },
  { id: 3, name: "高钙牛奶", price: 45, count: 1 },
];

const INITIAL_PLACES = {
  0: { id: 0, title: "项目", childIds: [1, 2] },
  1: { id: 1, title: "前端", childIds: [3, 4] },
  2: { id: 2, title: "后端", childIds: [] },
  3: { id: 3, title: "React 学习站", childIds: [] },
  4: { id: 4, title: "文件预览器", childIds: [] },
};

function PlaceTree({ id, places }) {
  const place = places[id];
  if (!place) return null;

  return (
    <li>
      {place.title}
      {place.childIds.length > 0 && (
        <ul>
          {place.childIds.map((childId) => (
            <PlaceTree key={childId} id={childId} places={places} />
          ))}
        </ul>
      )}
    </li>
  );
}

function FactRow({ label, value, bad = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span>{label}</span>
      <strong style={{ color: bad ? "var(--color-danger)" : undefined }}>{value}</strong>
    </div>
  );
}

export function StateDryDemo() {
  const [firstName, setFirstName] = useState("张");
  const [lastName, setLastName] = useState("三丰");
  const [storedFullName, setStoredFullName] = useState("张 三丰");
  const derivedFullName = `${firstName} ${lastName}`.trim();
  const fullNameIsStale = storedFullName !== derivedFullName;

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [status, setStatus] = useState("typing");
  const booleansContradict = isSending && isSent;

  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [selectedId, setSelectedId] = useState(1);
  const [selectedCopy, setSelectedCopy] = useState(INITIAL_CART_ITEMS[0]);
  const selectedItem = cartItems.find((item) => item.id === selectedId) ?? null;
  const selectedCopyIsStale =
    selectedItem != null &&
    selectedCopy != null &&
    (selectedItem.id !== selectedCopy.id || selectedItem.count !== selectedCopy.count);

  const totalCount = cartItems.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);

  const [places, setPlaces] = useState(INITIAL_PLACES);

  function changeSourceNameOnly() {
    setFirstName("李");
    setLastName("无忌");
  }

  function syncStoredName() {
    setStoredFullName(derivedFullName);
  }

  function resetNameExperiment() {
    setFirstName("张");
    setLastName("三丰");
    setStoredFullName("张 三丰");
  }

  function updateCount(id, delta) {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, count: Math.max(0, item.count + delta) }
            : item,
        )
        .filter((item) => item.count > 0),
    );
  }

  function chooseProduct(item) {
    setSelectedId(item.id);
    setSelectedCopy(item);
  }

  function syncSelectedCopy() {
    if (selectedItem) setSelectedCopy(selectedItem);
  }

  function resetCartExperiment() {
    setCartItems(INITIAL_CART_ITEMS);
    setSelectedId(1);
    setSelectedCopy(INITIAL_CART_ITEMS[0]);
  }

  function resetStatusExperiment() {
    setIsSending(false);
    setIsSent(false);
    setStatus("typing");
  }

  function removePlace(parentId, childId) {
    setPlaces((current) => {
      const parent = current[parentId];
      if (!parent) return current;

      return {
        ...current,
        [parentId]: {
          ...parent,
          childIds: parent.childIds.filter((id) => id !== childId),
        },
      };
    });
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title">
            <span>🧪</span> State 结构设计：先制造错误状态，再消除它
          </h2>
          <span className="badge badge-green">State Modeling</span>
        </div>
        <p className="demo-desc">
          好的 State shape 不只是“代码更短”，而是让<strong>可以表示的错误状态更少</strong>。下面先故意保存重复事实、互相矛盾的 boolean 和实体副本，再比较只保存最小事实的模型。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 冗余 State：两个字段描述同一事实</h3>
          <p className="demo-section-desc">
            <code>storedFullName</code> 与 <code>firstName + lastName</code> 都声称自己代表“姓名”。只要某条更新路径漏同步，它们就能互相矛盾。
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label>
            姓氏
            <input className="form-input" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </label>
          <label>
            名字
            <input className="form-input" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </label>
        </div>

        <div className="demo-grid-2" style={{ marginTop: 14 }}>
          <div className="comparison-card bad">
            <div className="comparison-header bad">❌ 重复保存：需要人为同步</div>
            <FactRow label="storedFullName" value={storedFullName || "（空）"} bad={fullNameIsStale} />
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={syncStoredName}>
              手动同步副本
            </button>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 派生：每次 render 只有一个答案</div>
            <FactRow label="derivedFullName" value={derivedFullName || "（空）"} />
            <code>const fullName = firstName + lastName</code>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <button className="btn btn-danger btn-sm" onClick={changeSourceNameOnly}>只改事实来源，故意漏同步</button>
          <button className="btn btn-outline btn-sm" onClick={resetNameExperiment}>重置实验</button>
          <span className={`badge ${fullNameIsStale ? "badge-red" : "badge-green"}`}>
            {fullNameIsStale ? "已制造不一致" : "当前一致"}
          </span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 矛盾 State：独立 boolean 扩大非法组合空间</h3>
          <p className="demo-section-desc">
            “正在发送”和“已经发送”在这个业务模型中应互斥。两个独立 boolean 能表示 4 种组合，其中至少一种没有业务含义；一个 <code>status</code> 只枚举允许的状态。
          </p>
        </div>

        <div className="demo-grid-2">
          <div className="comparison-card bad">
            <div className="comparison-header bad">❌ 两个独立事实来源</div>
            <label><input type="checkbox" checked={isSending} onChange={(event) => setIsSending(event.target.checked)} /> isSending</label>
            <label style={{ marginLeft: 12 }}><input type="checkbox" checked={isSent} onChange={(event) => setIsSent(event.target.checked)} /> isSent</label>
            <div className={`demo-alert ${booleansContradict ? "demo-alert-warning" : "demo-alert-info"}`} style={{ marginTop: 10 }}>
              {booleansContradict ? "矛盾：正在发送，同时又已经发送。" : "继续切换两个 checkbox，观察可表示的组合。"}
            </div>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 一个 status 枚举合法状态</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["typing", "sending", "sent"].map((nextStatus) => (
                <button
                  key={nextStatus}
                  className={`btn ${status === nextStatus ? "btn-primary" : "btn-secondary"} btn-sm`}
                  onClick={() => setStatus(nextStatus)}
                >
                  {nextStatus}
                </button>
              ))}
            </div>
            <FactRow label="status" value={status} />
          </div>
        </div>
        <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }} onClick={resetStatusExperiment}>重置实验</button>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">3. 重复实体：保存 ID，比保存对象副本更稳</h3>
          <p className="demo-section-desc">
            左侧故意保存 <code>selectedCopy</code>；右侧只保存 <code>selectedId</code> 并从 <code>cartItems</code> 查当前实体。更新商品数量时，不同步对象副本即可看到 stale copy。
          </p>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
              <button className="btn btn-secondary btn-sm" onClick={() => chooseProduct(item)}>
                选择 {item.name}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, -1)}>-1</button>
                <strong>{item.count}</strong>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, 1)}>+1</button>
              </div>
            </div>
          ))}
        </div>

        <div className="demo-grid-2" style={{ marginTop: 14 }}>
          <div className="comparison-card bad">
            <div className="comparison-header bad">❌ selectedCopy</div>
            <div>{selectedCopy ? `${selectedCopy.name} × ${selectedCopy.count}` : "无"}</div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={syncSelectedCopy}>手动同步对象副本</button>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ selectedId → 派生当前对象</div>
            <div>{selectedItem ? `${selectedItem.name} × ${selectedItem.count}` : "无"}</div>
            <div style={{ marginTop: 8 }}>总件数：{totalCount}；总金额：¥{totalPrice.toFixed(2)}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <span className={`badge ${selectedCopyIsStale ? "badge-red" : "badge-green"}`}>
            {selectedCopyIsStale ? "对象副本已经过期" : "当前一致"}
          </span>
          <button className="btn btn-outline btn-sm" onClick={resetCartExperiment}>重置实验</button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">4. 深层结构：难更新时再考虑 normalization</h3>
          <p className="demo-section-desc">
            扁平化不是目标本身。当树很深、同一实体被多处引用或局部更新需要复制多层祖先时，ID → entity 映射通常更容易维护。
          </p>
        </div>
        <div className="demo-grid-2">
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>当前树</strong>
            <ul style={{ marginBottom: 0 }}><PlaceTree id={0} places={places} /></ul>
          </div>
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <p>移除“前端 → React 学习站”只更新直接父节点的 <code>childIds</code>。</p>
            <button className="btn btn-danger btn-sm" onClick={() => removePlace(1, 3)}>移除关系</button>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} onClick={() => setPlaces(INITIAL_PLACES)}>重置</button>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">项目判断规则</div>
        <div>如果一个值能由现有 props/state 完整得到，就先派生；如果两个字段必须永远同步，先问是否其实只需要一个事实来源；如果多个 boolean 在描述同一状态机，考虑一个枚举状态；如果保存了实体对象副本，优先保存稳定 ID 并从 canonical collection 查当前对象。</div>
      </div>
    </div>
  );
}

export default StateDryDemo;
