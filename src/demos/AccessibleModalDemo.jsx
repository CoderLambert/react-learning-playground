import { useEffect, useRef, useState } from "react";

function Modal({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const focusable = Array.from(
      dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessible-modal-title"
        aria-describedby="accessible-modal-desc"
        style={{ background: "var(--bg-surface)", padding: 20, borderRadius: 12, maxWidth: 520, width: "100%" }}
      >
        <h3 id="accessible-modal-title">键盘可用的 Modal</h3>
        <p id="accessible-modal-desc">Tab/Shift+Tab 会留在对话框内，Escape 关闭；关闭后焦点回到打开按钮。</p>
        <label htmlFor="modal-note">备注</label>
        <input id="modal-note" className="form-input" placeholder="尝试按 Tab" />
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>保存并关闭</button>
          <button type="button" className="btn" onClick={onClose}>取消</button>
        </div>
      </section>
    </div>
  );
}

export function AccessibleModalDemo() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef(null);

  function closeModal() {
    setOpen(false);
    requestAnimationFrame(() => openerRef.current?.focus());
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>⌨️</span> Modal Focus：焦点必须进入、限制、再归还</h2>
          </div>
          <span className="badge badge-blue">Focus Management</span>
        </div>
        <p className="demo-desc">
          模态对话框不能只“视觉盖住页面”。WAI-ARIA Modal Dialog 模式要求焦点进入对话框、Tab/Shift+Tab 不逃出、Escape 可关闭，并在通常情况下关闭后把焦点归还到触发位置；模态期间背景内容还应真正不可交互。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 只用键盘完成实验</h3>
          <p className="demo-section-desc">打开后连续按 Tab / Shift+Tab，再按 Escape。这个教学实现重点演示初始焦点、焦点循环和焦点恢复。</p>
        </div>
        <button ref={openerRef} type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
          打开 Modal
        </button>
        {open && <Modal onClose={closeModal} />}
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">Modal 的完整职责</div>
          <p>accessible name、合适的初始焦点、Tab 循环、Escape、关闭后的合理焦点位置，以及让背景内容在键盘、指针和辅助技术语义上不可交互。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">教学实现边界</div>
          <p>本 Demo 没有实现完整的 <code>inert</code>/background isolation、动态 focusable 列表、嵌套 dialog 与滚动锁定。<code>aria-modal="true"</code> 是语义声明，不应被当作自动禁用背景交互的实现。生产项目优先采用经过可访问性验证的 Dialog primitive。</p>
        </div>
      </div>
    </div>
  );
}

export default AccessibleModalDemo;
