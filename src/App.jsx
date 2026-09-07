import { useState } from "react";
import "./App.css";
import { PropsBasicsDemo } from "./demos/PropsBasicsDemo";
import { ChildrenSlotDemo } from "./demos/ChildrenSlotDemo";
import { MultiSlotsDemo } from "./demos/MultiSlotsDemo";
import { TestQueue } from "./components/TestQueue";
const TABS = [
  { id: "all", label: "🌟 全部功能总览" },
  { id: "props", label: "📌 1. Props 基础与解构" },
  { id: "children", label: "📦 2. Children 默认插槽" },
  { id: "multi-slots", label: "🧩 3. 具名多插槽客制化" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">React Props & 插槽模式学习看板</h1>
        <p className="app-subtitle">
          当前分支模块化整理结果：包含 Props 基础解构、Children
          容器组合与生产级具名多插槽客制化协议。
        </p>
      </header>

      {/* 顶部 Tab 切换器 */}
      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 动态内容渲染 */}
      <main className="demo-card-wrapper">
        {activeTab === "props" && <PropsBasicsDemo />}
        {activeTab === "children" && <ChildrenSlotDemo />}
        {activeTab === "multi-slots" && <MultiSlotsDemo />}

        {activeTab === "all" && (
          <div>
            <PropsBasicsDemo />
            <hr className="demo-divider" />
            <ChildrenSlotDemo />
            <hr className="demo-divider" />
            <MultiSlotsDemo />
          </div>
        )}
        <TestQueue></TestQueue>
      </main>
    </div>
  );
}
