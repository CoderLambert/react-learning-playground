# React 全面学习任务执行说明

> 工作分支：`roadmap/react-complete-learning-clean`
>
> 目标：按照当前 React 学习实验室的既有模式，逐个补齐 React 核心知识、React 19.x 能力以及真实项目高频工程知识。每个知识点都要求“能解释、能实验、能观察、能查看源码”，不是只罗列 API。

---

## 1. 执行原则

### 1.1 内容依据

每个任务实现前，按以下优先级确认结论：

1. React 官方 Learn / Reference（第一事实来源）
2. 当前仓库使用的 React 版本与行为
3. 真实业务项目中的高频使用场景
4. 第三方库官方文档（仅 Router、Server State、Testing 等非 React Core 章节）

禁止直接照搬旧版 React 18 教程中的历史最佳实践。涉及 React 19 行为变化时，需要在 Demo 中明确说明当前版本与历史差异。

### 1.2 每个知识点的固定产出模式

每个新 Demo 默认遵循当前仓库风格：

```text
知识点标题 / 心智模型
        ↓
为什么存在 / 解决什么问题
        ↓
最小可交互实验
        ↓
可观察运行结果
        ↓
正确做法 vs 常见反模式
        ↓
真实项目使用边界
        ↓
源码实现 CodeViewer
```

原则：优先把 React 中“看不见的行为”可视化，例如 Render 次数、State Snapshot、Update Queue、Effect Setup/Cleanup、Context 更新、memo 命中、Transition Pending、Suspense Boundary、Optimistic Rollback、请求竞态等。

### 1.3 Demo 文件规范

默认约定：

- 页面 Demo：`src/demos/XxxDemo.jsx`
- 可复用业务组件：`src/components/Xxx.jsx`
- 自定义 Hook：`src/hooks/useXxx.js`
- Demo 统一注册：`src/demos/index.js`
- Demo 使用到的关键源码必须通过 `?raw` 注册到 `files`，让 `CodeViewer` 可以直接查看
- 新 Demo 的样式优先使用 Tailwind utilities；可复用的通用交互或展示元素优先复用 `src/components/ui/**` 的 copy-owned primitives
- `.demo-header-card`、`.demo-section`、`.demo-alert`、`.badge`、`.btn` 等既有 CSS class 仅用于未触及的 legacy surface 或兼容已有 Demo，不是新 UI 的默认方案
- 没有必要时不要新增全局 CSS；第三方覆盖、Shiki/editor、print、复杂 pseudo-element 和 legacy shell 是允许的 CSS 例外
- Demo 必须可以独立运行，不依赖用户按照特定顺序操作其他 Demo

### 1.4 单个任务 Definition of Done

一个知识点只有同时满足以下条件才算完成：

- [ ] 概念与 React 官方当前文档一致
- [ ] 明确解释“为什么需要它”，而不只是 API 语法
- [ ] 至少有一个可以实际操作的实验，或一个明确可观察的运行过程
- [ ] 包含至少一个真实项目场景
- [ ] 对容易误用的 API 给出反模式或边界说明
- [ ] Demo 已注册到正确分类
- [ ] CodeViewer 能看到该知识点的关键源文件
- [ ] 浏览器控制台无新增错误
- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过

---

## 2. 每章强制质量门禁

**每一章结束后必须停下来验证，不能连续跨章堆代码。**

执行顺序：

```bash
npm install          # 仅首次或依赖变化后需要
npm run lint
npm run build
npm run preview      # 做章节级人工 smoke test
```

章节完成验收：

- [ ] `npm run lint` 零错误
- [ ] `npm run build` 成功生成 `dist`
- [ ] 单篇聚焦模式可以打开本章所有 Demo
- [ ] 连续阅读模式可以完整渲染本章所有 Demo
- [ ] 左侧搜索可以搜索到新增知识点
- [ ] CodeViewer 展开、文件切换、复制功能正常
- [ ] 所有按钮、输入框、切换器均无明显运行时异常
- [ ] 浏览器 Console 无 React warning / error
- [ ] 移动端窄屏至少做一次基础检查
- [ ] 完成后单独提交一个 chapter commit

建议章节提交格式：

```text
feat(chapter-02): complete React render and state model demos
```

如果 `lint` 或 `build` 不通过，本章状态保持“进行中”，不得进入下一章。

---

# 3. 任务总表

状态定义：

- `DONE`：仓库已有较完整 Demo，可后续只做校对
- `REVIEW`：已有相关内容，但需要按本任务目标检查是否覆盖完整
- `TODO`：需要新增

