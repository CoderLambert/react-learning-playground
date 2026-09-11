# React 全面学习大纲（React 19.x）

> 目标：不是记 API，而是建立 React 的完整心智模型，并能把它稳定地应用到真实项目。
>
> 设计原则：以 React 官方 Learn / Reference 为主线，结合真实前端项目中的高频问题、架构决策和工程能力。

## 优先级定义

- **P0：必须掌握** —— 日常 React 开发高频使用，不掌握会直接影响代码正确性。
- **P1：重点掌握** —— 中大型项目、复杂交互、性能与架构中经常出现。
- **P2：理解与按需掌握** —— 高级 API、框架能力、特定性能或基础设施场景。

---

# 0. JavaScript / TypeScript 前置能力

## P0 JavaScript

- 作用域、闭包、函数引用与值捕获
- 对象 / 数组解构，rest / spread
- `map` / `filter` / `reduce`
- 对象与数组的不可变更新
- ES Module：`import` / `export`
- Promise、`async/await`
- Event Loop、microtask / macrotask 基础
- 可选链、空值合并
- DOM 事件和浏览器 API 基础

## P1 TypeScript

- Props / State 类型设计
- 联合类型与 discriminated union
- 泛型组件 / 泛型 Hook
- `ReactNode`、事件类型、Ref 类型
- API 数据模型和领域类型建模

> React 中大量“难问题”实际上来自 JavaScript 的闭包、引用相等、异步和不可变数据理解不足。

---

# 1. UI 与组件模型

对应官方：**Describing the UI**。

## P0

### 1.1 Component

- 函数组件是什么
- Component 必须是纯函数的原因
- 组件命名与拆分边界
- Component Tree / Module Tree

### 1.2 JSX

- JSX 与 JavaScript 表达式
- `{}` 插值
- Fragment
- 属性命名差异（`className` 等）
- JSX 本质是 UI 描述，而不是 HTML 字符串

### 1.3 Props

- 父 → 子单向数据流
- Props 只读
- 解构与默认值
- 对象 / 数组 / 函数作为 Props
- callback props

### 1.4 Composition

- `children`
- slot / named slot 思想
- container / presentational composition
- 用组合优先于“大而全配置对象”

### 1.5 条件渲染

- `if`
- ternary
- `&&`
- 提前 return

### 1.6 列表与 key

- `map()`
- `key` 的真正作用：元素身份
- 为什么不建议把数组 index 当稳定 key
- key 与 State 保留 / 重置之间的关系

## P1

- Render Tree
- 组件 API 设计
- Compound Components 思想
- Headless Component 思想

---

# 2. 事件、State 与 React 渲染模型

对应官方：**Adding Interactivity**。

这是 React 最重要的一章。

## P0

### 2.1 Event Handler

- 事件函数传递 vs 调用
- event propagation
- `stopPropagation`
- `preventDefault`
- 事件逻辑与渲染逻辑分离

### 2.2 useState

- State 是组件的记忆
- State 与普通变量的区别
- State 属于组件实例 / 树位置

### 2.3 State as Snapshot

必须建立这个心智模型：

```text
一次 Render
   ↓
得到当前 State 的 Snapshot
   ↓
事件函数闭包读取这个 Snapshot
   ↓
setState 请求下一次 Render
```

理解：

- 为什么 `setState` 后当前变量不会马上变化
- stale closure 从哪里来
- 异步回调为什么会读到旧值

### 2.4 State Update Queue / Batching

- React 批处理更新
- `setCount(count + 1)`
- functional updater：`setCount(c => c + 1)`
- 多次 State 更新的执行顺序

### 2.5 对象 / 数组 State

- 不可直接 mutate
- shallow copy
- nested object 更新
- array append / delete / replace / sort

## P1

### 2.6 Render / Commit

理解三个阶段：

```text
Trigger → Render → Commit
```

需要知道：

- render 可以被再次执行
- render 必须保持纯净
- DOM 修改发生在 commit
- StrictMode 为什么能暴露非纯逻辑

---

# 3. State 建模与状态架构

对应官方：**Managing State**。

真实项目里，这部分比背 Hooks 更重要。

## P0

### 3.1 State Shape

- 合并相关 State
- 避免矛盾 State
- 避免冗余 State
- 避免 duplicate State
- 派生值优先计算而不是存 State

### 3.2 Single Source of Truth

- 数据由谁拥有
- 谁负责修改
- 谁只负责消费

