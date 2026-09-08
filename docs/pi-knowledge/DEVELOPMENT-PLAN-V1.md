# Pi Knowledge Learning Workspace — V1 完整开发方案

- 版本：V0.3 / Implementation Proposal
- 日期：2026-09-08
- 输入：用户提交的 Architecture Baseline V0.2，及本轮实际环境、已安装包和上游源码核查。
- 结论：**Conditional Go；批准有出口的 Spike 和知识核心纵向切片，不代表已通过产品发布门禁。**
- 核查记录：[ARCHITECTURE-REVIEW-V0.3.md](./ARCHITECTURE-REVIEW-V0.3.md)。本文中的性能、质量、预算数字均为起始目标，不是测试结果。
- 本文件不是实施完成报告；未安装插件、未修改 PI WEB Core、未升级或重启现有 PI WEB、未把用户资料发送给模型。

## 1. 产品范围与成功定义

### 1.1 V1 产品承诺

> 在 Pi 工作流内导入选定技术资料，查找证据，基于固定资料版本提问，把可回查的回答保存为可编辑笔记。

```text
Markdown / TXT / Selected Workspace File
 → Immutable Snapshot
 → ParsedArtifact
 → Retrieval
 → Stable Evidence
 → Restricted Knowledge Ask
 → Answer Revision
 → Saved Note + Markdown Export
```

首批服务对象：单用户开发者、技术学习者。核心使用任务：查证 API 的用法和版本限制、核对项目 PRD/设计约束、保存经自己核查的技术解释。

区别于直接向 Pi 提供文件的价值必须通过任务测试证明：定位正确版本的成功率、核查耗时、资料重复利用、笔记再次打开。

### 1.2 Must / Should / Later / Remove

| 优先级 | 内容 |
|---|---|
| Must | MD/TXT、显式文件导入、手动更新、快照、解析、FTS 基线、资料范围过滤、稳定 Evidence、Source Viewer |
| Must | knowledge_search/read/sources、受限 Ask、结构化回答块、引用确定性校验、证据不足提示 |
| Must | 保存笔记、编辑、历史修订、重新打开、Markdown 导出；这几项必须纳入 V1 验收，不只做到 Save Answer |
| Must | 持久化 Jobs、重试/取消/恢复、原子索引发布、迁移、备份恢复、Golden Dataset |
| Should | 薄 Collection、导入批处理、搜索调试信息、用量与耗时展示 |
| Conditional Must | FTS 基线不能满足目标查询时加入 Dense / Hybrid；不是可无条件省略的功能 |
| Later | PDF、URL、Course、语义 Checker、Reranker、Watcher、学习进度 |
| Remove | Preferred 模式、全局 Claim 图、概念图、Agent 编排框架、微服务拆分、私有 PI WEB API 作为正式依赖 |

V1 不承诺：零幻觉、来源绝对正确、自动完整覆盖、多机器聚合检索、数据同步、隔离同一 OS 用户下的恶意进程。

### 1.3 UI 收敛

只新增一个一级 Workspace Panel：**Knowledge**。

内部导航：`Sources | Search | Ask | Notes`。Source Viewer 为同一 Panel 内的详情视图，不另建整套文件管理器。

每个页面显式展示：目标 Machine、Workspace、选定资料/版本、正在使用的模型及是否外发数据。

必要状态：未配置、宿主能力不兼容、服务不可达、空库、导入中、更新失败但旧版可用、无结果、证据不足、引用不可用、笔记保存冲突。

错误不得显示成空数据；远端不可用不得自动查询本机。

## 2. 最重要的集成修正与版本策略

### 2.1 本次确认的版本事实

核查时：

- 本机 `@jmfederico/pi-web` 与 npm `latest` 均为 `1.202609.0`。
- 该安装版支持 Browser API v2、Server API v1，但 `context.backend.request()` 只服务 Workspace owner。
- Git Workspace 不能由独立 Knowledge 插件通过旧 backend 直接请求；本轮 Registry probe 已复现 `409 owner-mismatch`。
- 上游 `main` commit `182c5ade390fc4c31189f44f0daf518817c74e71` 已合并通用 package-paired backend。
- 正确新接口是 **`context.pairedBackend.request()`**，不是旧 `context.backend.request()`。
- 新能力在核查时尚未进入 npm latest；网站稳定文档也仍展示旧契约。

所以 V0.2 的“Panel 已确认”成立；“当前安装版可直接用 paired backend 作为任意 Workspace 的 thin adapter”不成立。

### 2.2 推荐决策

1. 继续以 Knowledge Panel 为正式产品 UI，不把 Companion 作为默认产品。
2. Spike 在独立测试实例使用上述已合并上游 commit；不跟踪浮动 main。
3. 正式发行优先使用包含该 commit 且通过兼容测试的发布版，届时补上确切最低版本，不虚构版本号。
4. 不 Fork；不通过 claim Workspace 绕过限制；不复制 Git provider；不调用私有 routes。
5. 如果不能使用支持 paired requests 的构建，核心服务和受限 Ask 仍可开发；嵌入式 E2E/发布保持阻塞。需要临时查看时才启用 Companion fallback，不建设长期第二套 UI。
6. 浏览器必须同时检查 `pairedBackend?.requestVersion === 1` 和 `typeof pairedBackend.request === 'function'`，不能只检查 `apiVersion: 2`。

### 2.3 最终调用链

```text
Browser Knowledge Panel
  → context.pairedBackend.request(operation, input, { signal })
  → Browser-facing PI WEB Gateway
  → Selected target PI WEB web/API（本地时不需要远端 hop）
  → Target sessiond 的 Knowledge server entry
  → Authenticated fixed Loopback HTTP
  → Target pi-knowledge
  → Target SQLite / Blobs / Pi SDK / Model Provider
```

