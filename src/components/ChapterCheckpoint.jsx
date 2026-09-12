import { useMemo, useState } from "react";
import { createQuestionBankRepository } from "../assessment/questions/questionBankRepository.js";
import { getChapterNextStep, getIntegrationLab } from "./chapterCheckpointMap";

const actionButtonStyle = {
  border: "1px solid color-mix(in srgb, currentColor 24%, transparent)",
  borderRadius: 6,
  padding: "3px 8px",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontSize: 12,
};

function QuestionEditor({ item, onSave, onCancel }) {
  const [prompt, setPrompt] = useState(item.prompt);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (prompt.trim()) onSave(prompt.trim());
      }}
      style={{ display: "grid", gap: 8, margin: "6px 0 10px" }}
    >
      <label>
        <span className="sr-only">编辑题目</span>
        <textarea
          autoFocus
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onCancel();
          }}
          rows={4}
          style={{ width: "100%", boxSizing: "border-box", resize: "vertical" }}
        />
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" style={actionButtonStyle} disabled={!prompt.trim()}>保存</button>
        <button type="button" style={actionButtonStyle} onClick={onCancel}>取消</button>
      </div>
    </form>
  );
}

function ManagedItem({ item, onEdit, onHide, onRestore, onDelete, onDuplicate, onMove }) {
  const [editing, setEditing] = useState(false);
  return (
    <li data-question-id={item.id} style={{ marginBottom: 12 }}>
      {editing ? (
        <QuestionEditor
          item={item}
          onSave={(prompt) => {
            onEdit(item, prompt);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div>{item.prompt}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }} aria-label="题目操作">
            <button type="button" style={actionButtonStyle} onClick={() => setEditing(true)}>编辑</button>
            <button type="button" style={actionButtonStyle} onClick={() => onDuplicate(item)}>复制题目</button>
            {item.origin === "builtin" ? (
              <>
                <button type="button" style={actionButtonStyle} onClick={() => onHide(item)}>从评测中移除</button>
                {item.customized ? <button type="button" style={actionButtonStyle} onClick={() => onRestore(item)}>恢复默认</button> : null}
              </>
            ) : (
              <>
                <button type="button" style={actionButtonStyle} onClick={() => onMove(item, "up")}>上移</button>
                <button type="button" style={actionButtonStyle} onClick={() => onMove(item, "down")}>下移</button>
                <button type="button" style={actionButtonStyle} onClick={() => onDelete(item)}>删除自定义题</button>
              </>
            )}
          </div>
        </>
      )}
    </li>
  );
}

