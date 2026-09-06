import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "react-learning-progress:v1";

const modules = [
  {
    id: "jsx-components",
    number: "01",
    title: "JSX 与组件",
    description: "写出你的第一个 React 组件",
    duration: "8 分钟",
    eyebrow: "基础概念",
    goal: "理解 JSX 如何描述界面，以及组件如何把页面拆成可复用的部分。",
    lessons: [
      {
        title: "组件是可复用的 UI 单元",
        body: "React 组件是一个返回界面的 JavaScript 函数。把页面拆成组件，可以让每一块 UI 更容易理解和复用。",
        code: `function Welcome() {
  return <h2>你好，React！</h2>;
}`,
        result: "调用 <Welcome /> 后，页面会显示“你好，React！”。",
      },
    ],
    question: {
      prompt: "下面哪一项是一个有效的 React 组件定义？",
      options: [
        "function Welcome() { return <h2>Hello</h2>; }",
        "const Welcome = \"Hello\";",
        "component Welcome = <h2>Hello</h2>;",
      ],
      answer: 0,
      explanation: "React 组件通常是一个返回 JSX 的函数，并且组件名称以大写字母开头。",
    },
  },
  {
    id: "props",
    number: "02",
    title: "Props 与组件通信",
    description: "让组件接收并展示外部数据",
    duration: "10 分钟",
    eyebrow: "组件通信",
    goal: "理解父组件如何通过 props 把数据传递给子组件。",
    lessons: [
      {
        title: "Props 是组件的输入",
        body: "父组件可以像传递 HTML 属性一样传递 props。子组件通过参数接收这些值，并用它们渲染界面。",
        code: `function Badge({ label }) {
  return <span>{label}</span>;
}

<Badge label="已完成" />`,
        result: "Badge 组件会显示传入的 label：已完成。",
      },
    ],
    question: {
      prompt: "父组件如何把 title 传给 Card 组件？",
      options: [
        "<Card title=\"React 入门\" />",
        "<Card props.title=\"React 入门\" />",
        "<Card use title=\"React 入门\" />",
      ],
      answer: 0,
      explanation: "JSX 属性会作为 props 传给子组件，子组件可以通过参数读取 title。",
    },
  },
  {
    id: "state-events",
    number: "03",
    title: "useState 与事件",
    description: "让页面对用户操作做出响应",
    duration: "12 分钟",
    eyebrow: "交互状态",
    goal: "理解 state 和普通变量的区别，并使用事件更新页面。",
    lessons: [
      {
        title: "State 让组件记住变化",
        body: "State 是组件需要记住、并且会随着交互变化的数据。调用 setter 后，React 会使用新数据重新渲染组件。",
        code: `const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>
  Count is {count}
</button>`,
        result: "点击按钮后，count 增加 1，按钮上的文字也会更新。",
      },
    ],
    question: {
      prompt: "点击按钮后，哪一行代码会触发页面更新？",
      options: [
        "const count = 0",
        "setCount(count + 1)",
        "console.log(count)",
      ],
      answer: 1,
      explanation: "setCount 会更新 state，并通知 React 重新渲染组件。普通变量和 console.log 不会更新页面。",
    },
  },
  {
    id: "conditions-lists",
    number: "04",
    title: "条件渲染与列表",
    description: "根据数据决定页面显示什么",
    duration: "12 分钟",
    eyebrow: "动态界面",
    goal: "根据状态显示不同内容，并使用 map 渲染一组数据。",
    lessons: [
      {
        title: "让界面跟着数据变化",
        body: "条件渲染让组件根据状态展示不同内容，列表渲染则让相同结构可以重复展示。",
        code: `{isReady ? <Success /> : <Loading />}

{items.map((item) => (
  <li key={item.id}>{item.title}</li>
))}`,
        result: "状态变化时，界面会显示对应分支；数组中的每一项会成为一个列表元素。",
      },
    ],
    question: {
      prompt: "渲染数组列表时，为什么通常需要提供 key？",
      options: [
        "帮助 React 识别列表项的身份",
        "让 CSS 自动生效",
        "把数组转换成字符串",
      ],
      answer: 0,
      explanation: "稳定的 key 帮助 React 追踪列表项变化，从而更准确、高效地更新界面。",
    },
  },
  {
    id: "controlled-inputs",
    number: "05",
    title: "表单与受控输入",
    description: "构建可预测的表单交互",
    duration: "15 分钟",
    eyebrow: "用户输入",
    goal: "使用 state 管理输入框的值，让表单状态保持可预测。",
    lessons: [
      {
        title: "受控输入只有一个数据来源",
        body: "受控输入的 value 来自 React state，用户输入时通过 onChange 更新 state。",
        code: `const [name, setName] = useState("");

<input
  value={name}
  onChange={(event) => setName(event.target.value)}
/>`,
        result: "输入框显示的内容始终和 name state 保持同步。",
      },
    ],
    question: {
      prompt: "受控 input 的 value 通常应该来自哪里？",
      options: [
        "React state",
        "浏览器地址栏",
        "CSS class 名称",
      ],
      answer: 0,
      explanation: "受控输入的值由 React state 管理，onChange 负责把用户输入写回 state。",
    },
  },
];

