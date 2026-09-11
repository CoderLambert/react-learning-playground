export default function LazyLessonPanel() {
  return (
    <div className="demo-alert demo-alert-tip">
      <div className="demo-alert-title">Lazy chunk 已解析并渲染</div>
      <p>
        这个组件来自独立模块。第一次真正尝试渲染它时，React 才调用
        <code> lazy(load) </code> 的加载函数；加载结果会被缓存。
      </p>
    </div>
  );
}