Knowledge server entry 只返回 `pairedBackend: { version: 1, request(...) }`，不声明 `workspaceProvider`。

Pi Coding Extension 在实际运行的目标机器上直接访问该机器的 pi-knowledge；不绕回浏览器或 Gateway。

Fleet 仅表示“切换目标机器”，不是跨机器知识查询。每个目标机器需要安装服务、插件、扩展及兼容的 PI WEB。

### 2.4 JSON 桥接限制影响产品实现

已检查上游契约：输入 256 KiB、输出 8 MiB、单 callback 10 秒、sessiond dispatch 25 秒、federation 30 秒。均是上游版本相关限制，升级要复测。

因此：

- Import、Reindex、Ask、Backup 只提交 Job，返回 jobId，不等待整个任务完成。
- V1 状态轮询：活动页约 1 秒一次，无变化退避到 2–5 秒，隐藏/卸载停止；仅活动任务需要持续轮询。
- 不把整个大文档塞进 JSON backend；优先上传到显式 Workspace staging 路径，再请求相对路径导入。
- 接口分页，证据上下文分段读取；应用自己采用更小的响应预算。
- 新 `openChannel()` 确实存在，但 V1 不依赖它；流式通道留作体验优化。
- 浏览器断开仅取消当前网络请求；已提交 Job 由服务继续执行。取消 Job 必须调用单独 cancel 操作。

### 2.5 Adapter 生命周期

- 单次请求有独立 AbortSignal；不能拿 activation/request 的 signal 作为长期 Worker 生命周期。
- server entry 不启动模型、Parser、Worker、systemd；不拥有 DB。
- 使用固定配置的 Loopback 目标与受限 operation allowlist，禁止 `proxy(anyUrl, anyHeaders)`。
- 服务未启动是可重试的 operation failure，不要让宿主一次性的 startup health 检查永久隐藏整个插件。
- 插件 health 表示自身 adapter 可工作；下游连通性在请求和 UI 中展示。
- 插件修改需目标 sessiond 人工重启；服务业务代码升级只重启 pi-knowledge，尽量不涉及 adapter。

## 3. 代码与运行架构

### 3.1 一个新增应用、薄适配包

```text
pi-knowledge/                       # 建议独立 Git 仓库
├── apps/service/src/
│   ├── api/
│   ├── sources/
│   ├── parsing/
│   ├── retrieval/
│   ├── evidence/
│   ├── ask/
│   ├── notes/
│   ├── jobs/
│   └── storage/
├── packages/pi-web-plugin/
│   ├── src/browser/              # Lit/custom element Panel
│   └── src/server.ts             # paired request thin adapter
├── packages/pi-extension/src/    # Pi Coding tools
├── packages/contracts/src/       # 公共 JSON schema / DTO / client
├── migrations/
├── eval/{corpus,queries,labels,reports}/
├── tests/{unit,integration,contract,e2e}/
├── scripts/
└── docs/adr/
```

当前 React 学习 Playground 不应改造成生产知识服务；本轮只在这里交付设计文档。

### 3.2 技术选择

| 层 | 默认选择与理由 |
|---|---|
| 语言 | TypeScript strict、Node ESM；与 Pi / PI WEB 同栈 |
| UI | Lit/custom elements + 宿主 html/svg；减少 React 适配与额外运行时。若团队坚持 React，必须显式挂载/卸载，不能误以为宿主原生 React |
| HTTP | Fastify + JSON schema；一个应用，不引入 BFF 产品框架 |
| Agent | 固定已测试版本 Pi SDK，通过公开入口使用；不从 PI WEB private dist 导入 |
| SQLite driver | Spike 可用 node:sqlite；生产在固定 Node 上比较 node:sqlite 与 better-sqlite3 的维护状态、扩展加载和打包后定一种 |
| 数据访问 | SQL migrations + 薄 repository；暂不引入复杂 ORM |
| MD parsing | unified/remark-parse + remark-gfm，锁版本；TXT 按段落/行解析 |
| 检索 | FTS5；Dense/sqlite-vec 按 Golden Dataset 与部署验证决定 |
| schema | TypeBox 或等价单一库；API、工具输入和测试共享 schema |
| 测试 | Vitest/Node test 二选一并统一，浏览器 E2E 用 Playwright |
| 进程管理 | Linux systemd --user；一个 pi-knowledge.service，内部 worker loop，必要时受控子进程 |

同步 SQLite 查询不能长期堵塞 API event loop；典型规模先测，解析/Embedding 不放进请求同步路径，必要时把 DB 计算放 worker thread，不新增部署服务。

### 3.3 发布包边界

- plugin `browserRoot` 固定为 `dist/browser`；服务代码、密钥、DB、源文件不能位于 browserRoot。
- 浏览器运行时依赖全部 bundle 到 browserRoot，禁止 bare imports 和 private PI WEB imports。
- 插件包扫描存在 4,096 entries / 16 MiB 限制，不把整个 monorepo、模型权重、语料、评测输出装成 PI WEB 插件。
- 固定宿主兼容矩阵、Pi SDK 和 schema 版本；通过 health/capabilities 报告 service API 版本。
- PI WEB Package manager 只是安装资源，不等于启动 pi-knowledge 服务；安装文档分开说明。

## 4. 数据归属与 Scope

### 4.1 两种身份必须分开

- `context.machine.id` 是当前 Gateway 的路由/缓存身份，不能成为全局永久数据主键。
- pi-knowledge 自己生成持久 `installation_id`，代表一个数据安装实例。
- 服务端创建 `knowledge_workspace_id`；保存 PI WEB project/workspace 的外部绑定，以及 canonical realpath。
- 多个 Gateway 访问同一目标不能创建多份知识；PI WEB provider 改变、路径移动或机器迁移后通过显式 rebind 处理。

