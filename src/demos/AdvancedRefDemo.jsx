import { useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

function SmartInput({ ref, label }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    select() {
      inputRef.current?.select();
    },
  }), []);

  return <label>{label}<input ref={inputRef} className="form-input" defaultValue="React 19 ref as prop" /></label>;
}

export function AdvancedRefDemo() {
  const inputHandle = useRef(null);
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    setWidth(Math.round(boxRef.current?.getBoundingClientRect().width ?? 0));
  }, [expanded]);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📐</span> 高级 Ref：layout measurement 与 imperative handle</h2><span className="badge badge-blue">04-08</span></div>
        <p className="demo-desc">useLayoutEffect 适合必须在浏览器绘制前读取布局并同步调整 UI 的场景；useImperativeHandle 用于只暴露父组件真正需要的命令式能力。</p>
      </div>
      <div className="demo-section">
        <div className="demo-grid-2">
          <div ref={boxRef} style={{ width: expanded ? "100%" : "65%", padding: 16, border: "1px solid var(--border-color)", borderRadius: 8 }}>
            <strong>Measured box</strong><p>本次 layout effect 读取宽度：{width}px</p>
            <button className="btn" onClick={() => setExpanded((v) => !v)}>切换宽度</button>
          </div>
          <div>
            <SmartInput ref={inputHandle} label="受限 imperative API" />
            <div style={{ marginTop: 10 }}><button className="btn" onClick={() => inputHandle.current?.focus()}>focus</button><button className="btn" style={{ marginLeft: 8 }} onClick={() => inputHandle.current?.select()}>select</button></div>
          </div>
        </div>
      </div>
      <div className="demo-alert demo-alert-tip"><strong>React 19：</strong>函数组件可以直接把 ref 作为 prop 接收；React 18 及更早版本通常需要 forwardRef。forwardRef 仍存在用于兼容旧代码，但 React 官方已说明在 React 19 中不再必要。</div>
      <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><strong>不要滥用：</strong>能用 props 表达的状态（例如 isOpen）优先使用声明式 props；ref 只用于 focus、scroll、measurement、animation 等难以用数据流表达的命令式行为。useLayoutEffect 会阻塞 paint，应优先 useEffect，只有布局读取/同步调整确实需要时才使用。</div>
    </div>
  );
}

export default AdvancedRefDemo;
