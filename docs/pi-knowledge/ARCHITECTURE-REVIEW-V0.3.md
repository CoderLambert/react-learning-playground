# Pi Knowledge V0.2 复审与五项开发门禁核查

日期：2026-09-08。状态：**Conditional Go → Bounded Architecture Spike**。

完整实施建议：[DEVELOPMENT-PLAN-V1.md](./DEVELOPMENT-PLAN-V1.md)。

## 1. 审查结论

V0.2 对产品范围、稳定证据和权限边界的收敛值得保留。不需要重新设计产品，也不应继续扩大 ADR 数量代替原型。

但不能直接将其称为全部验证过的 Architecture Baseline：**有 Panel、存在某个 backend API、支持 federation，并不自动等于当前安装版本支持 Knowledge 的组合。** 本轮已定位确切可行 API 与版本差异。

上一轮误查 `@agegr/pi-web` 是审查错误，相关“不确定目标项目是否有 Web Panel”的依据撤回。本轮使用正确的 `@jmfederico/pi-web`，区分：安装包、网站稳定文档、npm latest、已合并上游 main、实际测试结果。

## 2. 五项问题逐项核查

| 原开发门禁 | 本轮结论 | 验证程度 / 下一步 |
|---|---|---|
| 1. PI WEB 集成路径真实可行 | **存在正确的上游公共 API，但本机安装版未具备** | 已读文档、类型、实现；旧版限制已最小复现。新 API 的实际 Panel→service→Fleet E2E 尚待隔离实例验证 |
| 2. 历史证据在更新/重建/删除后有明确语义 | **V0.2 主模型正确，设计 smoke 已通过；需补范围协议、pin/GC、删除与 Note 编辑语义** | 两个 Node 各29项设计断言通过，包含 tokenizer 预期失败；不替代产品的磁盘故障、并发、备份恢复测试 |
| 3. Knowledge Ask 与高权限 Coding Session 分离 | **Pi SDK 0.84.4 的受控 Session 离线 smoke 已通过** | 四工具注册表/活动工具、reload 后不加载资源已验证；真实模型、OAuth、端到端终止行为未测。只限制 tools 不够 |
| 4. 简单基线/现成产品不足以满足需求 | **尚未确认** | 没有首批真实 corpus/标注任务，也未部署现成产品对照。不能把自建必要性当既定事实 |
| 5. 硬件、模型数据外发、检索门槛明确 | **硬件已核查；数据政策与质量结论仍需用户输入和评测** | 本机 i7-12700K、20 logical CPU、约62 GiB RAM、x86_64；预算/门槛是建议，不是性能结果 |

**结论不是“五项全部通过”。当前可以开始受限的 Spike 与知识数据核心实现；完整发布还有明确门禁。**

## 3. 最重要的新发现：旧 backend 与新 pairedBackend 不是一个契约

### 3.1 已安装版 / npm latest

本机路径：

```text
/home/lambert/.local/share/mise/installs/node/26.7.0/lib/node_modules/@jmfederico/pi-web
```

`package.json.version = 1.202609.0`。查询 npm registry 时 latest 同样为 `1.202609.0`，该发布包 gitHead 为：

```text
be910b30556808a711b212d03afeacb6cd2feab6
```

安装包 `docs/plugins.md` 的 Calling paired workspace backends 段明确规定：请求只能由当前 Workspace owner plugin 的 `WorkspaceProvider.request()` 处理。

安装包源码 `dist/server/workspaces/workspaceProviderRegistry.js` 中 `dispatchRequest()`：

```text
selection.contribution.pluginId !== pluginId
 → owner-mismatch / 409
```

本轮执行了隔离的 Registry probe，未访问宿主服务：

```text
PASS: Git-owned workspace rejects Knowledge backend request with owner-mismatch 409; Knowledge handler not called
PASS: claiming as primary makes Knowledge replace Git workspace ownership (not an additive integration)
PASS: unclaimed folder workspace also rejects Knowledge provider request
```

测试中 provider/path inspection 为 fixture；这是对安装版 dispatcher 的运行验证，不是浏览器 E2E。

**禁止用 Knowledge claim Workspace 来绕过限制。** 这会改变 Workspace owner，进而影响 Git/worktree 语义，违背“Knowledge 只是附加能力”。

### 3.2 上游 main 已有正式解决方案

本轮查询 GitHub 时 main 为：

```text
182c5ade390fc4c31189f44f0daf518817c74e71
```

PR #201、#223 的 GitHub API 字段 `merged=true`，合并时间为 2026-09-07。该 commit 的插件文档、公开类型和实现包含：

