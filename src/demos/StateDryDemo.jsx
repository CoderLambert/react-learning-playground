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

export function StateDryDemo() {
  const [firstName, setFirstName] = useState("张");
  const [lastName, setLastName] = useState("三丰");
  const fullName = `${firstName} ${lastName}`.trim();

  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [selectedId, setSelectedId] = useState(1);

  const totalCount = cartItems.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
  const selectedItem = cartItems.find((item) => item.id === selectedId) ?? null;

  const [status, setStatus] = useState("typing");
  const [places, setPlaces] = useState(INITIAL_PLACES);

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
          <div>
            <h2 className="demo-title">
              <span>🧪</span> State 结构设计：让不可能状态无法出现
            </h2>
          </div>
          <span className="badge badge-green">State Modeling</span>
        </div>
        <p className="demo-desc">
          State 的关键不是“能不能存”，而是<strong>应该存什么</strong>。良好的结构应减少同步负担：相关数据一起变化时可合并、互斥状态避免用多个 boolean、可计算值不重复存、同一实体不复制两份，并尽量避免难以更新的深层嵌套。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">Single Source of Truth</span>
          <span className="badge badge-gray">Avoid Contradictions</span>
          <span className="badge badge-gray">Avoid Duplication</span>
          <span className="badge badge-gray">Normalize Deep State</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 冗余 State：能计算，就不要再存一份</h3>
          <p className="demo-section-desc">
            <code>fullName</code> 完全由两个输入决定，因此直接在 render 中计算；不需要第三个 state，也不需要 Effect 去同步。
          </p>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad">❌ 冗余状态 + Effect 同步</div>
            <pre style={{ margin: 0, padding: 8, fontSize: 12, overflowX: "auto" }}>{`const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(first + ' ' + last);
}, [first, last]);`}</pre>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 渲染期派生</div>
            <pre style={{ margin: 0, padding: 8, fontSize: 12, overflowX: "auto" }}>{`const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const fullName = \`${"${first} ${last}"}\`.trim();`}</pre>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap", marginTop: 16 }}>
          <label style={{ fontSize: 12, color: "var(--text-muted)" }}>
            姓氏
            <input className="form-input" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </label>
          <label style={{ fontSize: 12, color: "var(--text-muted)" }}>
            名字
            <input className="form-input" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </label>
          <strong style={{ paddingBottom: 8, color: "var(--color-primary)" }}>{fullName || "（空）"}</strong>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 矛盾 State：用一个 status 表示互斥状态</h3>
          <p className="demo-section-desc">
            <code>isSending</code> + <code>isSent</code> 可能同时为 true，形成业务上不可能的组合。一个有限状态值更容易推理，也更容易扩展 error / retry。
          </p>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad">❌ 两个 boolean 可产生 4 种组合</div>
            <pre style={{ margin: 0, padding: 8, fontSize: 12 }}>{`isSending = true
isSent = true // “正在发送”又“已发送”`}</pre>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 一个 status 只允许合法状态</div>
            <pre style={{ margin: 0, padding: 8, fontSize: 12 }}>{`status = 'typing'
status = 'sending'
status = 'sent'`}</pre>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {["typing", "sending", "sent"].map((nextStatus) => (
            <button
              key={nextStatus}
              className={`btn ${status === nextStatus ? "btn-primary" : "btn-secondary"} btn-sm`}
              onClick={() => setStatus(nextStatus)}
            >
              {nextStatus}
            </button>
          ))}
          <span className="badge badge-blue">当前唯一事实：status = {status}</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">3. 重复 State：保存 ID，而不是复制整条实体</h3>
          <p className="demo-section-desc">
            商品实体只存在 <code>cartItems</code> 中；选中状态只保存 <code>selectedId</code>。这样商品数量更新后，选中详情自然读取到最新对象，不需要额外同步 selectedItem 副本。
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                padding: "10px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: selectedId === item.id ? "var(--color-primary-light)" : "var(--bg-surface)",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="radio"
                  name="selected-product"
                  checked={selectedId === item.id}
                  onChange={() => setSelectedId(item.id)}
                />
                <span>{item.name}</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, -1)}>-1</button>
                <strong>{item.count}</strong>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, 1)}>+1</button>
              </div>
            </div>
          ))}
        </div>

        <div className="demo-alert demo-alert-info">
          <div className="demo-alert-title">当前派生结果</div>
          <div>总件数：{totalCount}；总金额：¥{totalPrice.toFixed(2)}</div>
          <div>
            选中项：{selectedItem ? `${selectedItem.name} × ${selectedItem.count}` : "无（原商品可能已删除）"}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">4. 深层嵌套：复杂树状数据优先考虑扁平化</h3>
          <p className="demo-section-desc">
            当更新一个叶子节点需要一路复制祖先对象时，更新代码容易变长。这里把实体放进 ID → entity 的映射，父节点只保存 childIds；删除关系只需要更新直接父节点。
          </p>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>当前树</strong>
            <ul style={{ marginBottom: 0 }}>
              <PlaceTree id={0} places={places} />
            </ul>
          </div>
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>关系操作</strong>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              删除“前端 → React 学习站”的关系，只更新 parent.childIds，不需要深拷贝整棵树。
            </p>
            <button className="btn btn-danger btn-sm" onClick={() => removePlace(1, 3)}>
              移除 React 学习站
            </button>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} onClick={() => setPlaces(INITIAL_PLACES)}>
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">State 结构检查清单</div>
        <div>① 总是一起更新的数据，考虑组合；② 不要允许互相矛盾的 boolean；③ 可派生的数据不要存；④ 同一实体避免复制；⑤ 深层结构难更新时考虑 normalization。</div>
        <div>
          项目边界：这里不是要求“所有 state 都扁平化”。如果嵌套结构很浅且天然一起更新，保持对象结构反而更直观；重构目标是降低出错概率，而不是追求某种固定形状。
        </div>
      </div>
    </div>
  );
}

export default StateDryDemo;