目标绑定来源是宿主传给 server entry 的 `project/workspace`，不是浏览器 JSON 自报的 path、machineId 或 source scope。

Pi Extension 根据真实 ctx.cwd 解析已注册绑定；没有绑定时返回 setup-required，不能默认暴露整机知识。

### 4.2 Worktree 默认规则

V1 **默认隔离**。

- 不因为 Git remote 相同、目录名字相同就共享知识。
- 一个 Source 属于一个 Knowledge Workspace；Collection 是 Workspace 内的分组，不是权限系统。
- 主工作树删除/重新创建不会自动迁移知识。旧资料保留，可手工 rebind。
- 共享 Library 以后显式增加；现在不为了共享再建权限层。

### 4.3 Ask 固定 ScopeManifest

每次 Ask 创建不可变清单：

```text
knowledge_workspace_id
selected source_version_ids
selected parsed_artifact_ids
eligible index_build_ids / query embedding profile
retrieval config revision
model / prompt / tool policy revision
```

用户选择“当前版本”时，在提交 Ask 时解析为明确 ID，不在每次 tool call 时追随 Source 更新。Collection 也在提交时展开为固定成员清单。

历史对话只是上下文，不自动成为本次证据。每次生成重新验证当前允许的 Evidence。

## 5. 数据模型与关键不变量

### 5.1 最小实体

| 实体 | 关键字段/关系 |
|---|---|
| Workspace | id、installation、canonical root、外部绑定、状态 |
| Collection / Membership | workspace、name、source_id；薄关联即可 |
| Source | workspace、kind、title、origin、active_version/build、archive 状态 |
| SourceVersion | source、raw_blob_hash、采集时间、媒体类型/编码、大小；不可变 |
| ParsedArtifact | source_version、parser/config fingerprint、canonical_text_hash、mapping hash；不可变 |
| IndexBuild | artifact、chunker/tokenizer/embedding build fingerprint、状态、统计 |
| Chunk | build、artifact 范围、检索派生字段；可删除 |
| Evidence | workspace、artifact、start/end、quote、quote_hash、locator snapshot；不可变 |
| AnswerRun | ScopeManifest、状态、预算、配置、错误、可选 Pi session 关联 |
| RunEvidence | run_id、attempt_id、evidence_id、交付位置/截断信息 |
| AnswerRevision | run、blocks、createdAt；不可变提交产物 |
| Note / NoteRevision | current revision、parent revision、blocks、原 AnswerRevision、编辑来源 |
| Job / Attempt | 输入指纹、状态、租约、fencing token、尝试、错误、产物 ID |

可先把固定结构的 blocks/ScopeManifest 存为校验过的 JSON；Evidence、revision、scope 等需要查约束和联接的部分保持实体/关联表。不要求每个小字段都拆表。

### 5.2 SourceVersion 与构建指纹

- 原始字节变化才新增内容版本；仅标题/标签修改不是新资料版本。
- 同一 Source 同一 raw hash 重复导入应幂等；A→B→A 的再次选用可以记录观察时间，不复制同一不可变 blob。
- Parser 版本/规范化变化新增 ParsedArtifact；旧引用继续指向旧产物。
- Chunker、词法派生策略、Embedding 模型变化新增 IndexBuild。
- **RRF 权重、Top K、查询预算、排序参数属于 RetrievalRun 配置，不应强迫全量重建 Embedding。** 将 V0.2 的宽泛 Retrieval Config 从 IndexBuild 指纹中拆开。
- Embedding 缓存键至少包含模型/版本、维度、输入模式与预处理指纹、文本 hash；相同维度并不意味着同一向量空间。

### 5.3 Evidence 稳定范围协议

V1 固定为 canonical UTF-8 文本的 **字节范围 `[start_byte, end_byte)`**：

1. 范围两端必须在 UTF-8 字符边界，不能割开中文/emoji。
2. quote 必须逐字等于该范围解码结果；程序构造，不接受模型传任意 quote。
3. canonical artifact 保存原始 MD/TXT 的稳定规范化文本，不使用 tokenizer 派生文本作为原文。
4. heading/line/page 是展示 locator，字节范围和 artifact hash 才是稳定锚点。
5. 换行规范化、BOM、Unicode 规则必须版本化。原始字节快照仍保留。
6. Source Viewer 默认打开当时版本，另给“查看最新资料”，绝不能静默跳最新文件。
7. 同一段重复文字不能仅靠字符串搜索定位。

### 5.4 Stable 不等于永久保留全部数据

- Stable 的含义是“引用有效期间不可变”，不是所有失败构建、所有中间产物永久存储。
- 已保存 Answer/Note revision 引用的 Evidence、artifact、source snapshot 必须 pin。
- 正在运行的 Ask 对使用中的 build 建 lease/pin；因此 IndexBuild 不是可不检查地随时删除。
- 无引用、无运行租约的旧索引可 GC；保留构建元数据便于审计，不保留所有大向量。
- 未保存回答设置明确保留期，例如 30 天起步；UI 告知到期策略。保存笔记后 pin 相关证据。
- V1 UI 优先 archive。彻底删除必须显示受影响回答/笔记、确认并让引用成为 tombstone；不能偷偷以最新资料替代。
- 彻底删除语义包含服务持有的 quote 副本；已经导出的 MD、Pi 历史会话和旧备份无法自动撤回，必须说明。

### 5.5 Saved Note 是新的可靠性边界