```text
Browser: context.pairedBackend.request()
Server: ServerPluginActivation.pairedBackend
Type: PairedPluginBackendV1
```

该 API 对任意宿主解析过的 Workspace 生效，不要求 Knowledge 成为 provider。旧 `context.backend` 仍保留 owner 语义，没有被自动升级为通用接口。

上游还新增 `openChannel()`、navigation 等能力；V1 只依赖 paired request + 轮询，不扩大依赖。

已查看上游测试源码：

- `dispatches a non-provider plugin against a host-resolved provider workspace`
- `dispatches a paired backend for the kernel folder workspace`
- `keeps owner-backed requests private ...`
- stale revision、scope、JSON、timeout、cancellation 测试。

**本轮没有执行整套上游测试或部署该 main 构建。查看测试源码不等于本机测试通过。**

### 3.3 V0.2 应直接改写的架构段落

从：

```text
Panel → context.backend.request → Knowledge backend
```

改为：

```text
Panel
 → feature-detected context.pairedBackend.request（requestVersion=1）
 → Selected target sessiond 的 package-paired thin adapter
 → Target fixed loopback pi-knowledge
```

server plugin 不声明 `workspaceProvider`。

由 systemd 管理独立服务已足够，不需要等待“任意 Workspace 的长期后台服务框架”。但是正式宿主版本必须包含 paired API；不能声称当前 npm latest 已满足。

### 3.4 为什么不能仅写最低 browser API v2

新旧版本都使用 Browser API v2 / Server API v1，但新能力通过 `requestVersion`、manifest lifecycle/revision 表达。

正确检测：

```ts
const paired = context.pairedBackend;
if (paired?.requestVersion !== 1 || paired.request === undefined) {
  // 显示明确宿主不兼容，不回退到 owner backend / localhost browser fetch
}
```

官网稳定 `plugins.md` 在本轮抓取时与已安装旧文档一致，而 main 文档已经不同。实施时必须锁定 commit/release，不能混读两套文档写代码。

## 4. V0.2 仍须修改的工程问题

### P0：版本支持范围不明确

- Problem：把“上游已支持/推进中”直接记成当前可用。
- Why：会导致 Panel 实现后才发现 Git Workspace 请求失败，Fleet 混版也会失效。
- Change：记录安装版、目标 commit、capability、最小发布版本；兼容发布号待真正发布后补充。
- Trade-off：需要维护小型兼容矩阵，但不需要 Fork 或复杂兼容层。

### P1：IndexBuild 的“随时删除”过强

- Problem：正在执行的 Ask/Query 也使用 build。
- Why：没有 lease/pin 就可能在运行中删除候选与向量；老任务还可能覆盖较新发布。
- Change：固定 Ask scope、build lease、generation/CAS、迟到 Worker fencing，提交后再 GC。
- Trade-off：增加几个必要状态字段，避免引入分布式任务系统。

### P1：Stable 不等于永远保存所有版本

- Problem：SourceVersion/ParsedArtifact 全部长期保留没有 GC/删除定义。
- Why：原文、quote、笔记、备份都有副本，删除和容量会失控。
- Change：已引用快照 pin；无引用产物可按保留期清理；archive 与 purge 区分；purge 显示 tombstone。
- Trade-off：不能承诺历史证据在用户主动彻底删除后仍可打开；应明确例外。

### P1：Evidence range 没有跨语言定义

- Problem：line/anchor/heading 只是展示信息，不能作为唯一范围协议。
- Why：中文/emoji 的 JS UTF-16、UTF-8 字节偏移不同，Parser normalize 会改变行号。
- Change：canonical artifact hash + UTF-8 半开字节范围 + exact quote/hash；locator 只是展示辅助。
- Trade-off：需要 Unicode 与重复文本测试，但无需全文定位算法。

### P1：supportStatus 与“不做 Automatic Reviewer”矛盾

- Problem：示例直接显示 supported，却没有独立 semantic checker。
- Why：存在性验证不能证明支持关系；LLM 自评也不可信。
- Change：integrity/semantic/review 三轴；V1 semantic=unchecked，用户能查证。线上 Checker 延后，人工质量评测仍必做。
- Trade-off：UI 不那么“智能”，但不会制造验证错觉。

### P1：Note 编辑会使旧支持结论失效

- Problem：V0.2 强调 Course revision，却未将同样规则应用到 V1 Note。
- Why：修改答案后原引用仍可能存在，但已经不支持新文本。
- Change：不可变 NoteRevision、乐观并发检查、编辑块 semantic 重置；导出含实际引用摘录。
- Trade-off：不能简单把 Note 做成覆盖写 Markdown，但这是 V1 核心正确性。

