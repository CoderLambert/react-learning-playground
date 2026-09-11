# Chapter 05-06 执行状态

工作分支：`learn/ch05-06-actions-concurrency`

## Chapter 05 — Forms 与 React 19 Actions

- [x] 05-01 Controlled Form 基础
  - 新增 `ControlledFormDemo.jsx`
  - 覆盖 input / textarea / select / checkbox / radio / submit
  - 展示受控 State 数据流、派生 validation、提交快照、reset
  - Demo 已注册到 `forms` 分类
  - CodeViewer 已通过 `ControlledFormDemo.jsx?raw` 注册
- [x] 05-02 FormData 与表单状态建模
  - 新增 `FormDataModelingDemo.jsx`
  - 对比“浏览器持有非受控字段 → submit 时读取快照”和“每个字段实时进入 React State”
  - 覆盖 `FormData.get()` / `getAll()` / `has()` 与领域 payload 类型转换
  - 明确实时联动/校验场景仍适合 controlled state
  - Demo 与 `?raw` CodeViewer 已注册
- [x] 05-03 `<form action>` / `formAction`
  - 新增 `FormActionDemo.jsx`
  - 可视化 submit → FormData → async Action / Transition → success reset
  - 用“发布 / 保存草稿”展示按钮级 `formAction` 覆盖父 form `action`
  - 明确函数 Action 与传统 `onSubmit + preventDefault` 的边界
  - Demo 与 `?raw` CodeViewer 已注册
- [x] 05-04 `useActionState` + `useFormStatus`
  - 新增 `ActionStateFormStatusDemo.jsx`
  - 展示 `previousState`、Action 返回结果、`isPending`
  - 子组件通过 `useFormStatus` 读取父 form 的 `pending` / `data`
  - 明确 `useFormStatus` 必须位于目标 form 的后代组件中
  - Demo 与 `?raw` CodeViewer 已注册
- [x] 05-05 `useOptimistic`
  - 新增 `OptimisticUpdateDemo.jsx`
  - 评论实验可观察 temporary optimistic UI → server success → canonical state 收敛
  - 可切换模拟服务器失败，观察 canonical state 未改变时 optimistic UI 自动回退
  - 明确 optimistic setter 必须在 Action / Transition 中调用
  - Demo 与 `?raw` CodeViewer 已注册

### Chapter 05 React 官方事实校准

1. 传统 `onSubmit` 在各 React 版本都可读取 `FormData`；函数 `action` 是 React 19 的 Action 提交模型，不是 `onSubmit` 的语法糖。
2. 函数传给 `<form action>` / `formAction` 时，React 会把提交放入 Transition，并把本次表单的 `FormData` 传给 Action；Action 成功后非受控字段会 reset。
3. `useActionState` 返回 `[state, dispatchAction, isPending]`；用于 `<form action={dispatchAction}>` 时 reducer Action 的第一个参数是 previous state，第二个参数才是 FormData。
4. `useFormStatus` 从它所在组件的父 `<form>` 获取最近提交状态，因此 Submit 子组件是典型使用位置。
5. `useOptimistic` 的 optimistic state 只在 Action pending 期间作为临时状态存在；Action 完成后重新以传入的 canonical value 为准，因此成功时应更新真实 state，失败时不更新真实 state即可回退。

### Chapter 05 Gate

- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run preview` smoke test: PENDING
- 内容任务：COMPLETE
- 章节状态：BLOCKED_ON_EXECUTABLE_GATE

Chapter 05 的 05-01 ~ 05-05 已全部实现，但按任务规则，在真实 lint/build/preview 结果出现前不标记 Chapter 05 为 PASS，也不进入 Chapter 06。

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

## 下一步

先执行 Chapter 05 强制质量门禁。只有 `npm run lint`、`npm run build` 与 `npm run preview` smoke test 全部获得真实 PASS 结果后，才进入 Chapter 06；若执行环境仍无法提供仓库工作树，则保持本章为 `BLOCKED_ON_EXECUTABLE_GATE`，不跨章继续。