- 笔记编辑采用 immutable NoteRevision + 乐观并发控制 `expectedRevision`；冲突返回 409，不覆盖别人/另一标签页的修改。
- 用户改动块文本后，该块原来的语义支持状态变为 `unchecked`；不能继承绿色 supported。
- 引用存在性可以继续有效，但“文本仍被证据支持”需重新判断。
- 回答和笔记区分 `generated / user-edited` 来源。
- Notes 默认不自动重新入库；避免生成文本被反复检索当成原始权威证据。以后显式导入时标为 generated/user-authored source。
- 导出 Markdown 包含脚注、资料名、采集时间、artifact/range/hash、实际引用摘录。即使在线深链接不可用仍能理解出处；不带访问 token。

## 6. 导入、更新与索引发布

### 6.1 输入策略

V1 接受 UTF-8 MD/TXT，建议单文件先限制 10 MiB，所有文本处理按流/预算限制；非 UTF-8 提示转码，不猜编码后静默改变证据。

两条入口：

1. Workspace 文件选择：提交相对路径，不接受任意绝对路径。
2. 浏览器文件：通过宿主公开文件上传 capability 写入用户确认的 staging 路径，再提交导入。若当前宿主不具备需要的上传能力，先让用户通过 Files 上传再选文件，不另造私有上传协议。

staging 文件是否留在 Git 项目内必须提示；建议用户确认后加入忽略规则，不在本轮自动修改仓库配置。

不能把 `files.readFile()` 的 truncated preview 当成完整导入内容。

### 6.2 Pipeline

```text
Submit import job
 → Validate workspace scope / format / limits
 → Open source safely / capture bytes
 → Persist raw content-addressed blob
 → Commit SourceVersion
 → Parse canonical artifact + mapping
 → Build staging lexical/vector indexes
 → Validate completeness
 → Publish active pointers in one transaction
 → Ready
```

- SourceVersion 表示 Worker 实际捕获的字节，不声称等于用户点击时的内容。
- 若调用者提供 expectedHash，执行时不匹配必须报 source-changed，不静默读取另一个版本。
- 打开文件后做一致性/变化检测，并对实际捕获的 buffer hash；同一份快照驱动 Parse 和 Index。
- `realpath` + containment 是基线；防符号链接替换的 TOCTOU，不能只在排队时检查。必要时限制路径组件/使用安全 open 策略，加入对抗测试。
- 默认敏感文件 guard 覆盖 .env、凭证、SSH key 等，不能把文件扩展名当唯一判断。

### 6.3 原子切换与并发更新

- 建 B 时 A 继续查询；B 全部成功并验证后短事务切换。
- 每个 Source 用 generation counter/CAS：较早启动、较晚完成的更新不能覆盖更新的目标版本。
- ready build 的 FTS/vector/Chunk 必须对应同一 artifact 与 embedding profile。
- 未完成或失败 build 永不参与召回。
- 同一查询使用固定 build 集；发布和 GC 不能破坏正在运行的查询。
- 批量导入 V1 为每个 Source 独立原子发布；不承诺整个 Collection 同时切换。Ask manifest 给出本次实际集合。

## 7. Retrieval 实现与评测

### 7.1 四组候选公平比较

- A：有预算的小语料 full context / direct read；这是回答基线，不与 Chunk ranking 混算 MRR。
- B：FTS5 lexical。
- C：Dense。
- D：FTS5 + Dense + RRF。

使用同一 corpus、相同可访问范围、相同证据 token 预算、相同回答模型/Prompt。分别报告 retrieval 与 end-to-end task 成绩。

在大语料上 full context 放不下时明确标不适用，不通过静默截断获得虚假成绩。

### 7.2 词法基线

默认 tokenizer 的 Unicode 词边界不等于中文分词，也不等于完整 code symbol 匹配。

候选实现顺序：

1. FTS5 unicode61 原文基线，记录缺陷。
2. 应用层中文分词（例如固定 ICU/Node 的 Intl.Segmenter，或一个锁版本分词库）+ 同构 query 规范化。
3. 独立 code symbol 派生字段：保留完整规范形式、camelCase/snake_case 拆分、版本号/错误码可检索形式。
4. 需要子串时额外测试 CJK bigram/trigram；不把它当万能中文 BM25。

保存 tokenizer/ICU/字典指纹；normalize 不改 canonical artifact。安全构造 MATCH 表达式，用户文本不能直接成为 FTS 查询语法。

标题、正文、符号分别设有限固定权重；由小型评测选择，不建设配置平台。

### 7.3 Chunk 与补读

MD AST 按 heading/paragraph/list/code/table 切分，普通文本起点 400–800 tokens；超大代码/表格拆分保留父级定位。相邻补读也必须在固定 artifact 范围内。

每路候选起点 30–50，融合后选约 8–12 个片段，但最终受证据总预算限制，例如 8k tokens。重叠/重复证据折叠，必要时增加来源多样性；所有参数记录在 Run。

RRF 只融合 rank，不把原始距离/BM25 分数直接相加；RRF 分数不是拒答置信度。

### 7.4 Dense 与 sqlite-vec 决策

先支持一种 embedding profile；不混用不同模型向量。不需要通用可插拔 vector 平台，只保持一个小 search/index adapter 接口。

推荐候选：一个本地多语模型（例如 multilingual-e5-small 类轻模型）、一个较大多语模型（例如 BGE-M3）、一个用户批准的云 Embedding；最多先比较两种适配本机的候选，许可证、runtime、维度和模型输入前缀先检查。

禁止未经许可下载大型模型或把私人 corpus 发到云端。固定模型文件/版本/hash；聊天模型配置不等于 Embedding API。

sqlite-vec 必须单独验证：加载、重启、目标系统安装、按 Workspace/Collection/Version **限制后** KNN、并发、内存、容量与 p95。不先全库 Top K 再过滤。

