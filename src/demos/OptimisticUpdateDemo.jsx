import { useOptimistic, useState } from "react";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const initialComments = [
  { id: 1, text: "先显示结果，再等待服务器确认。", pending: false },
];

function optimisticReducer(currentComments, action) {
  if (action.type === "add") {
    return [...currentComments, { ...action.comment, pending: true }];
  }
  return currentComments;
}

export function OptimisticUpdateDemo() {
  const [comments, setComments] = useState(initialComments);
  const [optimisticComments, addOptimisticComment] = useOptimistic(comments, optimisticReducer);
  const [message, setMessage] = useState("尚未提交");

  async function addCommentAction(formData) {
    const text = String(formData.get("comment") ?? "").trim();
    const shouldReject = formData.has("shouldReject");

    if (!text) {
      setMessage("请输入评论内容");
      return;
    }

    const temporaryComment = {
      id: `temp-${Date.now()}`,
      text,
    };

    setMessage("服务器处理中：先展示 optimistic comment");
    addOptimisticComment({ type: "add", comment: temporaryComment });
    await wait(1200);

    if (shouldReject) {
      setMessage("业务拒绝：Action 正常结束且 canonical state 未变化，optimistic comment 自动回退");
      return;
    }

    setComments((current) => [
      ...current,
      { id: Date.now(), text, pending: false },
    ]);
    setMessage("服务器成功：真实 state 接管，optimistic 与 canonical 收敛");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>⚡</span> useOptimistic：即时反馈、成功收敛、未确认回退</h2>
          </div>
          <span className="badge badge-blue">React 19</span>
        </div>
        <p className="demo-desc">
          Optimistic UI 不是提前修改真实数据，而是在 Action 仍 pending 时临时渲染“预计会成功”的状态。Action 结束后，UI 重新以真实 state 为准。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">temporary state</span>
          <span className="badge badge-gray">Action</span>
          <span className="badge badge-gray">commit</span>
          <span className="badge badge-gray">rollback</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 评论提交实验</h3>
          <p className="demo-section-desc">正常提交观察 optimistic → confirmed；勾选“模拟业务拒绝”观察 Action 正常结束、canonical 未更新时 optimistic 项目消失。这里不模拟 throw / Error Boundary。</p>
        </div>

        <div className="demo-grid-2">
          <div>
            <ul style={{ paddingLeft: 20 }}>
              {optimisticComments.map((comment) => (
                <li key={comment.id} style={{ marginBottom: 8, opacity: comment.pending ? 0.6 : 1 }}>
                  {comment.text} {comment.pending && <span className="badge badge-gray">发送中</span>}
                </li>
              ))}
            </ul>

            <form action={addCommentAction} style={{ display: "grid", gap: 10 }}>
              <input className="form-input" name="comment" defaultValue="这条评论会先乐观显示" />
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" name="shouldReject" />
                模拟业务拒绝（正常返回）
              </label>
              <button className="btn btn-primary" type="submit">发送评论</button>
            </form>
          </div>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>状态对照</h4>
            <p><strong>Canonical:</strong> {comments.length} 条</p>
            <p><strong>当前 UI:</strong> {optimisticComments.length} 条</p>
            <div className="demo-alert demo-alert-tip">{message}</div>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{`Action 开始\n  ↓\nsetOptimistic(...)\n  ↓\n立即渲染临时 UI\n  ↓\nawait server\n  ├─ confirmed → 更新 canonical state → 收敛\n  └─ rejected（正常返回）→ canonical 不变 → 自动回退`}</pre>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> Optimistic UI 的边界</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>适合：</strong>点赞、评论、Todo、购物车数量等成功率高、用户希望即时反馈、未确认后可以明确恢复的 mutation。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>谨慎：</strong>支付、库存锁定、权限授予等不能轻易制造“已经成功”错觉的操作，通常需要更保守的 pending UI。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          <code>useOptimistic</code> 的 setter 必须在 Action / Transition 中调用。不要额外维护一份长期 optimistic store；canonical state 才是 Action 结束后的最终真源。若 Action 真正抛出异常，还需要独立设计 catch / Error Boundary / 重试等错误路径；本实验没有伪装那条路径。
        </p>
      </div>
    </div>
  );
}

export default OptimisticUpdateDemo;