### 3.3 Controlled / Uncontrolled

- 受控组件
- 非受控组件
- 表单输入
- 组件 API 的 controlled / uncontrolled 设计

### 3.4 Lifting State Up

- 找最近共同父节点
- sibling communication
- state ownership

### 3.5 Preserving / Resetting State

重点理解：

- State 与组件在树中的位置绑定
- component type
- position
- `key`

## P1

### 3.6 useReducer

- reducer 是纯函数
- action 描述“发生了什么”
- state transition
- 复杂状态逻辑集中管理
- discriminated union action（TypeScript）

### 3.7 Context

- Context 解决什么问题
- Context ≠ 全局状态管理器
- Provider value
- Context 更新造成的 re-render
- State / Dispatch Context 分离

### 3.8 Reducer + Context

适用于：

- 页面级复杂状态
- 中型业务模块
- 不想立即引入外部 Store 的场景

---

# 4. Ref、Effect 与 Escape Hatches

对应官方：**Escape Hatches**。

原则：大多数 React 数据流不应该依赖 Escape Hatch。

## P0

### 4.1 useRef

两类用途：

1. 保存不影响渲染的数据
2. 获取 DOM 节点

典型场景：

- timeout ID
- previous mutable value
- DOM focus / scroll / measurement
- 第三方库实例

### 4.2 Effect 的本质

不要把 Effect 理解成“生命周期函数”。

正确模型：

> Effect 用于让 React 组件与 React 之外的外部系统保持同步。

典型外部系统：

- DOM API
- WebSocket
- Event Listener
- timer
- third-party widget
- browser API

### 4.3 Setup / Cleanup

```text
setup
 ↓
同步外部系统
 ↓ dependency change
cleanup old
 ↓
setup new
 ↓ unmount
cleanup
```

### 4.4 Effect Dependencies

- reactive values
- dependency array 不是“控制运行次数”的配置
- stale closure
- exhaustive-deps
- 不要通过关闭 lint 来欺骗 React

### 4.5 You Might Not Need an Effect

重点反模式：

- 用 Effect 计算派生数据
- 用 Effect 响应用户点击
- props → state 无意义同步
- Effect chain
- 为了触发父组件回调而额外 Effect

## P1

### 4.6 Event vs Effect

判断标准：

- 用户做了某件事 → Event Handler
- 因组件当前状态需要与外部系统保持同步 → Effect

### 4.7 useEffectEvent（React 19.2）

掌握：

- reactive Effect 和 non-reactive Effect Event 的边界
- 在 Effect 中读取最新 Props / State
- 避免因为非响应式逻辑导致重新连接外部系统
- 不能拿它逃避真实依赖

### 4.8 Custom Hooks

- 复用状态逻辑，不是共享 State
- Hook Composition
- Effect 封装
- 自定义 Hook API 设计
- Rules of Hooks

## P2

- `useLayoutEffect`
- `useImperativeHandle`
- React 19 中 `ref` 直接作为 prop
- `forwardRef` 的历史用途及 React 19 的变化

---

# 5. 表单与 React 19 Actions

真实业务项目高频。

## P0

### 5.1 Form 基础

- controlled input
- textarea / select / checkbox / radio
- form submit
- FormData
- validation
- pending / disabled / error state

## P1 React 19

### 5.2 Form Actions

- `<form action={fn}>`
- `formAction`
- async action

### 5.3 useActionState

掌握：

- action result state
- pending state
- async mutation
- error handling
- 与表单结合

### 5.4 useFormStatus

- pending
- data
- submit button 状态

### 5.5 useOptimistic

典型场景：

- 点赞
- 评论
- Todo
- 购物车数量

重点不是 API，而是：

```text
Optimistic UI
→ server success
→ commit

Optimistic UI
→ server failure
→ rollback / error
```

---

# 6. 异步 UI、Suspense 与并发体验

## P1

### 6.1 lazy

- code splitting
- route/component lazy loading

### 6.2 Suspense

- Suspense boundary
- fallback
- nested Suspense
- loading UX
- Suspense 不等于“任意 fetch loading”

### 6.3 Error Boundary

- render error isolation
- fallback UI
- 与 lazy / Suspense 配合
- async event errors 与 render errors 的区别

### 6.4 useTransition / startTransition

理解：

- urgent update
- non-urgent transition
- pending UI
- 避免昂贵 UI 更新阻塞交互

### 6.5 useDeferredValue

典型场景：

- search input
- expensive result list
- stale content UI