function ManagedList({ items, hiddenItems, onEdit, onHide, onRestore, onDelete, onDuplicate, onMove }) {
  const visible = items.filter((item) => !item.hidden);
  return (
    <>
      {visible.length > 0 ? (
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {visible.map((item) => (
            <ManagedItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              onHide={onHide}
              onRestore={onRestore}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onMove={onMove}
            />
          ))}
        </ol>
      ) : <p style={{ marginBottom: 0 }}>当前没有可见题目。</p>}

      {hiddenItems.length > 0 ? (
        <details style={{ marginTop: 10 }}>
          <summary>已隐藏题目 · {hiddenItems.length}</summary>
          <ul style={{ paddingLeft: 20 }}>
            {hiddenItems.map((item) => (
              <li key={item.id} style={{ marginTop: 8 }}>
                <span>{item.prompt}</span>{" "}
                <button type="button" style={actionButtonStyle} onClick={() => onRestore(item)}>恢复</button>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </>
  );
}

function AddQuestionForm({ onAdd }) {
  const [kind, setKind] = useState("question");
  const [prompt, setPrompt] = useState("");
  return (
    <details style={{ marginTop: 16 }}>
      <summary>＋ 添加自己的评测题</summary>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!prompt.trim()) return;
          onAdd({ kind, prompt: prompt.trim() });
          setPrompt("");
        }}
        style={{ display: "grid", gap: 8, marginTop: 10 }}
      >
        <label>
          类型{" "}
          <select value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="question">检查问题</option>
            <option value="exercise">练习</option>
          </select>
        </label>
        <label>
          <span className="sr-only">题目内容</span>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={3}
            placeholder="写下你想加入本章评测的问题或练习…"
            style={{ width: "100%", boxSizing: "border-box", resize: "vertical" }}
          />
        </label>
        <div><button type="submit" style={actionButtonStyle} disabled={!prompt.trim()}>添加到本章</button></div>
      </form>
    </details>
  );
}

export function ChapterCheckpoint({ chapter }) {
  const repository = useMemo(() => createQuestionBankRepository(), []);
  const [revision, setRevision] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [lastHiddenId, setLastHiddenId] = useState(null);
  const checkpoint = useMemo(() => repository.resolveChapter(chapter), [repository, chapter, revision]);
  if (!checkpoint) return null;

  const nextStep = getChapterNextStep(chapter);
  const integrationLab = getIntegrationLab(chapter);
  const refresh = (message) => {
    setRevision((value) => value + 1);
    setFeedback(message);
  };
  const commit = (operation, successMessage) => {
    try {
      operation();
      refresh(successMessage);
    } catch {
      setFeedback("保存失败，请检查浏览器存储权限后重试。");
    }
  };
  const edit = (item, prompt) => commit(
    () => item.origin === "builtin" ? repository.setBuiltinPrompt(item.id, prompt) : repository.updateCustom(item.id, { prompt }),
    "题目已保存。",
  );
  const hide = (item) => commit(() => {
    repository.setBuiltinHidden(item.id, true);
    setLastHiddenId(item.id);
  }, "题目已从本章评测中移除，可撤销。");
  const restore = (item) => commit(() => repository.restoreBuiltin(item.id), "已恢复课程默认题目。");
  const removeCustom = (item) => commit(() => repository.deleteCustom(item.id), "自定义题已删除。");
  const add = ({ kind, prompt }) => commit(() => repository.addCustom({ chapter, kind, prompt }), "自定义题已添加。");
  const duplicate = (item) => commit(() => repository.duplicate(item), "已创建题目副本，可继续编辑。");
  const move = (item, direction) => commit(() => repository.moveCustom(item.id, direction), direction === "up" ? "题目已上移。" : "题目已下移。");
  const undoHide = () => {
    if (!lastHiddenId) return;
    commit(() => repository.setBuiltinHidden(lastHiddenId, false), "已撤销移除。");
    setLastHiddenId(null);
  };

  const hiddenQuestions = checkpoint.questions.filter((item) => item.hidden);
  const hiddenExercises = checkpoint.exercises.filter((item) => item.hidden);
  const listProps = {
    onEdit: edit,
    onHide: hide,
    onRestore: restore,
    onDelete: removeCustom,
    onDuplicate: duplicate,
    onMove: move,
  };

  return (
    <section className="demo-section" data-chapter-checkpoint={chapter} aria-labelledby={`chapter-${chapter}-checkpoint-title`}>
      <div className="demo-section-header">
        <h2 id={`chapter-${chapter}-checkpoint-title`} className="demo-section-title">🧭 {checkpoint.title} · 学习检查</h2>
        <p className="demo-section-desc">先独立回答，再回到对应 Demo 验证。题目可按你的学习需要编辑、隐藏、复制、排序或补充。</p>
      </div>

      {feedback ? (
        <div role="status" className="demo-alert demo-alert-info" style={{ margin: "0 0 12px" }}>
          <span>{feedback}</span>
          {lastHiddenId ? <>{" "}<button type="button" style={actionButtonStyle} onClick={undoHide}>撤销</button></> : null}
        </div>
      ) : null}

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip" style={{ margin: 0 }}>
          <div className="demo-alert-title">你现在应该能回答什么？</div>
          <ManagedList items={checkpoint.questions} hiddenItems={hiddenQuestions} {...listProps} />
        </div>

        <div className="demo-alert demo-alert-warning" style={{ margin: 0 }}>
          <div className="demo-alert-title">练习</div>
          <ManagedList items={checkpoint.exercises} hiddenItems={hiddenExercises} {...listProps} />
        </div>
      </div>

      <AddQuestionForm onAdd={add} />

      {integrationLab && (
        <div className="demo-alert demo-alert-info" data-integration-lab={integrationLab.id} style={{ margin: "16px 0 0" }}>
          <div className="demo-alert-title" id={`chapter-${chapter}-integration-lab-title`}>
            <span aria-hidden="true">🧪</span><span>{integrationLab.title}</span>
          </div>
          <p>{integrationLab.description}</p>
          {integrationLab.path && <p><strong>本章路径：</strong>{integrationLab.path}</p>}
          <div className="demo-grid-2" style={{ marginTop: 12 }}>
            <div><strong>Core Demo 教什么</strong><p>{integrationLab.coreDemo}</p></div>
            <div><strong>Real Lab 验证什么</strong><p>{integrationLab.realLab}</p></div>
          </div>
          <p style={{ marginBottom: 0 }}>
            <a href={integrationLab.repositoryUrl} target="_blank" rel="noreferrer">打开 Lab README / Source ↗</a>
            <span> · 运行命令：<code>{integrationLab.command}</code></span>
          </p>
        </div>
      )}

      {nextStep && (
        <div className="demo-alert demo-alert-success" data-chapter-next-step={chapter} style={{ margin: "16px 0 0" }}>
          <div className="demo-alert-title">➡️ 下一步</div>
          <p>{nextStep.understood} {nextStep.next}</p>
          <strong>{nextStep.target}</strong>
        </div>
      )}
    </section>
  );
}
