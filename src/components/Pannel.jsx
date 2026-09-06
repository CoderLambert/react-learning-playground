const DefaultPannelHeader = () => {
  return <div className="pannel-header">卡片面板</div>;
};

const DefaultPannelExtra = () => {
  return (
    <div className="pannel-extra">
      <a href="#">查看更多</a>
    </div>
  );
};

const Pannel = ({ header, extra, children }) => {
  function renderHeader() {
    if (header === false) return null;
    // 2. 局部覆盖：只要传了值（即使是空字符串 "" 或数字 0，只要不是 undefined），就渲染用户传的值
    if (header !== undefined) return header;

    // 3. 回退默认：用户完全没传这个 prop（undefined）
    return <DefaultPannelHeader />;
  }

  function renderExtra() {
    if (extra === false) return null;
    if (extra !== undefined) return extra;

    return <DefaultPannelExtra></DefaultPannelExtra>;
  }

  return (
    <div className="pannel-container">
      {renderHeader()}
      {renderExtra()}
      {children}
    </div>
  );
};

export default Pannel;