### 6.6 `use`

React 19：

- 在 render 中读取 Promise / Context resource
- 与 Suspense 配合
- 不要在 render 中随意创建未缓存 Promise

---

# 7. 性能模型与优化

原则：**先定位问题，再优化。**

## P0

### 7.1 Re-render 心智

必须理解：

- 父组件 render 时子组件默认会 render
- render ≠ DOM 一定变化
- React 会在 commit 阶段最小化 DOM 更新

### 7.2 引用相等

- primitive vs object identity
- `{}` / `[]` / `() => {}` 每次 render 都是新引用
- dependency 和 memoization 为什么受引用影响

## P1

### 7.3 React DevTools Profiler

- 找慢组件
- render duration
- 为什么重新 render

### 7.4 memo

- 什么情况下有效
- props identity
- 不要默认所有组件都 memo

### 7.5 useMemo

用于：

- expensive calculation cache
- 必须保持稳定引用的特定场景

不是：

- 所有计算
- correctness 工具

### 7.6 useCallback

主要用于保持函数引用稳定，通常和：

- memo child
- dependency identity

配合。

### 7.7 React Compiler

React 当前方向：自动进行大量 memoization。

需要理解：

- Compiler 解决什么问题
- Rules of React 为什么重要
- 新代码优先依赖 Compiler 的自动优化
- `useMemo` / `useCallback` 仍可用于需要精确控制的场景

## P2

- large list virtualization
- bundle analysis
- code splitting strategy
- performance budget

---

# 8. 外部 Store 与第三方系统集成

## P1

### 8.1 useSyncExternalStore

理解：

- React state 与 external store 的区别
- subscribe
- getSnapshot
- browser external state

第三方 Store 库通常会解决类似的订阅问题。

### 8.2 Portal

- modal
- tooltip
- popover
- DOM tree 与 React tree 的区别

### 8.3 第三方 DOM Library

例如图表、地图、编辑器：

```text
ref
+ effect
+ cleanup
```

### 8.4 常见外部状态方案

按需求理解，而不是全部学习：

- Zustand
- Redux Toolkit
- Jotai

重点是判断：什么时候 React 自带 State / Reducer / Context 已经足够。

---

# 9. Server State 与请求架构

这不是 React Core，但是真实项目必修。

## P0

必须区分：

```text
Client State
vs
Server State
```

Server State 需要处理：

- loading
- error
- cache
- stale
- refetch
- retry
- request dedupe
- race condition
- cancellation
- pagination
- optimistic mutation

## P1

学习一种成熟方案：

- TanStack Query（推荐作为学习代表）

理解：

- query key
- staleTime
- cache
- invalidation
- mutation
- optimistic update

不要用一堆 `useEffect + fetch + loading + error` 重造完整数据层。

---

# 10. Router 与页面架构

React 本身不是 Router。

## P0 / P1

建议学习 React Router：

- nested routes
- layout routes
- route params
- search params
- navigation
- 404
- protected route 思维
- loader / action（框架模式按需深入）

理解 URL 本身就是应用状态的一部分。

---

# 11. 项目组件架构

## P1

### 11.1 Component 分层

一种实用理解：

```text
Page
 ↓
Feature
 ↓
UI Component
 ↓
Primitive
```

### 11.2 状态位置选择

优先顺序通常可以理解为：

```text
Local State
  ↓
Lift State
  ↓
Context / Reducer
  ↓
External Client Store
```

Server 数据则进入 Server State 层，而不是强行塞进 Context。

### 11.3 Custom Hook 分层

例如：

```text
useUserProfile
useSearchProducts
useMediaQuery
useDebouncedValue
```

Hook 名应表达业务或平台能力，而不是实现细节。

### 11.4 API Layer

- fetch client
- request interceptor
- error normalization
- domain API
- UI 不直接散落 HTTP 细节

---

# 12. TypeScript + React 工程实践

## P1

- Component Props interface/type
- children 类型
- event handler 类型
- Ref 类型
- reducer action union
- generic component
- generic hook
- API DTO vs domain model
- 避免滥用 `any`

目标不是“所有地方写类型”，而是让组件 contract 清晰。

---

# 13. 测试

## P1

推荐学习三个层次：

### Unit / Component

- Vitest
- React Testing Library

重点：

- 测用户行为
- 不测试实现细节

### Integration

测试：

```text
用户操作
→ State 更新
→ API mock
→ UI 变化
```

### E2E

- Playwright