---

# Chapter 01 — UI 与组件模型

目标：完整掌握 React 如何“描述 UI”，建立 Component / JSX / Props / Composition / key 的基础模型。

## 01-01 Component + JSX + Pure Render — TODO

需要覆盖：

- 函数组件是什么
- JSX 与 JavaScript 表达式
- Fragment
- Component Tree / Module Tree
- Render 必须纯净
- 相同输入应产生相同 JSX 描述

建议实验：在 render 中执行副作用 vs 纯计算，对比 StrictMode 下异常行为。

## 01-02 Props 基础与只读数据流 — DONE

现有：`PropsBasicsDemo.jsx`

复查重点：Props readonly、默认值、解构、对象 / 函数 Props、派生值。

## 01-03 Children 默认插槽与 Composition — DONE

现有：`ChildrenSlotDemo.jsx`

## 01-04 Named Slots / 组件组合 API — DONE

现有：`MultiSlotsDemo.jsx`

## 01-05 Conditional Rendering — TODO

需要覆盖：

- `if`
- ternary
- `&&`
- early return
- `null`
- 避免复杂 JSX 条件嵌套

建议实验：同一个业务状态映射 loading / empty / error / success 四种 UI。

## 01-06 Rendering Lists + key 身份模型 — TODO

重点不是 `map()`，而是：

- `key` 用于元素身份
- index key 的风险
- 插入 / 删除 / 排序后的状态错位
- stable id

建议实验：可编辑 Todo 列表，分别使用 index key 与 id key，动态排序后观察输入 State 是否“跟错行”。

## 01-07 Prop Drilling 与 Composition / Context 边界 — REVIEW

现有：`PropDrillingDemo.jsx`

复查重点：不要把“出现两层 props”就定义为 prop drilling；优先判断组件 API 和数据所有权。

### Chapter 01 Gate

完成 `01-*` 后执行完整 `lint + build + preview`，通过后才能进入 Chapter 02。

---

# Chapter 02 — 事件、State 与 React 渲染模型

目标：这是 React Core 最重要的一章。重点理解 React “什么时候读取 State、什么时候重新 Render、更新如何排队”。

## 02-01 Event Handler 与事件传播 — TODO

覆盖：

- 传函数 vs 调函数
- bubbling / capture 基础
- `stopPropagation`
- `preventDefault`
- 事件逻辑应放 Event Handler，而不是为了响应点击写 Effect

## 02-02 useState 基础与 State 属于组件位置 — TODO

覆盖：

- 普通变量 vs State
- setter 触发下一次 render
- State 与组件树位置绑定

## 02-03 State as Snapshot — TODO / 核心

建议做成强可视化实验：

```text
Render #1 state=0
→ 创建 handleClick（捕获 0）
→ setState
→ 当前 handler 中仍然读取 0
→ Render #2 state=1
```

同时演示 `setTimeout` 中 stale snapshot。

## 02-04 Update Queue + Batching + Functional Updater — TODO / 核心

对比：

```js
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
```

和：

```js
setCount(c => c + 1)
setCount(c => c + 1)
setCount(c => c + 1)
```

页面显示 Update Queue 执行过程。

## 02-05 Object / Array State 不可变更新 — TODO

覆盖：

- mutation 为什么危险
- shallow copy
- nested object
- append / remove / replace / sort
- 引用变化

## 02-06 Trigger → Render → Commit — TODO

可视化：

```text
Trigger
→ Render Phase
→ Commit Phase
→ Browser Paint
```

明确：render ≠ DOM 一定改变。

### Chapter 02 Gate

完成后必须验证所有批处理、异步 timer、快速连续点击场景，无 React warning，再执行 `lint + build + preview`。

---

# Chapter 03 — State 建模与状态架构

目标：能够判断“什么应该成为 State、State 放在哪里、谁拥有它”。

## 03-01 State DRY / Single Source of Truth — DONE

现有：`StateDryDemo.jsx`

## 03-02 Choosing State Structure — REVIEW

检查是否完整覆盖：

- redundant state
- contradictory state
- duplicate state
- deeply nested state
- derived data

若现有 DRY Demo 不足，补充到现有 Demo，不为了拆任务机械创建新页面。

## 03-03 Controlled / Uncontrolled Component — TODO

重点不仅是 `<input>`，还要讲组件 API：

```jsx
<Tabs value={active} onChange={...} />
<Tabs defaultValue="home" />
```

## 03-04 Lifting State Up — DONE

现有：`LiftingStateUpDemo.jsx`

## 03-05 Preserving / Resetting State + key — TODO / 核心