如果某版本 sqlite-vec 不支持所需过滤，则在小数据集用预筛候选向量精确扫描作为基线或调整 schema；不要假装 filter 后 Top K 等价。

Reranker 仅在候选召回已足够、排名仍显著错误时加入。

### 7.5 Corpus 与指标

起点 60–100 条真实 Query，建议 80 条：50 调参、30 holdout。类别可重叠，但无答案/冲突/中文/精确符号必须有明确样本。

候选 corpus：

- 当前项目自己写的 PRD、设计、README：可做工程 smoke，不自动视为完整真实语料。
- 用户指定版本的 React、TanStack Router 或其他实际学习文档，保留出处/许可和采集说明。
- 人工构造少量版本冲突、同名符号、资料不足、Prompt Injection fixture，与真实语料分层报告。

标签形状：query、scope manifest、answerability、分类、gold evidence groups（artifact stable range），多来源题定义必须覆盖的证据组，不把命中任意一段当完整命中。

指标：Recall@10、MRR、按类失败；多证据题单列 all-required-groups coverage。按证据组/范围命中去重，不让 overlap chunk 虚增 recall。

暂定门槛：

- 可回答题 Recall@10 ≥90%，精确 API/版本类不能被平均值掩盖。
- 发布样本 invalid citation / scope error 为 0；它是观察值和门禁，不是对所有未来输入的数学保证。
- 人工拆分关键事实计算 unsupported claim rate，目标 ≤5%；不能用含多事实的大 Block 隐藏错误。
- 正确拒答、错误拒答分别列出分母和失败样本。
- reference target：1万 chunks、无模型调用的检索 p95 ≤500ms；10万 chunks 为压力档，不是首发承诺。Query Embedding/LLM/网络分别计时。
- 小样本结果只做初步证据；保留原始计数、模型版本、成本，不通过不停改 holdout 来达标。

### 7.6 自建 vs 复用验收

选择最多两个现成产品（优先 AnythingLLM、Open WebUI Knowledge），对照用户同一组 10–20 个任务：

- Pi 工具接入是否可用；
- 固定版本与历史引用是否可保持；
- Workspace 范围与中文代码检索；
- 笔记编辑/导出；
- 运维与定制成本。

不因其有 RAG API 就认定可以替代 Evidence 生命周期，也不在没有试用前认定它们不够好。本轮没有运行这个对照，Go-to-full-build 必须保留此门禁。

## 8. Knowledge Ask 与 Pi Coding Extension

### 8.1 受限 Session 配置原则

本机实际解析的 Pi SDK 为 **0.84.4**，不是 PI WEB devDependencies 写的 0.85.1。已用离线受限环境验证四工具注册表、reload 后仍无资源加载；不能据此宣称真实模型 Prompt Injection 已完全防住。正式项目锁定测试过的 SDK 及其 pi-ai/agent-core 组合，避免独立模块副本的注册状态混用。

- 不复用正在 Coding 的 Session，不使用 PI WEB startSession helper 替代受限 SDK 初始化。
- 用自定义空 ResourceLoader：扩展、Skills、Prompt Templates、AGENTS/SYSTEM 文件全部为空，只提供应用受控系统 Prompt。
- `SettingsManager.inMemory`；禁用 SDK 自动 retry/compaction、skill commands，由应用管理预算和重试；隔离 agentDir/cwd，不能以只设置 tools 为隔离手段。
- 仅注册 knowledge_search、knowledge_read、knowledge_sources、submit_answer；显式 allowlist。
- `SessionManager.inMemory`；权威 AnswerRun、Evidence、产物存 SQLite；SDK 临时 Session 消失不丢产品状态。
- 持有的 ModelRuntime 也必须受控，不能为了复用 Provider 自动执行全部用户扩展。
- 具体创建方式和限制以核查报告为准，并加入“不加载用户资源”的回归测试。

这隔离的是模型可用能力和上下文来源，不是 OS 沙箱。进程自身仍需要访问 DB/模型网络；模型不能选择新地址、读任意路径或新增工具。

### 8.2 Provider 与凭证

- pi-knowledge 自己拥有公开 SDK ModelRuntime；不读取 sessiond 内存，不调用 PI WEB 私有 Provider 接口。
- 优先明确配置内建 Provider 的 API key / 受控本地 endpoint。共享 auth 文件需确认 SDK 支持并验证 OAuth 刷新写入并发，不能把它当只读文件。
- 本轮合成凭证测试发现：默认 AuthStorage 的 `!command` key 在 `ModelRuntime.create` 的本地刷新阶段就可能尝试执行命令，`allowModelNetwork:false` 不阻止此行为。应通过公开 `readStoredCredential` 读取指定原始值后严格过滤，注入批准的 CredentialStore；默认拒绝命令型值。
- 0.84.4 可用 `ModelRuntime.create({ credentials, modelsPath: null, allowModelNetwork: false, refreshOnCreate: false })`；避免默认发现用户模型配置。模型目录刷新关闭不等于禁用后续模型推理网络，后者由数据政策另行控制。
- 不默认支持“只在 PI WEB 全局扩展中注册”的自定义 Provider；V1 提示使用明确受控配置。
- 模型配置可能支持命令展开或自定义代码，不能直接把全套 models.json 当无害数据。白名单解析或专用配置优先。
- 缺模型/凭证时返回 setup-required；不静默换 Provider、不同模型或云端。
- 模型出站目标由用户配置，资料和模型输出均不能重写。

### 8.3 工具契约