测试关键业务路径。

---

# 14. 可访问性与真实 UI 质量

## P1

- semantic HTML
- label / input
- keyboard interaction
- focus management
- ARIA 基础
- Modal focus trap
- loading / error / empty states

React 项目不能只保证“能点”。

---

# 15. React 框架、SSR 与 Server Components

官方目前推荐生产新项目优先考虑 React Framework；Vite 仍非常适合学习 React 基础和自定义 SPA。

## P2

在 React Core 扎实后再学：

- CSR
- SPA
- SSG
- SSR
- hydration
- streaming
- React Server Components
- Server Functions / Actions
- client / server boundary

可选择一个框架深入：

- React Router Framework Mode
- Next.js App Router

不要在还没有掌握 State / Effect / Render Model 时直接用 Server Components 掩盖核心概念。

---

# 16. React 高级 API：按需掌握

## P2

- `useId`
- `useImperativeHandle`
- `useLayoutEffect`
- `useInsertionEffect`（主要库作者）
- `useSyncExternalStore`
- `createPortal`
- `flushSync`
- `<Profiler>`
- `StrictMode`

目标是知道它们解决什么问题，不要求日常主动使用。

---

# 17. 必须能够识别的 React 常见错误模式

做到看到代码就能判断风险：

- render 中执行副作用
- mutate Props / State
- derived state 重复存储
- index 作为不稳定 key
- 随意把所有逻辑塞进 Effect
- suppress exhaustive-deps
- stale closure
- Effect 无限循环
- Context value 每次构造巨大对象
- premature memoization
- 把 Server State 当 Client Global State
- 组件职责过大
- Custom Hook 过度抽象
- 忽略请求 race condition
- 缺少 cleanup
- 用 `dangerouslySetInnerHTML` 渲染未经处理的用户内容

---

# 推荐学习顺序

```text
JavaScript 基础
      ↓
JSX / Component / Props / Children
      ↓
Conditional Rendering / List / Key
      ↓
Event / useState
      ↓
State Snapshot / Queue / Batching
      ↓
Object & Array State
      ↓
State Modeling / Controlled Components
      ↓
Lifting State / Preserve & Reset State
      ↓
useReducer / Context
      ↓
useRef
      ↓
Effect / Cleanup / Dependency
      ↓
You Might Not Need Effect
      ↓
Event vs Effect / useEffectEvent
      ↓
Custom Hooks
      ↓
Forms / Actions / Optimistic UI
      ↓
Suspense / Transition / Deferred UI
      ↓
Performance / Profiler / Compiler
      ↓
Router / Server State / Project Architecture
      ↓
Testing / Accessibility / TypeScript
      ↓
SSR / RSC / Framework
```

---

# 对当前 react-learning-playground 的建议内容分类

最终建议把学习网站扩展为以下目录，而不是单纯按 Hook 名称分类：

```text
01 React UI 基础
02 React 渲染与交互模型
03 State 建模与架构
04 Ref / Effect / Escape Hatches
05 Forms 与 React 19 Actions
06 Suspense 与并发 UI
07 React 性能与 Compiler
08 Router 与真实页面模型
09 Server State 与数据请求
10 项目架构与工程实践
11 Testing / Accessibility
12 SSR / RSC / Advanced
```

每一个 Demo 最好回答五件事：

1. **它解决什么问题？**
2. **React 的核心心智模型是什么？**
3. **错误写法为什么错？**
4. **真实项目什么时候用？**
5. **什么时候不应该用？**

对于难以观察的机制，Demo 优先把运行过程可视化，例如：

```text
Render 次数
State Snapshot
Update Queue
Effect Setup / Cleanup
Context Re-render
Memo 命中 / 未命中
Transition pending
Suspense boundary
Optimistic rollback
Request race
```

这样整个仓库会从“React API 示例集合”逐渐变成“React 心智模型实验室”。

---

# 官方文档主线

- React Learn — Describing the UI: https://react.dev/learn/describing-the-ui
- React Learn — Adding Interactivity: https://react.dev/learn/adding-interactivity
- React Learn — Managing State: https://react.dev/learn/managing-state
- React Learn — Escape Hatches: https://react.dev/learn/escape-hatches
- React Hooks Reference: https://react.dev/reference/react/hooks
- React DOM Hooks: https://react.dev/reference/react-dom/hooks
- React Compiler: https://react.dev/learn/react-compiler
- Creating a React App: https://react.dev/learn/creating-a-react-app