覆盖：

- State 与树位置关联
- same position + same component type
- 更换 component type
- 使用 `key` 主动 reset State

建议实验：聊天窗口切换联系人，演示“不 reset 导致草稿串用户”和使用 key 后的行为。

## 03-06 useReducer — DONE

现有：`StateReducerDemo.jsx`

## 03-07 Context — REVIEW

现有内容分散在 PropDrilling / Reducer + Context 中。

检查是否需要单独补一个“Context 更新传播模型”实验。

## 03-08 Reducer + Context — DONE

现有：`UseReduceWithContextDemo.jsx`

复查：不要宣称“拆 State / Dispatch Context 就彻底规避所有无效重新渲染”；需要准确解释各消费节点的更新边界。

### Chapter 03 Gate

重点检查 State reset、Context re-render 与 reducer dispatch。全部通过 `lint + build + preview` 后提交章节 commit。

---

# Chapter 04 — Ref、Effect 与 Escape Hatches

目标：建立“Effect 是外部系统同步机制，不是业务流程编排工具”的稳定心智模型。

## 04-01 useRef — DONE

现有：`UseRefDemo.jsx`

## 04-02 useEffect 正确心智 + Cleanup — DONE

现有：`UseEffectCorrectUsageDemo.jsx`

## 04-03 You Might Not Need an Effect — DONE

现有：`NotNeedEffectDemo.jsx`

## 04-04 Effect Lifecycle / Dependencies — DONE

现有：`LifecycleOfReactiveEffectsDemo.jsx`

## 04-05 Event vs Effect — TODO

建议场景：购买按钮点击后发送请求，不应该通过 `isBuying` State + Effect 间接触发；对比用户事件与状态同步。

## 04-06 useEffectEvent — TODO / React 19.x

重点：

- 读取最新 committed props/state
- non-reactive logic
- 避免因为 theme 等无关变化重连 WebSocket
- 不能用来逃避真实 Effect dependencies

## 04-07 Custom Hooks — TODO

目标：

- 复用 stateful logic，不共享 State
- Hook Composition
- 封装 Effect
- 抽象边界
- Rules of Hooks

建议实验：`useCounter` + `useDebouncedValue` 或 `useOnlineStatus`。

## 04-08 useLayoutEffect / useImperativeHandle / ref as prop — TODO / P2

做一个综合高级 Ref Demo 即可，不要拆成多个低价值页面。

### Chapter 04 Gate

重点检查 Effect cleanup：切换 Demo、挂载/卸载、连续切换依赖后，不得残留重复 timer/listener。执行 `lint + build + preview`。

---

# Chapter 05 — Forms 与 React 19 Actions

目标：覆盖真实 CRUD 项目高频表单与 mutation 流程。

## 05-01 Controlled Form 基础 — TODO

覆盖 input / textarea / select / checkbox / radio / submit / validation。

## 05-02 FormData 与表单状态建模 — TODO

实验：注册表单，演示 field state、form state、error state 不应重复存储。

## 05-03 `<form action>` / `formAction` — TODO

结合 React 19 Action 心智模型。

## 05-04 useActionState + useFormStatus — TODO

可做成一个完整提交实验：pending / success / server error。

## 05-05 useOptimistic — TODO

建议：评论、Todo 或购物车。

必须演示：

```text
optimistic update
→ request success → confirm
→ request failure → rollback/error
```

### Chapter 05 Gate

需要覆盖成功、失败、重复提交、pending 状态；然后 `lint + build + preview`。

---

# Chapter 06 — Suspense 与并发 UI

## 06-01 lazy + Suspense + Code Splitting — TODO

实验中明确展示 chunk 首次加载和 fallback。

## 06-02 Suspense Boundary / Nested Boundary — TODO

重点讲 UX boundary，不把 Suspense 简化成 loading spinner API。

## 06-03 Error Boundary — TODO

覆盖 render error、lazy load error，与 event handler error 的差异。

## 06-04 useTransition / startTransition — TODO

实验：大数据列表筛选；输入保持 urgent，结果区域作为 transition。

## 06-05 useDeferredValue — TODO

同一实验中对比 debounce：

- deferred value = React 调度
- debounce = 时间策略

## 06-06 React 19 `use` — TODO / P1

与 Suspense 配合展示；避免在 render 中随意创建未缓存 Promise。

### Chapter 06 Gate

人为制造慢渲染与 error 场景，检查 fallback / pending / recovery 后执行 `lint + build + preview`。

---

# Chapter 07 — 性能模型与 React Compiler

