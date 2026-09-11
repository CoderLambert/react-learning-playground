import { useState } from "react";

const CONTACTS = [
  { id: "taylor", name: "Taylor" },
  { id: "alice", name: "Alice" },
  { id: "bob", name: "Bob" },
];

function Chat({ contact }) {
  const [draft, setDraft] = useState("");

  return (
    <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
      <div style={{ marginBottom: 8 }}>
        当前收件人：<strong>{contact.name}</strong>
      </div>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={`写给 ${contact.name} 的消息...`}
        rows={4}
        style={{ width: "100%", resize: "vertical" }}
      />
      <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
        Chat 内部 State：draft = {draft || "(empty)"}
      </div>
    </div>
  );
}

function ContactButtons({ selectedId, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {CONTACTS.map((contact) => (
        <button
          key={contact.id}
          className={`btn ${selectedId === contact.id ? "btn-primary" : "btn-secondary"} btn-sm`}
          onClick={() => onSelect(contact)}
        >
          {contact.name}
        </button>
      ))}
    </div>
  );
}

export function PreservingResettingStateDemo() {
  const [preservedContact, setPreservedContact] = useState(CONTACTS[0]);
  const [resetContact, setResetContact] = useState(CONTACTS[0]);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧠</span> Preserving / Resetting State：State 属于树中的位置
            </h2>
          </div>
          <span className="badge badge-blue">Identity</span>
        </div>
        <p className="demo-desc">
          React 不把 State 简单“存在组件函数里”，而是把 State 与组件在 render tree 中的位置和身份关联。相同位置继续渲染相同类型组件时，State 默认会保留；改变 key 可以明确告诉 React：这是另一个组件身份，应重新创建并重置子树 State。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">tree position</span>
          <span className="badge badge-gray">component type</span>
          <span className="badge badge-gray">key</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 相同位置 + 相同组件类型：State 被保留</h3>
          <p className="demo-section-desc">
            先给 Taylor 输入草稿，再切换 Alice。虽然 contact prop 变了，但这里始终是在同一个父级位置渲染同一个 Chat 类型，因此 React 复用这个组件身份，draft 继续保留。
          </p>
        </div>
        <ContactButtons selectedId={preservedContact.id} onSelect={setPreservedContact} />
        <div style={{ marginTop: 12 }}>
          <Chat contact={preservedContact} />
        </div>
        <div className="demo-alert demo-alert-danger">
          <div className="demo-alert-title">⚠️ 真实风险</div>
          <div>聊天、编辑器、表单等场景里，保留旧 State 可能让用户把上一位对象的草稿误操作到新对象上。</div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 改变 key：显式切换组件身份并 reset</h3>
          <p className="demo-section-desc">
            下面给 Chat 设置 <code>key={"{contact.id}"}</code>。切换联系人时 key 改变，React 会把旧 Chat 从树中移除，再创建一个新的 Chat，因此内部 draft 从初始值重新开始。
          </p>
        </div>
        <ContactButtons selectedId={resetContact.id} onSelect={setResetContact} />
        <div style={{ marginTop: 12 }}>
          <Chat key={resetContact.id} contact={resetContact} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">3. 心智模型</h3>
        </div>
        <pre style={{ fontSize: 12, lineHeight: 1.7, overflowX: "auto" }}>{`same parent position
+ same component type
+ same key (or no key)
        ↓
React keeps component identity
        ↓
State preserved

key changes
        ↓
component identity changes
        ↓
old subtree unmounts
        ↓
new subtree mounts
        ↓
State reset`}</pre>
      </div>

      <div className="comparison-container">
        <div className="comparison-card good">
          <div className="comparison-header good">✅ 主动 reset 的典型场景</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            切换聊天对象、编辑不同实体、切换租户/账户、重新开始向导步骤时，如果旧局部 State 不应该跨实体继承，可以让实体 ID 参与 key。
          </div>
        </div>
        <div className="comparison-card bad">
          <div className="comparison-header bad">❌ 常见误解</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            key 不只是列表 warning 的修复工具，也不要为了“强制刷新”随意使用随机 key。随机 key 会让组件每次 render 都丢失身份，造成不必要的卸载、挂载和 State 丢失。
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreservingResettingStateDemo;