function createEmptyProgress() {
  return {
    completedModules: [],
    currentModuleId: null,
  };
}

function loadProgress() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return createEmptyProgress();

    const parsed = JSON.parse(saved);
    if (
      !parsed ||
      !Array.isArray(parsed.completedModules) ||
      (parsed.currentModuleId !== null &&
        typeof parsed.currentModuleId !== "string")
    ) {
      return createEmptyProgress();
    }

    return parsed;
  } catch {
    return createEmptyProgress();
  }
}

function Icon({ name, size = 18 }) {
  const paths = {
    arrow: "M4 12h15m-6-6 6 6-6 6",
    arrowLeft: "M19 12H4m6-6-6 6 6 6",
    check: "m5 12 4 4L19 6",
    code: "m8 9-3 3 3 3m8-6 3 3-3 3m-3 3 2-12",
    spark: "m12 3-1.2 5.8L5 10l5.8 1.2L12 17l1.2-5.8L19 10l-5.8-1.2L12 3Z",
    clock:
      "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2",
    play: "m9 6 9 6-9 6V6Z",
    refresh: "M20 11a8.1 8.1 0 0 0-14.8-4L3 10m0 0V4m0 6h6m-1 3a8.1 8.1 0 0 0 14.8 4L21 14m0 0v6m0-6h-6",
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d={paths[name]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Icon name="code" size={20} />
      </span>
      <span>React 学习实验室</span>
    </div>
  );
}

function ProgressBar({ completedCount, label = true }) {
  const value = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        {label && <span>学习进度</span>}
        <strong>
          {completedCount}/{modules.length} 个模块
        </strong>
      </div>
      <div
        aria-label={`已完成 ${completedCount} 个模块，共 ${modules.length} 个模块`}
        aria-valuemax={modules.length}
        aria-valuemin="0"
        aria-valuenow={completedCount}
        className="progress-track"
        role="progressbar"
      >
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ModuleStatus({ status }) {
  if (status === "completed") {
    return (
      <span className="status status-completed">
        <Icon name="check" size={14} />
        已完成
      </span>
    );
  }

  if (status === "in-progress") {
    return (
      <span className="status status-progress">
        <span className="status-dot" />
        正在学习
      </span>
    );
  }

  return <span className="status status-idle">未开始</span>;
}

function ModuleCard({ item, status, onOpen }) {
  const actionLabel =
    status === "completed"
      ? "复习"
      : status === "in-progress"
        ? "继续学习"
        : "查看模块";

  return (
    <article className={`module-card module-card-${status}`}>
      <div className="module-number">{item.number}</div>
      <div className="module-content">
        <div className="module-heading">
          <div>
            <span className="eyebrow">{item.eyebrow}</span>
            <h3>{item.title}</h3>
          </div>
          <ModuleStatus status={status} />
        </div>
        <p>{item.description}</p>
        <div className="module-footer">
          <span className="duration">
            <Icon name="clock" size={15} />
            {item.duration}
          </span>
          <button className="button button-small button-secondary" onClick={() => onOpen(item.id)} type="button">
            {actionLabel}
            <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Header({ completedCount, onHome }) {
  return (
    <header className="app-header">
      <button aria-label="返回学习路径首页" className="brand-button" onClick={onHome} type="button">
        <Brand />
      </button>
      <div className="header-actions">
        <div className="header-progress">
          <span>进度</span>
          <strong>
            {completedCount}/{modules.length}
          </strong>
        </div>
        <span className="theme-chip">
          <Icon name="spark" size={15} />
          跟随系统
        </span>
      </div>
    </header>
  );
}

function Home({ completedCount, progress, onOpenModule }) {
  const nextModule = modules.find(
    (item) => !progress.completedModules.includes(item.id),
  );
  const currentModule =
    modules.find((item) => item.id === progress.currentModuleId) || nextModule;

  return (
    <main className="page home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-kicker">
            <Icon name="spark" size={15} />
            React 入门路径
          </span>
          <h1>
            学会 React，
            <br />
            从一个小组件开始
          </h1>
          <p>
            用短知识卡和即时练习，完成你的第一条 React 学习路径。
          </p>
          <div className="hero-facts">
            <span>5 个模块</span>
            <span>约 60 分钟</span>
            <span>无需注册</span>
          </div>
        </div>
        <div className="hero-progress-card">
          <div className="hero-progress-top">
            <span>你的学习路径</span>
            <span className="progress-percent">
              {Math.round((completedCount / modules.length) * 100)}%
            </span>
          </div>
          <ProgressBar completedCount={completedCount} label={false} />
          <div className="hero-progress-bottom">
            <span>
              {completedCount
                ? `已完成 ${completedCount} 个模块`
                : "从第一课开始，建立 React 基础"}
            </span>
            <span className="mini-steps">
              {modules.map((item, index) => (
                <span
                  className={index < completedCount ? "mini-step is-done" : "mini-step"}
                  key={item.id}
                />
              ))}
            </span>
          </div>
        </div>
      </section>

      <section className="continue-card">
        <div className="continue-icon">
          <Icon name={completedCount ? "play" : "arrow"} size={22} />
        </div>
        <div className="continue-copy">
          <span className="eyebrow">{completedCount ? "继续你的学习" : "推荐从这里开始"}</span>
          <h2>{currentModule?.title || "完成学习路径"}</h2>
          <p>{currentModule?.description || "你已经完成全部入门模块。"}</p>
        </div>
        {currentModule && (
          <button className="button button-primary" onClick={() => onOpenModule(currentModule.id)} type="button">
            {completedCount ? "继续学习" : "开始第一课"}
            <Icon name="arrow" size={17} />
          </button>
        )}
      </section>

      <section className="path-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LEARNING PATH</span>
            <h2>学习路径</h2>
            <p>按顺序掌握 React 最常用的基础概念</p>
          </div>
          <span className="section-count">{modules.length} 个模块</span>
        </div>
        <div className="module-list">
          {modules.map((item, index) => {
            const status = progress.completedModules.includes(item.id)
              ? "completed"
              : progress.currentModuleId === item.id ||
                  (!progress.currentModuleId && index === 0)
                ? "in-progress"
                : "not-started";

            return (
              <ModuleCard
                item={item}
                key={item.id}
                onOpen={onOpenModule}
                status={status}
              />
            );
          })}
        </div>
      </section>

      <p className="save-note">
        <Icon name="check" size={15} />
        学习进度会自动保存在当前浏览器中
      </p>
    </main>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="code-label">
          <span className="window-dot dot-purple" />
          <span className="window-dot dot-yellow" />
          <span className="window-dot dot-green" />
          example.jsx
        </span>
        <button className="copy-button" onClick={copyCode} type="button">
          {copied ? "已复制" : "复制代码"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ModuleView({ module, completedModules, onComplete, onHome, onOpenModule }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const isCompleted = completedModules.includes(module.id);
  const moduleIndex = modules.findIndex((item) => item.id === module.id);
  const nextModule = modules[moduleIndex + 1];
  const isLastModule = !nextModule;

  function submitAnswer() {
    if (selectedAnswer === null) return;
    setFeedback(selectedAnswer === module.question.answer ? "correct" : "incorrect");
  }

  function retry() {
    setSelectedAnswer(null);
    setFeedback(null);
  }

  function finishModule() {
    onComplete(module.id);
  }

  function continueAfterComplete() {
    if (nextModule) {
      onOpenModule(nextModule.id);
    } else {
      onHome();
    }
  }

  return (
    <main className="page module-page">
      <div className="module-topbar">
        <button className="back-link" onClick={onHome} type="button">
          <Icon name="arrowLeft" size={17} />
          学习路径
        </button>
        <div className="module-topbar-center">
          <span>
            {module.number} / {String(modules.length).padStart(2, "0")}
          </span>
          <strong>{module.title}</strong>
        </div>
        <div className="module-top-progress">
          <span className="desktop-only">路径进度</span>
          <ProgressBar completedCount={completedModules.length} label={false} />
        </div>
      </div>

      <section className="module-intro">
        <span className="hero-kicker">{module.eyebrow}</span>
        <h1>{module.title}</h1>
        <p>{module.goal}</p>
        <div className="learning-goals">
          <span>
            <Icon name="check" size={15} />
            1 个知识卡
          </span>
          <span>
            <Icon name="check" size={15} />
            1 道练习题
          </span>
          <span>
            <Icon name="clock" size={15} />
            {module.duration}
          </span>
        </div>
      </section>

      <div className="lesson-layout">
        <div className="lesson-main">
          <section className="lesson-card">
            <div className="lesson-card-header">
              <span className="lesson-step">知识卡 1 / 1</span>
              <span className="lesson-type">CORE CONCEPT</span>
            </div>
            <h2>{module.lessons[0].title}</h2>
            <p className="lesson-body">{module.lessons[0].body}</p>
            <CodeBlock code={module.lessons[0].code} />
            <div className="result-note">
              <span className="result-icon">
                <Icon name="play" size={14} />
              </span>
              <p>
                <strong>运行结果</strong>
                {module.lessons[0].result}
              </p>
            </div>
          </section>

          <section className="exercise-card">
            <div className="exercise-header">
              <div>
                <span className="lesson-step">练习 1 / 1</span>
                <h2>检查你的理解</h2>
              </div>
              <span className="question-mark">?</span>
            </div>
            <p className="question-text">{module.question.prompt}</p>
            <div className="answer-list" role="radiogroup" aria-label="练习答案">
              {module.question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = feedback && index === module.question.answer;
                const isWrong = feedback === "incorrect" && isSelected && !isCorrect;
                const optionClass = [
                  "answer-option",
                  isSelected ? "is-selected" : "",
                  isCorrect ? "is-correct" : "",
                  isWrong ? "is-wrong" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    aria-checked={isSelected}
                    className={optionClass}
                    disabled={Boolean(feedback)}
                    key={option}
                    onClick={() => setSelectedAnswer(index)}
                    role="radio"
                    type="button"
                  >
                    <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                    {isCorrect && <Icon name="check" size={17} />}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className={`feedback feedback-${feedback}`} role="status">
                <div className="feedback-icon">
                  <Icon name={feedback === "correct" ? "check" : "refresh"} size={18} />
                </div>
                <div>
                  <strong>{feedback === "correct" ? "回答正确" : "还差一点"}</strong>
                  <p>{module.question.explanation}</p>
                </div>
              </div>
            )}

            <div className="exercise-actions">
              {!feedback && (
                <button
                  className="button button-primary"
                  disabled={selectedAnswer === null}
                  onClick={submitAnswer}
                  type="button"
                >
                  提交答案
                  <Icon name="arrow" size={17} />
                </button>
              )}
              {feedback === "incorrect" && (
                <button className="button button-secondary" onClick={retry} type="button">
                  <Icon name="refresh" size={16} />
                  再试一次
                </button>
              )}
              {feedback === "correct" && (
                <button className="button button-primary" onClick={finishModule} type="button">
                  {isCompleted ? "已完成本模块" : "完成本模块"}
                  <Icon name="arrow" size={17} />
                </button>
              )}
            </div>
          </section>

          <div className="lesson-navigation">
            <button className="text-button" onClick={onHome} type="button">
              <Icon name="arrowLeft" size={16} />
              返回路径
            </button>
            <span>完成练习后解锁下一模块</span>
          </div>
        </div>

        <aside className="module-sidebar">
          <div className="sidebar-card">
            <span className="eyebrow">UP NEXT</span>
            <h3>{nextModule ? nextModule.title : "学习路径完成"}</h3>
            <p>
              {nextModule
                ? `下一步：${nextModule.description}`
                : "完成全部入门模块，继续构建你的 React 项目。"}
            </p>
            {feedback === "correct" && (
              <button className="button button-secondary button-full" onClick={continueAfterComplete} type="button">
                {isLastModule ? "返回学习路径" : "前往下一模块"}
                <Icon name="arrow" size={16} />
              </button>
            )}
          </div>
          <div className="sidebar-tip">
            <span className="tip-icon">
              <Icon name="spark" size={16} />
            </span>
            <div>
              <strong>学习提示</strong>
              <p>先用自己的话解释概念，再查看答案，会记得更牢。</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState("home");
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const completedCount = progress.completedModules.length;
  const activeModule = useMemo(
    () => modules.find((item) => item.id === activeModuleId),
    [activeModuleId],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // The demo remains usable when storage is unavailable.
    }
  }, [progress]);

  function openModule(moduleId) {
    setActiveModuleId(moduleId);
    setProgress((current) => ({ ...current, currentModuleId: moduleId }));
    setScreen("module");
  }

  function completeModule(moduleId) {
    const currentIndex = modules.findIndex((item) => item.id === moduleId);
    const nextModule = modules[currentIndex + 1];
    setProgress((current) => ({
      completedModules: current.completedModules.includes(moduleId)
        ? current.completedModules
        : [...current.completedModules, moduleId],
      currentModuleId: nextModule?.id || null,
    }));
  }

  function goHome() {
    setScreen("home");
  }

  return (
    <div className="app-shell">
      <Header completedCount={completedCount} onHome={goHome} />
      {screen === "home" ? (
        <Home
          completedCount={completedCount}
          onOpenModule={openModule}
          progress={progress}
        />
      ) : activeModule ? (
        <ModuleView
          completedModules={progress.completedModules}
          module={activeModule}
          onComplete={completeModule}
          onHome={goHome}
          onOpenModule={openModule}
        />
      ) : (
        <Home
          completedCount={completedCount}
          onOpenModule={openModule}
          progress={progress}
        />
      )}
    </div>
  );
}

export default App;
