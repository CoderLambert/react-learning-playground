import { assertQuestionRecord } from "../domain/question.js";

const CANONICAL_CATALOG_VERSION = "2026-09-20";
const CANONICAL_TIMESTAMP = "2026-09-20T00:00:00.000Z";

function canonicalQuestion({ id, learningUnitId, type = "single_choice", content, difficulty, conceptTags, evidenceRefs = [] }) {
  const question = {
    id,
    learningUnitId,
    type,
    content,
    difficulty,
    conceptTags,
    evidenceRefs,
    status: "active",
    revision: 1,
    createdAt: CANONICAL_TIMESTAMP,
    updatedAt: CANONICAL_TIMESTAMP,
    provenance: {
      source: "canonical",
      catalogVersion: CANONICAL_CATALOG_VERSION,
    },
  };
  assertQuestionRecord(question);
  return Object.freeze(question);
}

const RENDERING_LISTS_KEY_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-rendering-lists-key-identity",
    learningUnitId: "rendering-lists-key",
    difficulty: "medium",
    conceptTags: ["key", "component-identity"],
    content: {
      prompt: "在可重排列表中，稳定 key 最核心的作用是什么？",
      options: [
        { id: "identity", text: "给同级元素提供稳定身份线索，让 React 在后续 render 中匹配同一个业务实体" },
        { id: "speed", text: "保证 map() 比普通 for 循环执行得更快" },
        { id: "prop", text: "把 key 自动作为 props.key 传给子组件" },
        { id: "warning", text: "只用于消除控制台 warning，不影响 State 保留" },
      ],
      correctOptionId: "identity",
      explanation: "key 的核心是 sibling 范围内的身份线索。React 会结合树中位置、组件类型和显式 key 判断组件身份是否延续；身份延续时，对应的局部 State 才能继续属于同一个业务实体。",
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-rendering-lists-key-reorder",
    learningUnitId: "rendering-lists-key",
    difficulty: "medium",
    conceptTags: ["key", "reorder", "local-state"],
    content: {
      prompt: "列表使用数组 index 作为 key。第一行输入了局部备注后把列表顺序反转，为什么备注可能显示在另一个任务旁边？",
      options: [
        { id: "position", text: "index 表示当前位置；重排后同一 index 对应了别的数据，而原位置组件的局部 State 仍可能被复用" },
        { id: "state-cleared", text: "React 会先清空所有行的 State，再随机恢复一部分" },
        { id: "input-bug", text: "因为受控 input 在数组中不能保存 State" },
        { id: "map-cache", text: "因为 map() 会缓存第一次遍历得到的数据" },
      ],
      correctOptionId: "position",
      explanation: "index key 把身份绑定到数组位置。reorder 后位置 0 可能已经是另一个业务实体，但 React 仍可能复用原来 key=0 的组件身份，因此该组件里的局部 State 看起来“跟错了任务”。",
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-rendering-lists-key-selection",
    learningUnitId: "rendering-lists-key",
    difficulty: "easy",
    conceptTags: ["key", "stable-id"],
    content: {
      prompt: "一个待办列表允许顶部插入、删除、排序，并且每行都有输入草稿。以下哪个值最适合作为 key？",
      options: [
        { id: "todo-id", text: "数据模型中创建后保持稳定的 todo.id" },
        { id: "index", text: "当前数组 index" },
        { id: "title", text: "用户可以随时编辑的 todo.title" },
        { id: "random", text: "每次 render 重新生成的随机 UUID" },
      ],
      correctOptionId: "todo-id",
      explanation: "key 应在同一业务实体生命周期内保持稳定。插入和排序会改变 index，可编辑 title 会变化，每次 render 生成的随机值更会强制产生新身份；稳定 todo.id 才符合身份语义。",
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
    ],
  }),
]);

const CANONICAL_QUESTIONS_BY_LEARNING_UNIT = Object.freeze({
  "rendering-lists-key": RENDERING_LISTS_KEY_QUESTIONS,
});

export function getCanonicalAssessmentQuestions(learningUnitId) {
  const questions = CANONICAL_QUESTIONS_BY_LEARNING_UNIT[learningUnitId] ?? [];
  return questions.map((question) => structuredClone(question));
}

export function hasCanonicalAssessmentQuestions(learningUnitId) {
  return (CANONICAL_QUESTIONS_BY_LEARNING_UNIT[learningUnitId]?.length ?? 0) > 0;
}
