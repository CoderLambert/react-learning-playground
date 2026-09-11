var e=`# Reference Equality 引用身份

<MentalModel title="React 经常比较 identity，而不是深比较内容">
JavaScript 对对象、数组和函数使用引用身份；两个结构相同的新对象仍不满足 \`Object.is(a, b)\`。React 的 dependency 比较、\`memo\` 默认 props 比较和多种缓存机制都建立在这个事实之上。
</MentalModel>

<Experiment title="跨 Render 比较 identity">
在中间 Demo 触发无关 state 更新，观察字面量对象、数组、内联函数与稳定引用跨 render 的 \`Object.is\` 结果。
</Experiment>
<DemoReference action="重复触发 re-render" observe="primitive 值可保持相等；每次新建的对象/函数 identity 会改变。" />

<Flow items={["render 创建对象/函数 → 获得新引用","React 用 Object.is 比较依赖或 props","identity 改变 → 缓存可能失效/Effect 可能重同步","只有存在真实优化需求时再稳定引用"]} />

<Observation>
引用变化不是错误，它是 JavaScript 正常语义。只有当 identity 被某个边界消费——例如 memoized child、Hook dependency 或外部订阅 snapshot——它才成为架构信号。
</Observation>

<AntiPattern title="为了稳定而稳定">
不要把每个对象都塞进 \`useMemo\`、每个函数都塞进 \`useCallback\`。没有消费 identity 的优化边界时，这通常只增加代码复杂度。
</AntiPattern>

<Boundary title="浅比较不是深相等">
\`memo\` 默认逐个 prop 使用 \`Object.is\`；\`useEffect\` 等依赖也按 \`Object.is\` 比较。若数据采用不可变更新，引用变化可以自然表达“值发生变化”。
</Boundary>

<Summary>
- 对象/数组/函数的结构相同不代表引用相同。
- identity 只有在被比较或订阅时才影响行为/性能。
- 不可变数据与稳定 identity 是互补工具。
- 先理解消费者，再决定是否缓存引用。
</Summary>

<FurtherReading items={[{label:"React: memo",href:"https://react.dev/reference/react/memo"},{label:"React: useMemo",href:"https://react.dev/reference/react/useMemo"},{label:"MDN: Object.is",href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is"}]} />`;export{e as default};