### P1：Scope 由谁决定尚未完全闭合

- Problem：Machine/Workspace ID、cwd、用户可选择 Source ID 的可信来源混在一起。
- Why：Gateway 的机器 ID 不适合作为目标永久存储身份，模型也不能自行扩大 scope。
- Change：宿主绑定 scope；服务 installation ID + 本地 Workspace 绑定；Ask 固定 manifest；所有 read/reference 校验实际交付集合。
- Trade-off：工作树默认隔离，显式共享延后。

### P1：Phase 3 宣布 V1 完成但缺少 Notes 验收

- Problem：Phase 3 只写 Save Answer，Must 却包含 Edit/Reopen/Export。
- Change：Phase 3 明确包括完整 Notes 与修订流程，纳入端到端测试。
- Trade-off：首版开发量如实增加；不能靠不验收来假装提前完成。

### P2：查询参数被并入 IndexBuild 指纹

- Problem：RRF、Top K 等检索配置变化可能被实现成全量重建。
- Change：仅 tokenizer/chunker/embedding 等产物相关配置属于 build；查询与融合属于 run config。
- Trade-off：多一个清晰配置对象，显著降低重复计算成本。

### P2：Fleet 被当成单一布尔能力

- Problem：没有定义升级、目标服务离线、取消、快速切换 Workspace 的行为。
- Change：测试 local/gateway/remote 三段，缓存和取消按机器/Workspace fencing；错版/离线显式错误，绝不 fallback 到 gateway 数据。
- Trade-off：初版只支持逐机器访问，不做跨机器检索。

## 5. 保留与收敛建议

### Keep

- Pi 与知识权威存储分离。
- SourceVersion / ParsedArtifact / IndexBuild 分离。
- 单一服务、SQLite、MD/TXT、结构感知切块。
- Knowledge Ask 独立能力集。
- RAG 对照评测而不是预设 Hybrid。
- 可靠性前置；Course 延后。

### Change

- `backend` → `pairedBackend`，附具体 capability/版本约束。
- 永久稳定数据 → 引用期间不可变 + 明确保留/删除策略。
- supportStatus → 完整性/语义支持/人工审阅分离。
- Source 当前版本 → 每次 Ask 固定版本清单。
- Saved Note → 有修订、冲突保护、语义判定失效规则的核心产物。

### Remove / Defer

- 不默认启用 channel/SSE、通用 background service、在线 Reviewer。
- 不等待这些能力才能做数据核心。
- 不做多驱动框架；只做一个小接口便于测试。
- 不重新争论已经删掉的 Course/图谱/多 Agent。

## 6. 本轮离线运行验证补充

### 6.1 实际 Node / SQLite / SDK

- shell 和核查时已有 PI WEB web/API、sessiond 可执行路径：`/home/lambert/.local/share/vite-plus/js_runtime/node/24.20.0/bin/node`。
- 另一个已安装 Node：Mise `26.7.0`；不能根据全局包安装目录推断服务实际 runtime。
- 两个 Node 均可导入 `node:sqlite`，SQLite `3.53.4`、FTS5 可用。
- 正确 PI WEB 模块路径解析到 `@earendil-works/pi-coding-agent@0.84.4`；其 devDependencies 的 `^0.85.1` 不是安装事实。未读取现有 daemon JS 堆，不能证明其进程内模块缓存与磁盘始终一致。

### 6.2 FTS / Stable Evidence smoke

归档：[verification/storage-smoke.mjs](./verification/storage-smoke.mjs)，两次原始日志位于同目录。

两种 Node 各 **29 项断言通过**，这是相同设计测试在两个 runtime 上通过，不是58种产品场景。包括：

- unicode61 下 `知识` 不命中 `中文知识检索系统`；trigram 下四字子串命中、两字不命中。
- 默认 tokenizer 混淆 `user.name` / `user/name`、`foo_bar` / `foo-bar`、`C++` / `C`。
- SQL 参数绑定仍需 FTS query grammar 转义。
- scope-before-limit 得到 allowed `[3,4]`，global-top2-then-filter 得到 `[]`。这是逻辑语义，不是物理过滤下推或 Vector 性能证明。
- Evidence 绑定旧字节快照后，rechunk、旧 chunk GC、新 source revision 发布均不改变原 quote/hash。
- 主动事务失败 rollback 保留旧 active generation；正常 close/reopen 后 Evidence 仍在。

Smoke 使用简化 revision 模型，尚未实现正式 ParsedArtifact AST mapping、完整 UTF-8 边界防护、并发/崩溃恢复和备份恢复；immutable trigger 不是防恶意 DB owner 的安全机制。