目标：禁止形成“看到 re-render 就 memo”的错误性能观。

## 07-01 Re-render ≠ DOM Update — TODO / 核心

可视化 render count 与 DOM 实际变化。

## 07-02 Reference Equality — TODO

对象、数组、函数每次 render 的引用身份；解释 dependency / memo 的基础。

## 07-03 React.memo — TODO

展示 memo 命中与因为新对象 / 新函数引用失效。

## 07-04 useMemo — TODO

展示 expensive calculation；同时展示不值得 memo 的廉价计算。

## 07-05 useCallback — TODO

只在需要保持函数 identity 的场景讲解，并和 memo child 联动。

## 07-06 Profiler — TODO

指导如何用 React DevTools Profiler 定位实际慢点；页面可提供模拟重组件。

## 07-07 React Compiler — TODO / 当前 React 方向

以概念与可观察示例为主：

- automatic memoization
- Rules of React
- manual memoization 的角色变化
- 不要为了教学强行引入不稳定 compiler 配置；若项目未启用 Compiler，明确标注“概念实验”。

### Chapter 07 Gate

性能 Demo 必须确认不会因为 instrumentation 自身制造无限 render。执行 `lint + build + preview`。

---

# Chapter 08 — 外部 Store 与第三方系统

## 08-01 Portal — TODO

Modal / Tooltip；强调 React Tree 与 DOM Tree 不同。

## 08-02 useSyncExternalStore — TODO

手写最小 external store：`subscribe + getSnapshot`。

## 08-03 Third-party DOM Integration — TODO

模拟图表 / 地图 / 编辑器生命周期：`ref + effect + cleanup`。

## 08-04 外部 Client Store 边界 — TODO

以 Zustand / Redux Toolkit 为案例做“什么时候需要 Store”的架构说明。

此任务不要求一次同时引入多个 Store 库；优先讲边界，确需代码实验时只选一个。

### Chapter 08 Gate

重点验证订阅是否在卸载后正确取消，执行 `lint + build + preview`。

---

# Chapter 09 — Server State 与请求架构

目标：不再把所有远程数据都写成 `useEffect + fetch`。

## 09-01 Client State vs Server State — TODO

建立 cache / stale / refetch / ownership 区别。

## 09-02 原生请求生命周期与 Race Condition — TODO / 核心

实验：快速切换 userId，旧请求晚返回覆盖新请求。

必须展示正确处理：AbortController 或 ignore/cancellation strategy。

## 09-03 Loading / Error / Empty / Success 状态 — TODO

覆盖重试和错误恢复。

## 09-04 TanStack Query Core Model — TODO / 项目重点

如决定引入依赖，只在本任务开始时增加：

- queryKey
- cache
- staleTime
- refetch
- dedupe
- invalidation

## 09-05 Mutation + Optimistic Update — TODO

与 React `useOptimistic` 做职责对比：UI optimistic state vs server cache mutation lifecycle。

## 09-06 Pagination / Infinite Query — TODO / P1

作为本章最后一个完整业务场景。

### Chapter 09 Gate

必须模拟慢请求、失败、快速切换、重复请求。确认无明显竞态后执行 `lint + build + preview`。

---

# Chapter 10 — Router 与页面状态

## 10-01 React Router 基础 — TODO

Route / Link / Navigate / 404。

## 10-02 Nested Route + Layout — TODO

## 10-03 Params / Search Params — TODO

重点：URL 是可分享、可恢复的 Application State。

## 10-04 Route Lazy / Loading / Error — TODO

结合 Chapter 06。

## 10-05 Auth / Protected Route 边界 — TODO

强调前端 route guard 不是服务端授权。

> Router Demo 应保持在实验区域内部，除非明确决定把整个学习站点迁移到 Router，不要为了教学破坏现有 App Shell。

### Chapter 10 Gate

刷新、前进后退、直接 URL 访问、错误路由都需要 smoke test，然后执行 `lint + build + preview`。

---

# Chapter 11 — TypeScript、Testing 与 Accessibility

## 11-01 React + TypeScript — TODO

不要求立即把整个仓库迁移 TS。

先做独立示例覆盖：

- Props
- event
- ref
- reducer action discriminated union
- generic component / hook

## 11-02 Vitest + React Testing Library — TODO

至少给几个既有 Demo 增加行为测试，重点测试用户可观察行为而非内部实现。

## 11-03 Effect / Timer Test — TODO

Fake timer / cleanup / async state。

## 11-04 Playwright Smoke Test — TODO / P1

覆盖学习站点关键路径：

