# Issue Rules

本文件定义仓库 Issue 的创建、更新、执行与收口规则。

目标不是把 Issue 写成不可修改的规格书，而是让 Issue 在 **人 + ChatGPT/Codex Agent + CI + PR** 协作中持续提供高价值信息：

- 解释为什么要做；
- 明确当前期望结果；
- 标出真正不能破坏的安全边界；
- 降低多 Agent 并发修改共享热点的冲突；
- 给实现留出根据新证据修正方案的空间；
- 提供可复查的验收与 CI 证据。

> 核心原则：**约束风险，不锁死实现。Issue 是当前最佳已知执行合同，不是冻结的施工图。**

---

## 1. 基本原则

### 1.1 固定 Outcome，保留 Implementation 自由度

Issue 应明确“完成后系统/用户得到什么”，但除非某个实现选择本身就是架构约束，不要提前锁死：

- hook / controller / service 的具体名称；
- 必须修改的精确文件集合；
- 内部 API 的最终形状；
- 机械的 LOC / 文件数量目标；
- 实现步骤的固定顺序。

实现阶段允许根据代码事实选择更简单、更安全的方案。

### 1.2 固定 Invariant，允许 Working Direction 被推翻

Issue 中的信息按约束强度分三层：

1. **Invariant**：真正不能静默破坏的行为、数据、架构或验证边界；
2. **Target**：当前确认的目标状态；
3. **Working Direction**：当前优选实现方向，可以被新证据修正。

不要把 Working Direction 写成不可变 MUST。

### 1.3 Scope 可以变化，但不能静默扩张风险

实现过程中出现额外文件或内部重构是正常的。

以下变化通常可以自主处理：

- 同一 owner/domain 内的内部文件增加；
- 实现细节变化；
- focused tests 增加；
- 不改变 contract 的局部重构。

以下变化需要先重新评估并记录：

- 进入另一个 domain；
- 修改 `App.jsx` 等共享 integration hotspot；
- 修改 package / lockfile / workflow / global CSS / central registry 等 shared surface；
- 改 persistence / public API / URL state / required CI 等稳定 contract；
- 原本 refactor 变成产品行为变化。

规则不是“不能超出 Scope”，而是：

> **不能静默超出已知风险边界。**

### 1.4 Issue 可以修正，但不能为了方便而降低标准

实现证据证明原 Issue 判断错误时，应修改 Issue。

允许：

- 修正错误架构假设；
- 调整 Scope；
- 调整 AC，使其更准确；
- 拆出新的前置 Issue；
- 重新定义 implementation seam。

不允许：

- 因实现困难删除关键 AC；
- 为了让 CI 变绿删测试、扩大 timeout、滥用 retry；
- 用新的例外掩盖 architecture violation；
- 不说明原因地改变用户行为或数据语义。

---

## 2. 标题规范

保留轻量双前缀，方便 GitHub 列表、CLI、Agent prompt 在看不到 Labels 时仍能识别任务类型。

推荐格式：

```text
[类型][Domain] Outcome / Problem
```

示例：

```text
[工程][Architecture] 将 Assessment lifecycle ownership 迁入 domain controller
[工程][CI] 修复 browser scope runtime 路径漏检
[产品][Assessment] 建立 Session review 学习闭环
[内容][Learning Flow] 增加高认知负担 lesson 的 guided experiment
[Bug][Workbench] 修复 AI 对话区域无法滚动
```

标题优先描述 Outcome / Problem，不要写成纯步骤清单。

---

## 3. Issue 的最小核心结构

不是所有 Issue 都必须有十几个 section。进入实际开发前，优先保证以下信息足够准确。

```md
## Problem
为什么需要处理；当前具体问题是什么。

## Target
完成后希望达到什么状态。

## Invariants
- 真正不能被静默破坏的行为 / contract / guardrail。

## Execution Scope
Expected:
- 当前预计主要修改区域。

Sensitive / coordinate before expanding:
- shared / cross-domain / high-risk surfaces。

Out of scope by default:
- 当前默认不处理，但不是永久禁止。

## Acceptance Criteria
- [ ] 可观察、可判断的完成条件。

## Validation
Focused:
- 最相关的快速验证。

Repository / Regression:
- 必要的仓库级验证。

Required CI:
- 适用时列出 required checks。

## Dependencies
Hard blocked by:
- 只写真正阻止开工的依赖。

Conflict / shared surfaces:
- 需要串行或 integration owner 协调的区域。
```

