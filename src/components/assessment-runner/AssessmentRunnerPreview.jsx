import { useState } from "react";
import { AssessmentRunner } from "./AssessmentRunner.jsx";

const previewQuestions = [
  {
    id: "preview-derived-state",
    chapter: 3,
    kind: "question",
    prompt: "如何判断一个值应该成为 State，还是应该从现有 Props/State 派生计算？",
    origin: "builtin",
  },
  {
    id: "preview-state-ownership",
    chapter: 3,
    kind: "question",
    prompt: "受控组件与非受控组件的核心差异为什么是 State ownership？",
    origin: "builtin",
  },
  {
    id: "preview-refactor-state",
    chapter: 3,
    kind: "exercise",
    prompt: "找一个包含多个 boolean 状态的场景，说明可能出现的非法组合并给出重构方案。",
    origin: "builtin",
  },
];

export function AssessmentRunnerPreview() {
  const [handoff, setHandoff] = useState("");
  const [summary, setSummary] = useState("");

  return (
    <div>
      <AssessmentRunner
        chapter={3}
        title="Chapter 03 · Practice Preview"
        questions={previewQuestions}
        onAskAi={({ prompt }) => setHandoff(prompt)}
        onCopySummary={(markdown) => {
          setSummary(markdown);
          return true;
        }}
      />
      {handoff ? (
        <details className="assessment-runner" open>
          <summary>AI handoff preview</summary>
          <pre>{handoff}</pre>
        </details>
      ) : null}
      {summary ? (
        <details className="assessment-runner" open>
          <summary>Markdown summary preview</summary>
          <pre>{summary}</pre>
        </details>
      ) : null}
    </div>
  );
}

export default AssessmentRunnerPreview;