```text
打开站点
→ 选择 Demo
→ 操作实验
→ 展开源码
→ 切换连续阅读
```

## 11-05 Accessibility — TODO / P1

覆盖：semantic HTML、label、keyboard、focus、ARIA、modal focus management。

### Chapter 11 Gate

如果本章已经建立 test scripts，则章节门禁升级为：

```bash
npm run lint
npm run test
npm run build
```

若增加 E2E，则补：

```bash
npm run test:e2e
```

所有测试通过才算章节完成。

---

# Chapter 12 — SSR / Hydration / RSC / Framework 边界

此章是“理解现代 React 全貌”，不要求把当前 Vite SPA 改造成 Next.js。

## 12-01 CSR / SSR / SSG / Hydration — TODO

用架构图和最小示例解释职责。

## 12-02 Hydration Mismatch — TODO

展示服务端 / 客户端输出不一致为什么出问题。

## 12-03 Streaming + Suspense — TODO / P2

## 12-04 React Server Components — TODO / P2

重点：Server / Client Boundary、数据访问位置、bundle 边界。

## 12-05 Framework Selection — TODO

比较 Vite SPA、React Router Framework、Next.js 等应用模型，不做营销式结论，按需求判断。

### Chapter 12 Gate

如果示例在当前 SPA 内完成，执行 `lint + build + preview`；若建立独立最小 SSR/RSC 子项目，该子项目必须有自己的 build 验证命令，并在任务说明中记录。

---

# 4. 推荐实施顺序

严格按以下顺序推进，不建议跳着补 API：

```text
Chapter 01 UI / Component
        ↓
Chapter 02 Render / State Core
        ↓
Chapter 03 State Architecture
        ↓
Chapter 04 Effect / Escape Hatches
        ↓
Chapter 05 Forms / Actions
        ↓
Chapter 06 Suspense / Concurrency
        ↓
Chapter 07 Performance / Compiler
        ↓
Chapter 08 External Systems
        ↓
Chapter 09 Server State
        ↓
Chapter 10 Router
        ↓
Chapter 11 TS / Test / A11y
        ↓
Chapter 12 SSR / RSC / Framework
```

如果目标是尽快提升日常项目能力，完成 Chapter 01–05 后，可以优先做 Chapter 09–11，再返回 Chapter 06–08。

---

# 5. 每次开始一个任务时的标准工作流

以后执行任一 `XX-YY` 任务，都按以下步骤：

```text
1. 阅读 React 官方对应章节
2. 检查仓库已有 Demo 是否重复
3. 写一句该知识点的核心心智模型
4. 设计一个可以证明该模型的实验
5. 实现 Demo
6. 加真实项目使用场景
7. 加反模式 / 使用边界
8. 注册到 demos/index.js
9. 注册 CodeViewer 源码文件
10. 手工操作实验
11. npm run lint
12. npm run build
13. 单任务 commit
```

一个任务尽量只解决一个核心问题。如果一个 Demo 能自然覆盖两个高度相关的 API（例如 `useActionState + useFormStatus`），允许合并，不为任务数量强行拆页面。

---

# 6. 每章完成后的记录模板

每完成一章，在 commit / PR 描述中记录：

```md
## Chapter XX 完成情况

### 新增
- XX-01 ...
- XX-02 ...

### 修订
- ...

### Validation
- npm run lint: PASS
- npm run build: PASS
- npm run test: PASS / N/A
- npm run test:e2e: PASS / N/A
- Manual smoke test: PASS

### Known limitations
- 无 / ...
```

不要写“应该可以编译”“理论上没有问题”。只有实际执行过才能记录 `PASS`。

---

# 7. 整体完成标准

整个 React 学习计划完成时，应具备：

- React 官方 Learn 四大主线完整覆盖
- React 19.x 重要新增能力有独立实验
- 能解释 Render / State / Effect 三个最核心的运行模型
- 能正确进行 State ownership 与组件 API 设计
- 能处理真实表单、异步请求、缓存、竞态、错误和 optimistic UI
- 能定位而不是盲目处理 re-render 性能问题
- 能使用 Router 构建页面模型
- 至少掌握一种成熟 Server State 方案
- 有 TypeScript / unit / integration / E2E 基础
- 知道 SPA、SSR、RSC 的边界和选择依据
- 所有章节最终均通过对应的 lint / test / build 门禁

完成后的目标不是“知道 React 有哪些 Hook”，而是能面对一个真实 UI 需求，判断组件边界、State 所有权、同步方式、异步策略和性能成本，并能解释为什么这样设计。
