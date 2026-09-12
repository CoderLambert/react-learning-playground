# 手工 Screen Reader Checklist

这份清单用于补充 axe、DOM 检查和键盘 smoke test。它检查真实辅助技术是否能完成关键任务，不把自动化结果当成屏幕阅读器证据。

当前状态：`real screen reader validation: PENDING`

除非使用 VoiceOver、NVDA 或 Orca 完成一次实际操作并记录环境、步骤和结果，否则不得把状态改成 PASS。

## Sidebar / navigation

- [ ] 能识别页面标题、sidebar/navigation 区域和当前学习单元。
- [ ] 导航项的名称、当前状态和顺序可理解。
- [ ] 折叠或展开 sidebar 后，状态变化和可操作入口可被感知。

## Search

- [ ] Search 控件有稳定名称，能说明用途。
- [ ] 输入搜索词、清空搜索和无结果状态都能被理解。
- [ ] 搜索结果变化不会产生重复或无关播报。

## Demo controls

- [ ] 每个按钮、链接、输入框和选择控件都有可理解的名称和状态。
- [ ] 能完成 Demo 要求的操作，并知道 loading、disabled 或 selected 状态。
- [ ] 重点内容和操作顺序与视觉界面一致。

## Forms and validation

- [ ] 每个字段都有稳定 label，placeholder 没有被当作唯一字段名称。
- [ ] 帮助文本和校验错误与对应字段的关系可被感知。
- [ ] 提交、loading、成功和失败状态都能在不丢失上下文的情况下理解。

## Live region

- [ ] 非紧急状态以合适的 polite 方式播报，不重复打断当前朗读。
- [ ] assertive 只用于确实需要立即注意的消息。
- [ ] 状态反复变化时不会造成噪声或连续重复播报。

## Modal

- [ ] 打开 modal 后能知道对话框已打开、标题是什么以及用途是什么。
- [ ] initial focus 落在对话框内合理的控件上。
- [ ] Tab / Shift+Tab 被 containment 在 modal 内，不会意外落到背景内容。
- [ ] Escape 可以关闭 modal，并且关闭后能知道回到了哪里。
- [ ] 关闭后焦点恢复到 opener；背景内容不会在 modal 打开期间被误操作。

## Evidence

- Screen reader: ____________________
- Browser / OS: ____________________
- Date: ____________________
- Findings / follow-up: ____________________