| 工具 | 模型可提供 | 服务端固定/强制 |
|---|---|---|
| knowledge_sources | 分页/关键词 | 当前允许资料与版本，不暴露整机 Source |
| knowledge_search | query、有限 limit | Run Scope、可查询 builds、token/结果预算 |
| knowledge_read | result/evidence handle、有限上下文范围 | artifact、源版本、范围上限；无任意路径/URL |
| submit_answer | blocks、evidence handles、证据不足说明 | JSON schema、交付集合、范围/quote/预算校验、最终提交 |

所有模型可见 handle 都绑定本 Run/attempt。真实 Evidence ID 可稳定，但是否允许引用取决于本次交付集合，不取决于 ID 是否猜中。

Coding Extension 用相同服务查询层，但调用方是普通 Coding Session，不显示为“已通过严格 Ask 校验”。它不提供 import/delete/reindex 等模型可调用变更工具。

V1 的可点击引用先保证在 **Knowledge Ask / Notes Panel 内**成立。Coding Chat 中先输出来源、版本、摘录及 Evidence ID，Panel 支持按 ID 打开；不要假设 Pi TUI renderer/Markdown transformer 会自动在 PI WEB Chat 生效。跨 Chat→Panel 的一键深链接要单独验证公开导航契约；不能硬编码私有宿主 URL。导出含摘录保证离线可理解，不宣称已经完成跨 Gateway 永久链接。

### 8.4 Answer 流程

```text
Create AnswerRun + immutable scope + budget
 → enqueue
 → controlled initial retrieval（不能只等模型自觉搜索）
 → bounded Pi retrieval/read loop
 → submit_answer(blocks)
 → deterministic validation
 → commit AnswerRevision
```

- 引用必须对应实际进入本次模型输入的文本。截断后不可引用未交付的后半段。
- 扩展 read 返回更多上下文时生成/登记对应 Evidence 范围。
- 检索分数低不是证据绝对不存在；资料冲突分别展示。
- `submit_answer` 之外的自然语言可作草稿，不能直接成为 validated 最终产物。
- `terminate:true` 不是立即强制停止：当前 SDK 只有同批工具结果全部要求终止时才终止。要求 submit_answer 独占提交批次，并由宿主对提交后的队列、重复提交、迟到工具调用做状态 fencing；不能只依赖 Prompt 或 terminate 标志。
- 建议默认上限：20 tool calls、120 秒软 deadline、明确 max output/context tokens；超限失败或返回已持久化草稿，不循环无限修复。
- 原始问句和生成结果按敏感数据处理，不默认写完整日志。

### 8.5 引用状态：三轴而不是一个布尔值

```text
integrity: valid | invalid
semantic: unchecked | supported | unsupported | uncertain
review: unreviewed | user-reviewed
```

V1 不启用 Automatic Reviewer 时，semantic 默认 `unchecked`。UI 显示“引用可追溯，内容待核查”，而不是绿标“事实正确”。

模型自己输出 supported 不能作为检查结果。后续 Checker 单独记录 model/config、被检查的 revision、时间和不确定性；用户编辑后使其失效。

抽样人工 Grounding evaluation 是 V1 Must；在线语义 Checker 不是 V1 必选。二者不要混淆。

### 8.6 后续提问

V1 支持基于同一选定资料继续提问，但每轮是新的 AnswerRun。选定范围变化后显式创建新 scope；先前答案可作为标注为 generated 的对话上下文，不能充当 evidence。

上下文压缩若发生，权威 evidence 仍在服务端；模型实际交付记录需要重新建立，不把摘要里的引用 ID 当原文仍然可见。

## 9. API 与 Adapter 契约

建议一个版本化 `POST /v1/dispatch` 作为薄 RPC 入口，加 `/v1/health`。传输 shape：

```json
{
  "apiVersion": 1,
  "requestId": "uuid",
  "operation": "ask.create",
  "scope": { "workspaceId": "server-bound-id" },
  "input": { "question": "...", "sourceVersionIds": ["..."] }
}
```

Adapter 从宿主验证过的 workspace 映射 scope，不能直接转发浏览器自报 scope。不同 operation 用独立 schema，不用 any。

最小 operation 集：

| 操作 | 结果 |
|---|---|
| capabilities.get / workspace.resolve | API 版本、绑定、服务安装身份、功能；不含秘密 |
| sources.list / sources.import / sources.update / sources.archive | 列表或 jobId |
| search.query / evidence.read | 有限结果或不可变 Evidence |
| ask.create / answers.get | jobId / runId 或 AnswerRevision |
| jobs.get / jobs.cancel / jobs.retry | 状态和尝试信息 |
| notes.create / notes.list / notes.get / notes.revise / notes.export | 有版本的笔记或导出文本 |
| indexes.rebuild | jobId |

Backup/Restore/Purge 先用同机人工 CLI，别把高影响运维动作暴露给 LLM；不要求 V1 UI 完整实现运维控制台。

错误 envelope：`code, message, retryable, requestId`；建议 codes 包括 scope-mismatch、source-changed、unsupported-host、service-unavailable、invalid-evidence、revision-conflict、budget-exceeded。

客户端不能把任何错误转换成成功空列表。重试有幂等键；幂等键复用但 input hash 不同返回冲突。

## 10. Jobs、故障恢复与资源预算

### 10.1 状态与租约

`queued → running → succeeded | failed | cancelled`。

Job 存储：kind、scope、input version/hash、idempotency、attemptCount、nextRunAt、leaseOwner、leaseExpiresAt、heartbeat、fencing token、deadline、cancelRequested、output reference、bounded error。

- V1 单 Worker owner、有限并发即可；心跳/租约用于进程崩溃恢复，不是分布式队列。
- 不跨模型 API 调用持有 DB transaction。
- 完成提交需检查当前 fencing token 和 cancelRequested；迟到旧 Worker 不能发布产物。
- 失败分类：永久错误不重试；临时网络/限流有限指数退避；用户取消不自动重试。
- 系统恢复可重做确定性解析/索引；模型执行中断不能保证不重复计费，记录 attempt 后明确重试策略。
- 默认最多 3 次基础设施尝试；LLM 答案修复最多 1 次，且不隐式扩大预算。

