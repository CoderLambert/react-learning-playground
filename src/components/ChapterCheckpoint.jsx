const CHECKPOINTS = {
  1: {
    title: "Chapter 01 · UI 与组件模型",
    questions: [
      "为什么 React 要求组件 Render 保持纯净？StrictMode 为什么更容易暴露非纯逻辑？",
      "Props 的只读约束与单向数据流分别解决什么问题？什么时候 callback prop 比把 State 下放更合适？",
      "children / named slot 与“大而全配置对象”相比，什么时候组合 API 更容易维护？",
      "为什么稳定 key 影响的是组件身份，而不只是列表渲染性能？排序后使用 index key 可能出现什么错位？",
      "当组件出现多层 Props 传递时，如何判断应该继续透传、改用 Composition，还是引入 Context？",
    ],
    exercises: [
      "把一个同时负责数据判断、布局和操作按钮的卡片拆成 2–3 个可组合组件；要求不新增全局 State，并说明每个组件的最小 Props contract。",
      "实现一个可编辑列表，先用 index 作为 key，再切换为稳定 id；在插入、删除、排序后记录输入框局部 State 的差异。",
      "选择现有一个条件分支较多的 Demo，把 loading / empty / error / success 重构成更易读的 early-return 或局部组件结构。",
    ],
  },
  2: {
    title: "Chapter 02 · 事件、State 与渲染模型",
    questions: [
      "为什么一次 Event Handler 里调用 setState 后，当前变量不会立刻变成新值？",
      "连续三次 setCount(count + 1) 与连续三次 functional updater 的结果为什么不同？",
      "什么情况下 functional updater 是必要的，什么情况下它并不能解决 stale closure？",
      "对象或数组 State 直接 mutation 为什么会破坏 React 的更新推理和调试能力？",
      "Trigger、Render、Commit、Browser Paint 分别发生什么？为什么 Render 并不等于 DOM 一定改变？",
    ],
    exercises: [
      "先不运行代码，预测 StateSnapshotQueueDemo 中普通更新、functional updater、timer 三组操作的日志顺序，再实际验证。",
      "写一个包含 nested object 和 array 的 State 更新案例，故意加入一次 mutation，再改成不可变更新并比较可观察结果。",
      "为一个按钮点击流程画出 Trigger → Render → Commit 时间线，标出事件闭包读取的 snapshot 与 DOM 真正更新的位置。",
    ],
  },
  3: {
    title: "Chapter 03 · State 建模与状态架构",
    questions: [
      "如何判断一个值应该成为 State，还是应该从现有 Props/State 派生计算？",
      "为什么 contradictory / duplicate State 会让状态机出现非法组合？",
      "受控组件与非受控组件的核心差异为什么是 State ownership，而不只是 input 写法不同？",
      "State 为什么与组件在树中的位置绑定？什么时候应该通过 key 主动 reset？",
      "useReducer、Context、Reducer + Context 分别解决什么问题？拆分 State/Dispatch Context 又不能保证什么？",
    ],
    exercises: [
      "找一个包含多个 boolean 状态的 Demo，把它重构成更明确的状态模型，并列出重构前可能出现的非法组合。",
      "实现一个可受控也可非受控的 Tabs 小组件，分别设计 value/onChange 与 defaultValue API。",
      "实现一个联系人草稿切换实验：先保留错误草稿，再使用 key 或状态提升让 reset 行为符合产品需求。",
    ],
  },
  4: {
    title: "Chapter 04 · Ref、Effect 与 Escape Hatches",
    questions: [
      "Effect 为什么应该理解为外部系统同步，而不是通用的‘状态变化后做点什么’？",
      "如何判断一段逻辑属于 Event Handler，而不是 Effect？",
      "Effect dependency 表达的是什么关系？为什么不能把 dependency array 当运行次数开关？",
      "useEffectEvent 解决的是哪类 non-reactive logic？为什么它不能用来逃避真实依赖？",
      "Ref、useLayoutEffect、useImperativeHandle 分别在哪些 escape-hatch 场景合理，什么时候说明数据流设计出了问题？",
    ],
    exercises: [
      "找一个可以用派生计算或 Event Handler 替代的 Effect，并重构掉它；记录删除 Effect 后少了哪些同步风险。",
      "实现一个 window 事件订阅或 timer Hook，反复挂载/卸载并验证 setup/cleanup 数量不会累积。",
      "设计一个只暴露 focus() 或 scrollToTop() 的 imperative API；限制暴露能力，不直接把整个 DOM node 交给父组件。",
    ],
  },
  5: {
    title: "Chapter 05 · Forms 与 React 19 Actions",
    questions: [
      "受控字段 State、FormData、提交结果 State 分别适合承载什么信息？哪些数据不应该重复存储？",
      "React 19 的 form action 与普通 onSubmit 的心智模型有什么不同？",
      "useActionState 的 previousState、返回值和 pending 状态如何组成 mutation 流程？",
      "useFormStatus 为什么必须从 form 后代读取？它适合控制哪些提交 UI？",
      "什么操作适合 optimistic UI，为什么支付、权限、库存锁定通常应该更保守？",
    ],
    exercises: [
      "实现一个包含成功、业务失败和重复提交保护的表单；不要维护重复的 derived error State。",
      "给一个列表 mutation 增加 optimistic 状态和失败回退，要求 canonical state 始终保持最终真源。",
      "比较同一表单用 controlled fields 与提交时 FormData 两种实现，写出各自更适合的场景。",
    ],
  },
  6: {
    title: "Chapter 06 · Suspense 与并发 UI",
    questions: [
      "lazy 与 Suspense 分别负责什么？Suspense 为什么不等于任意 fetch 的 loading 管理器？",
      "单一 Suspense Boundary 与 nested boundaries 会怎样改变 reveal sequence 和用户体验？",
      "Error Boundary 能捕获哪些错误，为什么事件处理器里的异步错误不属于同一条路径？",
      "Transition 中哪些更新应该保持 urgent？为什么受控 input 的 value 不应该直接放进 Transition？",
      "useDeferredValue 与 debounce 的目标和时序模型有什么根本区别？",
      "React 19 use(Promise) 为什么要求稳定/缓存的 Promise，而不应在 Render 中随意新建 Promise？",
    ],
    exercises: [
      "给一个包含两个慢区域的页面设计两种 Suspense Boundary 划分方案，并实际比较 fallback/reveal 行为。",
      "实现一个输入即时、结果区域可延后的搜索实验；分别尝试 useDeferredValue 与手写 debounce，并记录差异。",
      "构造一个 render error 与一个 event-handler error，对比 Error Boundary 是否接管，并解释观察结果。",
    ],
  },
  7: {
    title: "Chapter 07 · 性能模型与优化",
    questions: [
      "为什么父组件 Render 通常会让子组件重新执行，但这不代表 DOM 一定更新？",
      "对象、数组、函数 identity 为什么会影响 memo、dependency 和缓存命中？",
      "memo、useMemo、useCallback 分别缓存什么？什么时候使用它们反而增加维护成本？",
      "Profiler 的 actualDuration / baseDuration 可以帮助回答什么问题？为什么优化前应该先测量？",
      "React Compiler 改变的是哪部分优化责任？为什么它不改变 State、Props、纯 Render 等核心规则？",
    ],
    exercises: [
      "选一个 Demo，用 Profiler 找出一次可重复的慢更新；先记录基线，再尝试一种优化并比较结果。",
      "构造 memo child + object/function props 场景，逐项消除不稳定 identity，记录哪些修改真正减少了 child Render。",
      "删除一处没有测量依据的 useMemo/useCallback，验证 correctness 不变，并判断性能是否真的受到影响。",
    ],
  },
  8: {
    title: "Chapter 08 · 外部 Store 与第三方系统",
    questions: [
      "useSyncExternalStore 的 subscribe 与 getSnapshot 各自承担什么职责？snapshot identity 为什么必须稳定？",
      "React State 与 external store 的所有权、订阅和一致性模型有什么不同？",
      "Portal 改变的是 DOM 位置还是 React Tree？事件传播与 Context 为什么仍按 React Tree 工作？",
      "集成图表、地图、编辑器等 imperative library 时，ref + Effect + cleanup 的边界是什么？",
      "什么时候 React 自带 State/Reducer/Context 已足够，什么时候才值得引入 Zustand、Redux Toolkit 或 Jotai？",
    ],
    exercises: [
      "实现一个最小 external store，故意让 getSnapshot 每次返回新对象，再修复 snapshot identity 并比较行为。",
      "用 Portal 做一个浮层，验证 DOM 父节点与 React 事件传播路径不同，并记录你的观察。",
      "模拟一个第三方 widget 实例，给它加入 setup/update/destroy 日志，反复切换依赖确认没有实例泄漏。",
    ],
  },
  9: {
    title: "Chapter 09 · Server State 与请求架构",
    questions: [
      "为什么 Server State 不是‘fetch 完塞进 useState’这么简单？它额外有哪些生命周期问题？",
      "query key、fresh/stale、invalidation、refetch 分别解决什么问题？",
      "request dedupe、race guard、Abort cancellation 处理的是同一个问题吗？它们之间如何区分？",
      "分页查询的 page/cursor 为什么通常属于缓存身份的一部分？",
      "optimistic mutation 成功确认与失败 rollback 时，canonical server state 应该如何保持权威？",
      "Router loader 与 Server State cache 可以如何组合，而不是互相替代？",
    ],
    exercises: [
      "实现两个几乎同时发出的请求，让后发请求先返回；先观察 stale response 覆盖，再加入 race guard 或 AbortController。",
      "为一个分页列表设计 query key，切换两页后返回第一页，观察缓存身份是否符合预期。",
      "实现一个会随机失败的 optimistic mutation，要求失败后恢复旧数据并呈现明确错误状态。",
    ],
  },
  10: {
    title: "Chapter 10 · Router 与页面架构",
    questions: [
      "哪些状态应该进入 URL，为什么 URL state 天然具有分享、刷新和 history 语义？",
      "Route Params 与 Search Params 在页面身份和可选状态上的职责有什么区别？",
      "Nested Routes / Outlet 为什么能表达页面布局层级，而不只是 URL 字符串拆分？",
      "声明式 Link 与程序式 navigate 分别适合哪些场景？push 与 replace 的 history 语义有何差异？",
      "Data Router 的 loader、pending、error boundary 为什么属于 route boundary，而不应每页都 mount Effect 再 fetch？",
      "Router 的页面生命周期职责与 TanStack Query 的 Server State 生命周期职责如何划分？",
    ],
    exercises: [
      "设计一个搜索页 URL：同时包含资源 id、分页、排序、筛选；说明哪些用 path params，哪些用 search params。",
      "画出一个三层 nested route tree，并标出 layout、index route、Outlet 和 404/error boundary 的位置。",
      "把一个‘组件挂载后 Effect fetch’页面改写成 route-loader 心智模型，列出 loading/error/navigation 职责如何迁移。",
    ],
  },
  11: {
    title: "Chapter 11 · TypeScript、Testing 与 Accessibility",
    questions: [
      "TypeScript 在 React 中最值得建模的边界是什么？为什么‘每行写满类型’不是目标？",
      "discriminated union 为什么比多个 loading/error/success boolean 更能限制非法状态？",
      "Vitest、React Testing Library、Playwright 分别应该验证什么，哪些细节不应该塞进 E2E？",
      "为什么测试应优先 role/label/text 等用户可观察语义，而不是 class、私有 State 或内部函数调用次数？",
      "原生语义、ARIA、键盘行为、focus management 各自解决什么？为什么 ARIA 不会自动补上行为？",
      "自动 axe 扫描、DOM/键盘测试与真实 screen reader 测试之间有哪些能力边界？",
    ],
    exercises: [
      "把一个由多个 boolean 表达的异步状态改成 TypeScript discriminated union，并让 switch 覆盖所有状态。",
      "为现有一个异步 Demo 写一条 RTL 风格测试设计和一条 Playwright E2E 设计；要求两者验证层级不同。",
      "只用键盘审查一个交互组件：记录 Tab 顺序、可见焦点、Enter/Space、Escape 与关闭后的焦点恢复问题。",
    ],
  },
  12: {
    title: "Chapter 12 · SSR、RSC 与 Framework",
    questions: [
      "CSR、SSG、请求时 SSR 的主要差异是什么？这些 rendering policy 为什么通常由 framework 决定？",
      "hydration 为什么要求客户端初始输出与服务端 HTML 一致？哪些 render-time 值容易制造 mismatch？",
      "Streaming SSR 解决什么问题？为什么它与 RSC 不是同义词？",
      "Server Component 与 Client Component 的模块边界意味着什么？Client Component 是否一定只在浏览器生成 HTML？",
      "为什么 \"use client\" 定义 client module boundary，而 \"use server\" 标记 Server Function？",
      "React Core、React Router Framework Mode、Next.js App Router 在路由、数据、渲染、部署上的责任边界如何不同？",
    ],
    exercises: [
      "列出 4 个可能造成 hydration mismatch 的首屏值，并分别设计让首次 Render 可重现的方案。",
      "给一个商品详情页画出 Server Component / Client Component module graph，标出哪些代码需要进入客户端 bundle。",
      "比较同一页面采用 CSR、SSG、SSR 三种策略时的数据时效性、首屏成本、服务器成本和部署约束。",
    ],
  },
};