以下 section **按需添加，不强制**：

- Evidence
- Root Cause
- User Impact
- Working Direction
- Metrics / Baseline
- Risk
- Rollback
- Migration Notes
- Architecture Debt

不要为了模板完整而填无价值内容。

---

## 4. Informative 与 Normative 内容分离

Issue 应区分“帮助理解”和“约束执行”的信息。

### Informative

通常包括：

- Problem
- Evidence
- Root Cause
- User Impact
- Background

它们解释“为什么做”。

### Normative

通常包括：

- Target
- Invariants
- Execution Scope
- Acceptance Criteria
- Validation
- Dependencies

它们定义“怎样才算安全完成”。

如果旧背景描述与后续明确修订的执行合同冲突，应以：

```text
Repository rules / architecture contract
  > 最新 Issue normative contract
  > 较早的背景或 working direction
```

为准。

---

## 5. Execution Scope 的写法

### 5.1 Expected

表示当前最可能修改的 owner-local 区域，不是绝对白名单。

```md
Expected:
- src/assessment/**
- focused assessment tests
```

### 5.2 Sensitive / coordinate before expanding

用于共享热点、跨域文件或高风险 contract。

```md
Sensitive / coordinate before expanding:
- src/App.jsx
- src/ai/**
- .github/workflows/**
- package.json / package-lock.json
```

进入这些区域前应重新判断：

- 是否仍属于当前 Issue；
- 是否会与其他 Agent/PR 冲突；
- 是否需要 integration owner；
- 是否需要修订 AC / Dependencies；
- 是否应该拆出独立 Issue。

### 5.3 Out of scope by default

表达“当前不计划做”，不是永远禁止。

```md
Out of scope by default:
- persistence schema migration
- product UI redesign
- TypeScript full migration
```

若新证据证明必须进入该范围，按 Scope Drift Protocol 处理。

---

## 6. Invariants 应少而硬

只有真正影响 correctness / compatibility / safety 的内容才放到 Invariants。

好的例子：

```md
## Invariants
- Assessment persistence semantics must remain unchanged.
- Required CI must not be weakened.
- Cross-domain composition ownership must not move back into App.jsx.
```

不好的例子：

```md
- 必须新建 useAssessmentController.js
- 必须把文件降到 300 行以下
- 必须使用某个尚未验证的 API 形状
```

这些更适合作为 Working Direction。

---

## 7. Working Direction：表达当前方案，但保留纠错空间

当 Issue 已有明确优选方案但仍可能被实现证据修正时使用：

```md
## Working Direction

当前优先考虑 domain-owned controller/facade。
命名、内部结构和具体 hook 形态可在实现时调整；
只要最终满足 Target / Invariants / Acceptance Criteria 即可。
```

如果 implementation 证明 Working Direction 错误，应更新 Issue，而不是强行实现旧方案。

---

## 8. Definition of Ready：什么时候 Agent 可以直接开工

`Open` 不等于 `Ready`。

一个实现型 Issue 适合自主开工时，至少应满足：

- Outcome/Target 足够明确；
- 关键 Invariants 已知；
- Primary owner/domain 基本明确；
- 共享/高风险 Scope 已标出；
- Hard dependencies 已说明；
- AC 可以判断完成与否；
- Validation 路径基本明确；
- 没有阻止实现的重大未决设计问题。

状态可以通过 Label 或 Issue 正文表达，仓库不强制必须采用某一组 Label 名称。

建议语义：

```text
DRAFT      仍在研究/设计
READY      可以自主实施
BLOCKED    有明确外部阻塞
DEFERRED   有价值，但当前不执行
```

如果项目使用 Agent 自动执行，应优先选择明确处于 READY 语义的 Issue，而不是看到 Open 就立即编码。

---

## 9. Observed Base 与 Execution Base

避免把审计时的旧 SHA 错当成未来开发起点。

### Observed Base

记录发现问题、收集证据时的版本，例如：

```text
Observed base: main@611a9cb...
```