### 10.2 初始资源预算

- 同时 1 个导入/重建重任务、1 个 Ask；后续根据响应时间调整。
- 单文件 10 MiB 初值、读取响应建议 ≤128 KiB、分页来源列表、证据总 token 上限。
- 解析/Embedding 大任务在内部受控 worker/subprocess 执行；模型 Worker 只拿需要的凭证与数据。
- 独立 systemd 服务可设 MemoryMax/CPUQuota/TasksMax；数值用实测选，不因为本机有 62 GiB 就省略限制。

### 10.3 观测

结构化日志仅含 request/job/run/build ID、阶段、耗时、重试次数、token 用量、错误码；原文和 credentials 默认不记录。

health 不依赖每次联系云模型；readiness 区分 DB/migration、Worker、模型配置与可选 Dense。

## 11. Backup、Migration 与运维

### 11.1 数据目录

建议 `$XDG_DATA_HOME/pi-knowledge/<profile>/`：

```text
metadata.sqlite
blobs/sha256/...
artifacts/...
staging/...
```

配置、token 存独立受限目录，不在 Workspace、plugin package 或 browserRoot。SQLite 在目标机器本地磁盘，V1 不支持 NFS 上共享写库。

### 11.2 Backup 最小可靠实现

V1 人工 CLI：

1. 进入维护状态，暂停新变更和 GC，等待正在提交的任务到安全点。
2. 使用 SQLite backup API 或停写后的受控一致性方案，不直接只复制 WAL 模式的主文件。
3. 生成 DB snapshot 和其引用的 blob/artifact manifest，复制并验证 hash。
4. 写 backup manifest（schema/app 版本、installation ID、文件 hash），最终原子命名完成包。
5. 恢复先到新目录，校验 DB integrity、外键与所有被引用 blob，再切换服务路径。
6. 默认不含密钥，必要时用户单独加密备份；恢复后重新绑定凭证。

GC 与备份互斥。恢复演练必须离线打开旧 Evidence 和已编辑 Note，不能只证明 sqlite 文件可打开。

### 11.3 Migration / Rollback

- 编号 SQL migrations、schema_version、升级前备份。
- 进程启动发现比自己新的 schema 拒绝写入。
- 不承诺自动 down migration；回滚使用升级前备份，或明确版本兼容区间。
- 重建索引不是恢复遗失原文的手段；权威快照损坏必须显式报错。

### 11.4 保护当前运行环境

本会话由现有 PI WEB daemon 托管，禁止在这里重启/停止该 daemon。

Spike 如启动额外 PI WEB，必须使用不同 PI_WEB_DATA_DIR、PI_WEB_CONFIG、PI_WEB_SESSIOND_SOCKET 或端口、PI_WEB_PORT，并使用隔离 Pi agent profile，避免复制现有敏感配置。

生产升级由用户在维护窗口执行；需要升级宿主时先 web/API，再目标 sessiond，随后刷新浏览器。独立知识服务可单独重启。

## 12. 安全发布门禁

1. **Source injection**：无 shell/write/arbitrary read/network tool；不自动加载项目/global 资源。
2. **Scope isolation**：所有查询、read、answer、note、job 复核 Workspace；试图引用别的 Workspace 的真实 Evidence ID 也失败。
3. **Source file safety**：路径穿越、symlink escape、变化竞争、超大文件、敏感文件拒绝策略有测试。
4. **API access**：Loopback + 服务 token；仅服务器持 token；Host 允许列表；不提供 browser CORS。未来 Companion 才单独增加精确 Origin/CSRF 设计。
5. **Authenticated adapter**：只接受枚举操作与宿主绑定范围；没有用户输入可控制的代理目标/headers。
6. **Rendering**：资料/答案/笔记都禁止原始 HTML 或严格 sanitize；禁不安全 URL 协议；外部图片默认不加载；代码不执行。
7. **Cloud policy**：默认不发送；用户选择模型并确认 provider/数据种类后授权。Embedding 常发送全部 chunk，Ask 发送问题和证据，不能混为一谈。
8. **Provider config**：无任意命令插值/extension 自动执行；token 不进模型输入、导出和诊断。
9. **Fleet**：gateway 不复制模型密钥，但被授权处理/转发资料响应；不能宣传“证据完全不经过 gateway”。断网/旧版本/目标切换必须 fail closed。
10. **Resource containment**：超时、大小、并发、成本上限；第三方 Parser 后续再加无网络子进程防护。

这些防护针对单用户可信宿主中的不可信资料，不是多租户安全承诺。

## 13. 测试矩阵与 Done 标准

### Unit

- raw/content/config hash、UTF-8 range、重复文本定位、行映射、AST splitting。
- Query normalization、安全 MATCH、RRF、重叠去重。
- ScopeManifest、Evidence membership、Answer/Note revision 校验。
- Job 状态、lease/fencing、取消后迟到结果。

### Integration

- SQLite FTS 和可选 vec；metadata/FTS/vector 一致发布。
- Rechunk/reparse 后旧 Evidence 不变；build GC 不影响引用。
- 两个 Source 更新逆序完成；较旧 Job 不覆盖较新版本。
- crash/restart、幂等重试、磁盘满、备份恢复、schema 不兼容。
- 空 ResourceLoader + 含恶意 fixture 的全局/项目目录，断言无代码加载/无工具新增。
- 源文截断、不同版本/不同 Workspace Evidence 被拒绝。
- Note 编辑后 supported 失效，乐观锁冲突。

