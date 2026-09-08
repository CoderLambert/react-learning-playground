# 核查材料与复现

2026-09-08 的环境特定 smoke，不是 pi-knowledge 产品代码、benchmark 或发布验收。

## 归档内容

- `provider-ownership-probe.mjs` / `provider-ownership-result.txt`：直接测试安装版私有 Registry 的 owner 限制，fixture provider，无浏览器/网络。
- `storage-smoke.mjs` / `storage-node24.log` / `storage-node26.log`：同一组29项断言，含 FTS tokenizer 的预期失败、scope-before-limit、简化 immutable Evidence/事务/正常重开。
- `corpus-manifest.json`：只读取当前 Workspace 三个原有文档的 hash/大小。
- `restricted-session-probe.mjs` / `restricted-session-result.log`：合成资源与假凭证，测试公开 SDK 构造；反例会尝试触发命令型凭证，但脚本拦截所有子进程方法。
- `SHA256SUMS`：归档代码/结果校验和。

脚本中安装路径/Workspace 为核查时的绝对路径；不是通用安装程序。为保持原始证据，未改写它们。**不要在本目录直接执行会生成文件的 smoke。**

生产插件严禁依赖 owner probe 使用的私有 `dist` 导入；它仅用于证明旧实现的行为。

## Storage 复现

从仓库根目录，在全新临时目录运行：

```bash
umask 077
D=$(mktemp -d /tmp/pi-knowledge-storage-replay.XXXXXX)
cp docs/pi-knowledge/verification/storage-smoke.mjs "$D/smoke.mjs"
node "$D/smoke.mjs" > "$D/node24.log" 2>&1
/home/lambert/.local/share/mise/installs/node/26.7.0/bin/node \
  "$D/smoke.mjs" > "$D/node26.log" 2>&1
printf '%s\n' "$D"
```

`node` 需先确认实际版本；本次为24.20.0。每种版本只运行一次/目录，因为脚本创建表而非清空数据库。重新运行前建新目录。数据库会写在脚本旁边；不会修改真实资料。

当前文档改变后 manifest 也会改变；不能拿新结果冒充原始语料。一次通过29项不代表向量测试通过，其中一项确认 vec_version 不存在。

## Restricted SDK 复现（Linux）

必须保留网络/文件权限隔离、假 HOME 与清空环境，不要直接 `node restricted-session-probe.mjs`。

```bash
umask 077
R=$(mktemp -d /tmp/pi-knowledge-sdk-replay.XXXXXX)
cp docs/pi-knowledge/verification/restricted-session-probe.mjs "$R/probe.mjs"
P=/home/lambert/.local/share/mise/installs/node/26.7.0/lib/node_modules/@earendil-works/pi-coding-agent
N=/home/lambert/.local/share/vite-plus/js_runtime/node/24.20.0/bin/node
(
  cd "$R"
  env -i PATH=/usr/bin:/bin HOME="$R/home" JITI_CACHE_DIR="$R/jiti-cache" \
    PI_CODING_AGENT_DIR="$R/fixture/agent" PI_OFFLINE=1 PI_TELEMETRY=0 \
    PI_SKIP_VERSION_CHECK=1 \
    /usr/bin/unshare -Urn "$N" --permission \
      --allow-fs-read="$P" --allow-fs-read="$R" --allow-fs-write="$R" \
      "$R/probe.mjs" > "$R/result.log" 2>&1
)
printf '%s\n' "$R"
```

如果系统禁用 user/network namespace 或版本不支持这些权限参数，停止并调整隔离方案，不去掉安全参数重跑。没有模型 prompt/stream。脚本中的工具只是无 I/O 的合成工具，不证明正式 knowledge_read 已安全实现。

## Owner 限制复现

```bash
node docs/pi-knowledge/verification/provider-ownership-probe.mjs
```

默认测试原本安装路径下的 `1.202609.0`，可通过 `PI_WEB_PACKAGE` 指定被审核包路径。宿主包更新后此 probe 可能需要按新的内部结构调整；不要将它作为产品集成依赖。

## 明确未验证

真实云模型与 OAuth、完整 Prompt Injection 抵抗、sqlite-vec、实际检索质量/延迟、并发与进程崩溃恢复、产品备份恢复、UI/Fleet E2E。上游 main 新 paired API 的测试源码已审核，但未运行整套上游测试。