用于历史可追溯性。

### Execution Base

真正开工时采用的基线，例如：

```text
Execution base: latest main after #184 merged
```

开工前应刷新当前 main/依赖状态，不应机械从陈旧 Observed Base 创建分支。

---

## 10. Dependencies：只维护真实依赖，不手工维护完整 DAG

推荐：

```md
## Dependencies

Hard blocked by:
- #183
- #184

Conflict / shared surfaces:
- src/App.jsx
- assessment runtime composition

Start condition:
- Start from fresh main after #184 is merged.
```

不要要求每个 Issue 长期手工维护：

- 所有 `Can parallel with`；
- 所有反向 `Blocks`；
- 完整任务 DAG。

这些关系容易过期。

并行安全应主要从：

- ownership/path manifest；
- Execution Scope；
- shared hotspots；
- hard dependencies；

推导。

---

## 11. Acceptance Criteria：描述结果，不混入所有测试命令

AC 应回答：

> 系统最终必须具备什么性质？

推荐按需分组：

```md
## Acceptance Criteria

### Behavior / Architecture
- [ ] ...

### Guardrails
- [ ] ...
```

测试命令、lint、build、E2E、required checks 放入 `Validation`，避免“测试绿 = AC 自动完成”的误解。

AC 应尽量：

- 可观察；
- 可判断；
- 不绑定无必要的实现细节；
- 能区分成功与部分完成。

---

## 12. Validation：从 focused feedback 到 merge-candidate evidence

按任务适用范围填写：

```md
## Validation

Focused:
- <最相关测试>

Repository / Regression:
- <canonical repository verification>

Browser:
- <适用时>

Required CI:
- React Learning Verify / verify
- Workbench Integration Verify / verify
```

验证原则：

1. 先跑快速 focused validation；
2. 再跑适用的 repository/regression gate；
3. PR 上确认 required CI；
4. 不使用删测试、扩大 timeout、滥用 retry 作为“修复”。

如果仓库已建立 `BASE_SHA / HEAD_SHA / TESTED_SHA / RUN_ID` evidence contract，则 Closure / PR 应遵守该语义，避免把 feature head 与实际 PR merge candidate 混为同一个 tested revision。

---

## 13. Scope Drift Protocol：中途发现 Issue 写错了怎么办

这是正常情况，不应强迫实现错误计划。

### Level A：局部实现调整

例：

- hook 改成 plain controller；
- domain 内增加文件；
- 内部函数/API 命名变化；
- 增加 focused tests。

处理：Agent/开发者可自主调整，PR 简要说明即可。

### Level B：触及 Sensitive / Shared surface

例：

- Assessment Issue 需要修改 AI seam；
- 需要大量修改 `App.jsx`；
- 需要调整 central registry / global CSS / workflow。

处理：

1. 暂停继续扩大改动；
2. 收集代码证据；
3. 更新 Issue scope / dependencies / AC，或添加 `[DECISION]`；
4. 重新判断与其他任务的并发冲突；
5. 再继续。

### Level C：改变核心 Contract / Outcome

例：

- persistence schema 必须迁移；
- required CI 需要改变；
- 原本 refactor 需要改变用户行为；
- 原任务实际包含一个独立的大前置迁移。

处理：

- 明确修订 Issue contract；或
- 新建独立前置/后续 Issue；
- 必要时把当前 Issue 标为 BLOCKED。

不要把重大 scope drift 埋在 PR diff 中。

---

## 14. Acceptance Criteria 修订规则

AC 不是不可修改。

允许修改 AC 的条件：

- 有新的代码/运行时/用户证据；
- 原 AC 技术上错误或过度约束；
- 修改后更准确表达真正的 Target / Invariant。

修改时应说明原因。

示例：

原 AC：

```text
App.jsx must not reference assessmentRuntime.
```

实现证据表明 composition root 合法持有 opaque runtime handle 是必要的，则可修订为：

```text
App.jsx must not inspect or orchestrate Assessment runtime internals;
opaque dependency injection is allowed.
```

这是纠错，不是降级。

禁止为了“更容易关闭 Issue”而删减关键质量要求。

---

## 15. 一个 Issue 什么时候应该拆分

