var e=`# Server Functions：跨越客户端与服务端的调用边界

<MentalModel title="Server Function 是远程执行语义，不是把普通函数魔法搬到浏览器">
标记为 Server Function 的函数在服务端执行；客户端引用它时，支持的 Framework 会把调用编码成网络请求，并把参数、返回值、错误与更新流程接入自己的协议。安全边界仍然在服务器：每次调用都必须重新鉴权、校验输入和授权资源。
</MentalModel>

<Timeline steps={[
  "Framework 在构建阶段识别 \`use server\` 边界",
  "客户端触发 action / Server Function 引用",
  "Framework 序列化允许的参数并发起请求",
  "服务端执行函数：认证、授权、校验、mutation",
  "结果/错误返回；Framework 可结合 revalidation、navigation 或 RSC 更新 UI"
]} />

<Experiment title="把调用当作真正的网络边界">
在中间 Demo 切换“服务端已授权”状态，再点击模拟请求，比较 accepted 与 rejected 结果。然后做威胁建模：假设恶意调用者绕过 UI、直接构造请求，哪些信息来自客户端，哪些必须由服务器重新确认？当前 Demo 只模拟授权决策，不会真的调用 Server Function endpoint。
</Experiment>

<DemoReference action="切换模拟服务端授权并发起一次模拟 updateOrder 请求" observe="确认 mutation 是否允许必须由请求时的服务端认证/授权/输入校验决定；不要把本地模拟结果当作真实 Framework 网络协议。" />

<Observation>
\`"use server"\` 声明 Server Functions，不是 Server Component 标记。Server Components 在支持 RSC 的框架里本来就在服务端模块环境执行；给组件文件随意添加 \`"use server"\` 会混淆两种完全不同的边界。
</Observation>

<Compare>
### Server Function
Framework 提供函数引用、序列化、mutation/revalidation 集成，适合框架内部的服务端动作。

### 显式 HTTP API
协议、鉴权、版本和客户端都显式可见，适合跨应用/第三方调用或需要稳定公开接口的场景。
</Compare>

<AntiPattern title="相信按钮隐藏或客户端 schema 已经授权">
任何可到达服务端的 mutation 都必须假设请求可被伪造。客户端 disabled、隐藏按钮、TypeScript 类型和前端 schema 都不是安全边界；服务端必须检查 session/identity、资源权限和输入。
</AntiPattern>

<Boundary title="React 提供语义，Framework 提供传输与部署">
React 文档定义 Server Functions 与 \`use server\` 约束；实际 endpoint、加密/引用标识、CSRF 防护、缓存失效、表单 action、部署 runtime 等由具体 Framework 实现。安全设计必须阅读所用 Framework 的当前文档。当前 Demo 只是安全决策模拟器，不验证真实 endpoint、序列化、Transition、revalidation 或 CSRF 行为。
</Boundary>

<Summary>
- Server Function 在服务器执行，客户端调用本质上跨越网络边界。
- \`use server\` 标记 Server Functions，不是 Server Components。
- 每次 mutation 都要服务端鉴权、授权、输入校验。
- 需要公共/跨客户端契约时，显式 HTTP API 仍可能更合适。
- 本地模拟可以解释 trust boundary，但真实安全性必须在 Framework/server runtime 中验证。
</Summary>

<FurtherReading items={[
  { label: "React: Server Functions", href: "https://react.dev/reference/rsc/server-functions" },
  { label: "React: use server", href: "https://react.dev/reference/rsc/use-server" },
  { label: "Next.js: Server Actions and Mutations", href: "https://nextjs.org/docs/app/getting-started/updating-data" }
]} />`;export{e as default};