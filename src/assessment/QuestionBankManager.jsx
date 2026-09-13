function CheckpointList({ title, items, kind }) {
  if (!items?.length) return null;

  return (
    <section aria-labelledby={`checkpoint-${kind}-title`}>
      <h3 id={`checkpoint-${kind}-title`}>{title}</h3>
      <ol style={{ display: "grid", gap: 10, paddingLeft: 24 }}>
        {items.map((item) => (
          <li key={item.id} data-checkpoint-item-id={item.id} data-checkpoint-item-kind={kind}>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * @deprecated Compatibility renderer for chapter checkpoint content.
 *
 * The former implementation was an editable localStorage-backed question bank
 * with its own practice runner. That created a second assessment source of
 * truth beside the Assessment Runtime (IndexedDB + AssessmentService).
 *
 * Keep this export temporarily because ChapterCheckpoint imports it, but make
 * the legacy checkpoint strictly read-only. New assessment authoring and
 * practice must go through the Assessment tab/runtime.
 */
export function QuestionBankManager({ chapter, checkpoint }) {
  return (
    <div data-legacy-checkpoint-readonly={chapter}>
      <div className="demo-alert demo-alert-info" role="note">
        <div className="demo-alert-title">章节学习检查（只读）</div>
        <p>
          这里保留本章的复习问题和练习提示，仅用于自检，不再维护独立题库或浏览器本地作答记录。
          可编辑评测题、AI 出题和正式作答统一使用右侧 Assessment 面板。
        </p>
      </div>

      <CheckpointList title="复习问题" items={checkpoint?.questions} kind="question" />
      <CheckpointList title="动手练习" items={checkpoint?.exercises} kind="exercise" />
    </div>
  );
}