不要按 LOC 或文件数量机械拆分。

优先按 **Outcome + Ownership + Independent Acceptance** 判断。

建议拆分：

- 同时存在两个独立用户/工程 outcome；
- 需要两个 domain owner 各自进行大规模修改；
- 两部分可以独立上线/验收；
- 一部分实际上是另一部分的前置 contract/migration；
- shared hotspot 无法安全并行，需要独立 integration step。

通常不必拆分：

- 同一个状态机的多个内部步骤；
- 只是文件多；
- 只是测试覆盖多；
- 同一 owner/domain 下的连续安全工作。

目标是“一 Issue 一个主要 Outcome、一个主要 Owner、一次清晰 Closure decision”。

---

## 16. 不同类型 Issue 的建议模板

### 16.1 Engineering / Architecture / CI

```md
## Problem
...

## Evidence
...（按需）

## Target
...

## Invariants
- ...

## Working Direction
...（按需）

## Execution Scope
Expected:
- ...

Sensitive / coordinate before expanding:
- ...

Out of scope by default:
- ...

## Acceptance Criteria
- [ ] ...

## Validation
Focused:
- ...

Repository / Regression:
- ...

Required CI:
- ...

## Dependencies
Hard blocked by:
- ...

Conflict / shared surfaces:
- ...
```

### 16.2 Product / Content

产品/内容 Issue 不必在 DEFERRED 阶段提前写死工程 Scope。

```md
## User Problem
...

## Evidence
...（按需）

## Desired Experience / Target
...

## Product Invariants
- source of truth
- behavior / UX boundaries

## Acceptance Criteria
- [ ] ...

## Engineering Notes
Owner / shared surfaces / implementation direction（进入 READY 前补足）

## Validation
...

## Non-goals
...
```

### 16.3 Bug / Regression

```md
## Observed
...

## Expected
...

## Reproduction
...

## Impact
...

## Suspected Scope
...

## Acceptance Criteria
- [ ] original reproduction no longer fails
- [ ] regression coverage added when practical
- [ ] adjacent behavior preserved

## Validation
...
```

---

## 17. Issue Comments：只记录高价值状态变化

不要把 Issue 变成执行日志。

推荐只在有长期价值时使用：

```text
[PLAN]      开工时确认关键范围/计划
[DECISION]  新证据导致方案、Scope、AC 或依赖变化
[BLOCKED]   明确外部阻塞
[HANDOFF]   Agent / owner 切换
[CLOSURE]   最终验收证据
```

普通测试运行、每个小步骤、临时调试日志不需要持续写进 Issue。

---

## 18. Closure Evidence

完成实现型 Issue 时，建议保留简洁、可复查的最终证据。

```md
[CLOSURE]

PR: #xxx
Merged commit: <sha>

BASE_SHA: <sha if applicable>
HEAD_SHA: <sha if applicable>
TESTED_SHA: <sha if applicable>
RUN_ID: <workflow run id if applicable>

Acceptance Criteria:
- complete / partial with explicit exceptions

Validation:
- focused: PASS
- repository/regression: PASS
- required CI: PASS

Scope deviation:
- NONE / explained

Architecture exception delta:
- NONE / linked debt item

Follow-ups:
- none / #xxx
```

不适用的字段可以省略；不要为了模板而伪造或填充无意义内容。

---

## 19. Issue 与 PR 的职责边界

### Issue 负责

```text
Why
Outcome
Invariants
Scope / Risk boundaries
Dependencies
Acceptance
Validation contract
```

### PR 负责

```text
How
Actual diff
Actual touched shared surfaces
Scope deviation
Implementation decisions
Validation results
CI evidence
```

PR 不需要复制整份 Issue。

---

## 20. Labels 与 Milestones

Labels 应用于过滤，不承担全部 contract。

建议保持克制：

- Priority：P0 / P1 / P2；
- Domain：架构 / AI / 评测 / Workbench / 持续集成等；
- State：ready / blocked / 暂缓（项目需要时使用）。

不要为了表达可以从 Issue / manifest 推导的信息，维护大量 `agent:*`、`risk:*`、`parallel:*` 标签。

Milestone 适合表达阶段性波次，例如：

- Architecture Consolidation
- CI Correctness
- Product Wave
- Content Depth