在限定安装目录内未找到 sqlite-vec 工件，模块解析为 MODULE_NOT_FOUND；没有下载或尝试加载未知动态库。**vec 加载/KNN/过滤/性能仍全部未验证。** 测试断言“vec 函数不存在”不能被误读为 vec 测试通过。

当前三个候选真实文件合计39,954字节：README、PRD-react-learning-platform、DESIGN-react-learning-platform。它们适合 tiny fixture，不能代表 Pi Knowledge 的最终学习语料，也不能把早期设计草案当当前实现事实。

### 6.3 Restricted Session smoke 与安全陷阱

归档：[verification/restricted-session-probe.mjs](./verification/restricted-session-probe.mjs)、[原始日志](./verification/restricted-session-result.log)。

测试运行在独立网络 namespace、清空继承环境、假 HOME、Node 限制文件权限下。子进程调用被拦截，fixture 不含真实凭证。结果：

- 活动工具和整个注册表均只有 knowledge_search/read/sources/submit_answer。
- 9 个非白名单工具名称被拒绝；试图重新激活 bash/read 无效。
- reload 后仍只有四工具、无资源哨兵文本、fixture 内容读取为0。
- 没有 prompt/stream/cloud request/实际子进程。

反例也已确认：

1. `noTools:'builtin'` 只是禁用默认活动工具，注册表仍可能保留可重新激活的 bash。
2. DefaultResourceLoader 的 no-* 开关不自动关闭所有 SYSTEM/APPEND 与 inline factories。
3. overrides 在发现/加载后才丢弃内容，不能作为“阻止执行”的边界。
4. **默认凭证存储的 `!command` key 可能在 ModelRuntime 本地刷新时尝试执行 shell。** 合成测试中尝试被拦截；没有执行真实命令。关闭网络 catalog refresh 不会阻止它。
5. OAuth refresh token 不是简单的可复制只读值；并发刷新/写回需单独验证。
6. `terminate:true` 只在同批结果满足终止条件时生效，应用需显式提交状态和预算控制。

因此推荐自定义空 ResourceLoader、in-memory Settings/Session、显式四工具 allowlist、经过过滤的 CredentialStore、`modelsPath:null`、关闭默认本地创建刷新；不暴露宿主 executeBash 等接口。具体见开发方案第8节。

### 6.4 尚未做的事情

- 未部署新 main 宿主、未安装 Knowledge Panel、未执行真实 Fleet E2E。
- 未运行真实模型、Prompt Injection adversarial model evaluation 或 OAuth 刷新。
- 未完成真实 corpus 标注、Dense/Hybrid benchmark、现成 RAG 产品对照。
- 未实现产品 Jobs、解析、Evidence、Notes 或恢复机制。

这些是明确的下一阶段工作，不应从 smoke 结果推导为已经完成。

## 7. 可追溯来源

### 正确项目与正式文档

- npm package metadata：<https://registry.npmjs.org/@jmfederico%2fpi-web>
- 稳定插件文档：<https://pi-web.dev/plugins.md>
- 配置与 Provider 边界：<https://pi-web.dev/config.md>
- Fleet：<https://pi-web.dev/machines>（本轮 /machines.md 返回 404，因此读取网页）

### 固定上游 commit 的关键证据

- [Plugin API documentation](https://github.com/jmfederico/pi-web/blob/182c5ade390fc4c31189f44f0daf518817c74e71/docs/plugins.md)
- [Public server API](https://github.com/jmfederico/pi-web/blob/182c5ade390fc4c31189f44f0daf518817c74e71/src/server-plugin-api.ts)
- [Paired backend registry](https://github.com/jmfederico/pi-web/blob/182c5ade390fc4c31189f44f0daf518817c74e71/src/server/plugins/pluginBackendRegistry.ts)
- [Paired backend tests](https://github.com/jmfederico/pi-web/blob/182c5ade390fc4c31189f44f0daf518817c74e71/src/server/plugins/pluginBackendRegistry.test.ts)
- [Merged PR #201](https://github.com/jmfederico/pi-web/pull/201)
- [Merged PR #223](https://github.com/jmfederico/pi-web/pull/223)

### 本轮执行边界

- 读取公开文档与源码、安装包、当前项目候选文档；未扫描私人资料库。
- /tmp 中执行隔离 smoke，未注册插件到当前 PI WEB。
- 未安装/升级依赖、未重启服务、未运行任何收费模型调用。
- 本轮运行细节及可复现脚本见后续补充核查记录；公开源码 probe 使用 private implementation 仅为审核复现，生产插件不得照此 deep import。