const CHECKPOINT_BY_DEMO_ID = {
  "prop-drilling": 1,
  "render-commit": 2,
  "use-reduce-with-context": 3,
  "advanced-ref": 4,
  "optimistic-update": 5,
  "transition-deferred": 6,
  "react-compiler": 7,
  "portal-third-party": 8,
  "server-state-mutation": 9,
  "route-data-boundary": 10,
  "typescript-react": 11,
  "server-functions-framework": 12,
};

export function getCheckpointChapter(demoId) {
  return CHECKPOINT_BY_DEMO_ID[demoId] ?? null;
}

export function ChapterCheckpoint({ chapter }) {
  const checkpoint = CHECKPOINTS[chapter];
  if (!checkpoint) return null;

  return (
    <section className="demo-section" data-chapter-checkpoint={chapter} aria-labelledby={`chapter-${chapter}-checkpoint-title`}>
      <div className="demo-section-header">
        <h2 id={`chapter-${chapter}-checkpoint-title`} className="demo-section-title">
          🧭 {checkpoint.title} · 学习检查
        </h2>
        <p className="demo-section-desc">先独立回答，再回到对应 Demo 验证。这里刻意不提供答案。</p>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip" style={{ margin: 0 }}>
          <div className="demo-alert-title">你现在应该能回答什么？</div>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {checkpoint.questions.map((question) => <li key={question} style={{ marginBottom: 8 }}>{question}</li>)}
          </ol>
        </div>

        <div className="demo-alert demo-alert-warning" style={{ margin: 0 }}>
          <div className="demo-alert-title">练习</div>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {checkpoint.exercises.map((exercise) => <li key={exercise} style={{ marginBottom: 8 }}>{exercise}</li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}