Milestone 表达“为什么这些 Issue 在同一阶段做”；Dependencies 表达“谁必须先于谁”。

---

## 21. Agent 创建 / 更新 Issue 时的规则

Agent 在创建或重写 Issue 前应：

1. 读取本文件；
2. 获取当前仓库状态与相关 Issue/PR；
3. 区分事实、推断和 Working Direction；
4. 不把未验证设计写成硬 Invariant；
5. 明确 shared/cross-domain risk，而不是把所有路径都列为禁止；
6. 避免复制过时 SHA 作为未来 Execution Base；
7. 用可验收的 AC 描述结果；
8. 将测试/CI 放在 Validation，而不是混在所有 AC 中；
9. 若 Issue 仍是研究/暂缓状态，不提前过度设计实现；
10. 更新现有 Issue 时，优先修正旧结论，而不是为了“保持原文”继续传播错误假设。

---

## 22. Agent 执行 Issue 时的 Preflight

实现前：

```text
1. Read AGENTS.md and this issue-rule.md
2. Fetch latest Issue content
3. Confirm Target / Invariants / AC
4. Check hard dependencies and open/merged PRs
5. Refresh execution base from current main
6. Identify Expected and Sensitive surfaces
7. Check concurrent tasks for hotspot overlap
8. Run focused baseline when useful
9. Implement within the current best-known contract
10. If evidence invalidates the contract, use Scope Drift Protocol
11. Validate focused → repository/regression → required CI
12. Record concise handoff / closure evidence
```

不要因为 Issue 写了某个旧 Working Direction 就强行实现已经被代码事实否定的方案。

---

## 23. 与仓库 Ownership / Architecture / CI 规则的关系

Issue 不应成为第四套 path taxonomy。

当仓库存在 machine-readable ownership / boundary manifest 时：

- Agent ownership；
- architecture tests；
- CI impact mapping；
- Issue scope review；
- CODEOWNERS（如使用）；

应尽量复用同一份 domain/path taxonomy。

Issue 只声明当前任务如何使用这些边界，以及本任务存在的特殊 shared/conflict surface。

---

## 24. 初期不要过度自动化 Issue 格式检查

优先机器 enforce 真正影响 correctness 的规则：

- import/domain boundaries；
- architecture debt 不增长；
- test inventory；
- CI impact classification；
- required validation。

不要一开始就增加复杂 Issue lint/bot 去检查每个 Markdown 标题、checkbox 数量或字段顺序。

只有当真实历史证明某个缺失字段反复导致事故，再增加相应自动化。

---

## 25. 反模式

避免：

- 把 Issue 写成冻结的施工步骤；
- 为减少 LOC 而机械拆文件；
- 将 Expected paths 当成绝对白名单；
- 把所有跨域路径直接写成 Forbidden；
- 为填模板添加没有决策价值的 section；
- Open Issue 自动等价于 Ready；
- 手工维护完整并行 DAG；
- 每个执行步骤都发 `[PROGRESS]` 评论；
- 用旧 Observed Base 启动新实现；
- CI 绿后自动认为全部 AC 完成；
- 实现发现旧 Issue 错误后仍强行遵循；
- 为了关闭 Issue 而降低 AC 或测试标准。

---

## 26. 判断这套规范是否真的有价值

执行一段时间后应观察：

- 未声明 shared-file 修改是否减少；
- 多 Agent 同文件冲突/rebase 是否减少；
- Agent 开工后重新澄清 Scope 的次数是否减少；
- CI/测试遗漏导致的返工是否减少；
- Agent 一次完成 AC 的比例是否提高；
- Agent handoff 后能否直接继续而无需重新调查。

如果某条规则不能改善这些指标，也没有明确的 correctness / audit 价值，应考虑删除或简化。

---

## 最终准则

Issue 规范服务于执行，而不是执行服务于规范。

长期保持以下四条即可判断方向是否正确：

1. **Outcome 明确，Implementation 不锁死。**
2. **Invariant 稳定，Working Direction 可以被证据推翻。**
3. **Scope 可以调整，但 shared/cross-domain 风险不能静默扩张。**
4. **Issue 可以被修正，但不能为了方便而降低验收和验证标准。**
