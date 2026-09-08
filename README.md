# React Learning Playground

用于学习 React 的本地测试与实验代码，基于 React 19 和 Vite 构建。

当前包含 Props、Children 插槽、具名多插槽、组件组合以及 React 渲染队列等练习 Demo。

## 本地运行

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run lint
npm run build
```

## 快速新增 Demo

交互式创建：

```bash
npm run demo:new
```

也可以直接传入英文名称和展示标题：

```bash
npm run demo:new -- use-effect "useEffect 基础"
```

脚本会生成 `src/demos/UseEffectDemo.jsx`，并自动把它注册到顶部 Tab 和“全部功能总览”。Demo 名称支持 kebab-case、camelCase 或 PascalCase，且需以英文字母开头。

## 项目说明

这是一个学习用途的 playground，不是面向生产部署的完整应用。各个练习模块位于 `src/demos` 和 `src/components`。
