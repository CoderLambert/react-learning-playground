import { useMemo, useState } from "react";
import {
  createCustomQuestion,
  createQuestionBankRepository,
  resolveQuestionBank,
} from "./questionBank.js";

const repository = createQuestionBankRepository();

function itemLabel(item) {
  return item.kind === "exercise" ? "练习" : "问题";
}

export function QuestionBankManager({ chapter, checkpoint }) {
  const [state, setState] = useState(() => repository.load());
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState("question");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [feedback, setFeedback] = useState("");

  const resolved = useMemo(
    () => resolveQuestionBank({ chapter, checkpoint, state }),
    [chapter, checkpoint, state],
  );

  function commit(result, message) {
    if (!result.ok) {
      setFeedback("保存失败：浏览器存储不可用，请检查隐私设置后重试。");
      return false;
    }
    setState(repository.load());
    setFeedback(message);
    return true;
  }

  function edit(item) {
    setEditingId(item.id);
    setEditingText(item.text);
  }

  function saveEdit(item) {
    const text = editingText.trim();
    if (!text) return;
    const result = item.source === "builtin"
      ? repository.setOverride(item.id, { text })
      : repository.upsertCustom({ ...item, text });
    if (commit(result, `${itemLabel(item)}已保存`)) {
      setEditingId(null);
      setEditingText("");
    }
  }

  function toggleBuiltin(item) {
    commit(
      repository.setOverride(item.id, { hidden: !item.hidden }),
      item.hidden ? "已恢复显示" : "已隐藏，可随时恢复",
    );
  }

  function restoreBuiltin(item) {
    commit(repository.clearOverride(item.id), "已恢复内置默认内容");
  }

  function addCustom(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const item = createCustomQuestion({ chapter, kind, text });
    if (commit(repository.upsertCustom(item), `已新增${itemLabel(item)}`)) setDraft("");
  }

  function duplicate(item) {
    const copy = createCustomQuestion({ chapter, kind: item.kind, text: `${item.text}（副本）` });
    commit(repository.upsertCustom(copy), `已复制为自定义${itemLabel(copy)}`);
  }

  function remove(item) {
    if (item.source === "builtin") return toggleBuiltin(item);
    commit(repository.deleteCustom(item.id), `已删除自定义${itemLabel(item)}`);
  }

  function move(item, direction) {
    const sameKind = resolved.filter((candidate) => candidate.kind === item.kind);
    const currentIndex = sameKind.findIndex((candidate) => candidate.id === item.id);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= sameKind.length) return;
    const ids = sameKind.map((candidate) => candidate.id);
    [ids[currentIndex], ids[nextIndex]] = [ids[nextIndex], ids[currentIndex]];
    commit(repository.setOrder(chapter, item.kind, ids), "排序已保存");
  }

  const visible = showHidden ? resolved : resolved.filter((item) => !item.hidden);

  return (
    <section className="demo-alert demo-alert-info" aria-labelledby={`question-bank-${chapter}-title`}>
      <div className="demo-alert-title" id={`question-bank-${chapter}-title`}>题库管理</div>
      <p>内置题只做覆盖/隐藏，不会被删除；自定义题可以编辑、复制、排序和删除。所有修改保存在当前浏览器。</p>

      <form onSubmit={addCustom} style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <label>
          类型
          <select value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="question">问题</option>
            <option value="exercise">练习</option>
          </select>
        </label>
        <label>
          新内容
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} />
        </label>
        <button type="submit" disabled={!draft.trim()}>新增</button>
      </form>

      <label style={{ display: "inline-flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input type="checkbox" checked={showHidden} onChange={(event) => setShowHidden(event.target.checked)} />
        查看已隐藏内置题
      </label>

      <div role="status" aria-live="polite" style={{ minHeight: 24 }}>{feedback}</div>

      <ol style={{ display: "grid", gap: 10, paddingLeft: 24 }}>
        {visible.map((item) => (
          <li key={item.id} data-question-id={item.id}>
            <div>
              <strong>{itemLabel(item)}</strong>
              <span> · {item.source === "builtin" ? "内置" : "自定义"}</span>
              {item.hidden && <span> · 已隐藏</span>}
            </div>
            {editingId === item.id ? (
              <div style={{ display: "grid", gap: 8 }}>
                <textarea
                  aria-label={`编辑${itemLabel(item)}`}
                  value={editingText}
                  onChange={(event) => setEditingText(event.target.value)}
                  rows={3}
                  autoFocus
                />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => saveEdit(item)} disabled={!editingText.trim()}>保存</button>
                  <button type="button" onClick={() => setEditingId(null)}>取消</button>
                </div>
              </div>
            ) : (
              <p>{item.text}</p>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} aria-label={`${itemLabel(item)}操作`}>
              <button type="button" onClick={() => edit(item)}>编辑</button>
              <button type="button" onClick={() => duplicate(item)}>复制</button>
              <button type="button" onClick={() => move(item, -1)}>上移</button>
              <button type="button" onClick={() => move(item, 1)}>下移</button>
              {item.source === "builtin" ? (
                <>
                  <button type="button" onClick={() => toggleBuiltin(item)}>{item.hidden ? "恢复显示" : "隐藏"}</button>
                  {item.overridden && <button type="button" onClick={() => restoreBuiltin(item)}>恢复默认</button>}
                </>
              ) : (
                <button type="button" onClick={() => remove(item)}>删除</button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
