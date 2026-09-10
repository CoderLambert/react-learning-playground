# Chapter 05-06 执行状态

工作分支：`learn/ch05-06-actions-concurrency`

## Chapter 05 — Forms 与 React 19 Actions

- [x] 05-01 Controlled Form 基础
  - 新增 `ControlledFormDemo.jsx`
  - 覆盖 input / textarea / select / checkbox / radio / submit
  - 展示受控 State 数据流、派生 validation、提交快照、reset
  - Demo 已注册到 `forms` 分类
  - CodeViewer 已通过 `ControlledFormDemo.jsx?raw` 注册
  - React 官方校准：受控字段的 `value` / `checked` 由 React State 驱动；表单 Action 是后续 React 19 mutation 模型，不与传统 `onSubmit` 混为一谈。
- [ ] 05-02 FormData 与表单状态建模
- [ ] 05-03 `<form action>` / `formAction`
- [ ] 05-04 `useActionState` + `useFormStatus`
- [ ] 05-05 `useOptimistic`

### Chapter 05 Gate

- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run preview` smoke test: PENDING

只有 05-02 ~ 05-05 完成后才执行并记录章节 Gate；Gate 未 PASS 前不得标记 Chapter 05 完成。

## Chapter 06 — Suspense 与并发 UI

- [ ] 06-01 lazy + Suspense + Code Splitting
- [ ] 06-02 Suspense Boundary / Nested Suspense
- [ ] 06-03 Error Boundary
- [ ] 06-04 useTransition / startTransition
- [ ] 06-05 useDeferredValue
- [ ] 06-06 React 19 `use`

### Chapter 06 Gate

- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run preview` smoke test: PENDING

## 本轮 React 官方事实校准

1. React 19 的 `<form action={fn}>` 会把提交作为 Action / Transition 处理，并把 `FormData` 传给函数；成功后非受控字段会自动 reset。
2. `useActionState` 返回当前 Action state、dispatch Action 和 pending 状态；与 `<form action>` 结合时提交自动处于 Transition 中。
3. `useFormStatus` 必须在目标 `<form>` 的后代组件中调用，才能读取该父表单的 pending / data 等状态。
4. `useOptimistic` 用于后台操作期间立即显示预期结果；后续 Demo 必须覆盖成功确认与失败回退/错误两个路径。

## 下一步

实现 05-02 `FormData 与表单状态建模`，随后进入 React 19 `<form action>`，避免把传统受控表单、原生 FormData 和 Action 状态混成一个超大 Demo。