### Contract

- Browser v2 + paired request v1；旧 host 显示不兼容。
- Gateway/target lifecycle/revision 不匹配；不 fallback。
- server entry 不声明 provider；Git 和 folder workspace 都能使用 Knowledge。
- JSON 上限、取消传播、job submit 后连接丢失但可恢复查询。
- Pi Extension 与 service API 版本、错误码、工具输出预算。

### E2E

```text
Upload/select MD
 → Import + Ready
 → Search
 → Ask
 → Click citation to pinned historical text
 → Save Note
 → Edit + reopen
 → Export
 → Update source + reindex
 → Original note citation still resolves
```

分别覆盖本机和隔离的 gateway/target 测试实例；两个本机实例只证明多 hop 路由，不等于真实远端网络/代理部署验收。

### V1 发布必须同时通过

- 产品闭环含 Saved Note 编辑/重开/导出。
- 支持范围内没有已知 P0/P1 失效路径。
- 参考机检索/资源目标与真实数据质量报告。
- 所有引用范围、越权和历史恢复回归测试通过。
- 用户真实任务相对 direct-file baseline 有可观察价值。
- 兼容宿主构建、发布/安装方式、备份恢复步骤明确。

## 14. 最小风险实施顺序

| 阶段 | 交付 | 出口 / Stop 条件 |
|---|---|---|
| P0a 宿主兼容 Spike | 锁定 main commit/未来 release；非 provider paired request thin adapter；fake service | Git/folder 工作区可路由，旧版可诊断；失败不 claim Git、不 Fork |
| P0b 安全与部署 Spike | 空资源受限 Session、凭证/工具白名单、SQLite driver/vec 加载候选 | 无默认资源执行；不发真实私人资料；driver 可部署 |
| P0c 边界 Spike | gateway/target 路由、取消、服务断连、包 revision、JSON 限制 | 桥接契约成立；无真实 remote 时保留远端发布门禁 |
| P1 Evidence slice | MD/TXT capture→artifact→FTS→Evidence Viewer；最小 Jobs/migration/backup | 重建/重启/恢复后 Evidence 可打开；不可丢权威数据 |
| P2 Retrieval evaluation | 真实 corpus/labels，词法→Dense→Hybrid 对照；现成产品对照 | 选择最终 retrieval stack；不达标先改输入/检索，不做 Course |
| P3 Ask + Notes | 固定 scope、受限 Pi、submit_answer、引用校验、保存/编辑/重开/导出 | 通过完整 V1 E2E 与人工 Grounding 标注 |
| P4 试用与发布 | 故障 UX、性能、迁移演练、用户对照任务 | 有长期使用价值，发布兼容版本与数据政策 |
| P5 V1.1 | Goal→Outline→用户确认→Chapter→Revision | 建立在已验证 Knowledge 上，不反向阻塞 V1 |

依赖可并行但出口不能跳过：知识数据 slice 不必等待 UI 上游发布；正式集成发布必须等宿主兼容。Golden Dataset 的收集从 P0 开始，不等 P2 才临时编题。

不先承诺日历工期；P0 后按实际 API、检索与部署发现估算。不能把主分支“有接口”当作整个 Fleet E2E 已完成。

## 15. V1.1 课程演进

只增加：

- LearningGoal、固定 ScopeManifest。
- 可编辑 OutlineRevision。
- Source section ↔ chapter 覆盖表。
- ChapterAcceptedRevision / ChapterCandidateRevision。
- 逐章 Job、引用校验、用户 Accept/Discard/Compare。

不增加 Course Service、图数据库、Workflow DSL、四 Agent framework。Writer/可选 Reviewer 使用独立短上下文，共用现有 job/evidence/revision 机制。

Coverage 只展示纳入/未覆盖/无证据，不证明课程完整。PDF 与 URL 的优先级取决于试用资料需求，与 Course 版本号独立；没有真实需求前不提前选 Parser 或抓取栈。

## 16. 新增/修订 ADR

- ADR-017：正式集成使用 **package-paired request v1**；旧 owner-backed backend 不适合 Knowledge。
- ADR-018：声明宿主 capability 与锁定构建；不把尚未 npm 发布的 main 能力记为已部署。
- ADR-019：Jobs 在独立服务，宿主 callback 仅短请求；不依赖长期 plugin background API。
- ADR-020：Evidence 采用不可变 artifact + UTF-8 byte range + exact quote；解析重建不重定向引用。
- ADR-021：构建配置与查询配置分离；RRF/Top K 变化不自动触发 Embedding 重建。
- ADR-022：Ask 固定 ScopeManifest，run-scoped delivered evidence allowlist。
- ADR-023：integrity/semantic/user review 分离；没有 Checker 时 semantic=unchecked。
- ADR-024：Note 编辑创建新修订并失效语义判定；Notes 默认不重新入库。
- ADR-025：Worktree 默认隔离，机器路由 ID 不作为永久存储身份。
- ADR-026：稳定对象按引用 pin，旧 build 按 lease 回收；删除和备份有明确生命周期。

## 17. 开发前仍需要的输入

这些没有被本轮技术核查自动决定：

1. 首批真实 corpus 和任务（候选为 React/TanStack Router 官方文档 + 当前项目 PRD/设计）；明确版本与可使用范围。
2. 是否允许在隔离测试实例使用锁定上游 main 构建；正式生产仍优先等含该能力的 release。
3. 模型数据政策：纯本地，或明确指定可接收资料的云 Provider；没有授权前不做云评测。
4. 是否有可用于验收的远端目标；没有则先测两个隔离实例，不能称真实 Fleet 已验收。

其余可以采用本文默认值进入 bounded Spike，无需继续扩展架构讨论。
