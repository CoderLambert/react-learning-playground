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
 * Render chapter review prompts as read-only learning content.
 *
 * Chapter checkpoints are study prompts, not Assessment authoring or practice.
 * Formal assessment data and answer persistence remain owned by the Assessment
 * Runtime; this renderer deliberately has no state or storage dependency.
 */
export function ReadOnlyChapterCheckpoint({ chapter, checkpoint }) {
  return (
    <div data-readonly-checkpoint={chapter}>
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
