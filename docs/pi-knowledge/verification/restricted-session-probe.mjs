import assert from 'node:assert/strict';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import cp from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = dirname(new URL(import.meta.url).pathname);
const P = '/home/lambert/.local/share/mise/installs/node/26.7.0/lib/node_modules/@earendil-works/pi-coding-agent';
const cwd = join(root, 'fixture/project');
const agentDir = join(root, 'fixture/agent');
for (const dir of [cwd, agentDir, process.env.HOME]) fs.mkdirSync(dir, {recursive:true});
const reads = [];
const execAttempts = [];
const networkAttempts = [];
const outsideProbes = [];
const originalExists = fs.existsSync;
fs.existsSync = function(path) {
  const p=String(path);
  if(p.startsWith('/') && !p.startsWith(root+'/') && p!==root && !p.startsWith(P+'/') && p!==P) {
    outsideProbes.push(p); return false; // Synthetic absence, never read outside allowlist.
  }
  return originalExists(path);
};
for (const key of ['exec', 'execSync', 'execFile', 'execFileSync', 'spawn', 'spawnSync', 'fork']) {
  cp[key] = (...args) => { execAttempts.push(key); throw new Error('PROBE blocked child process'); };
}
for (const obj of [fs, fsp]) {
  for (const key of ['readFile', 'readFileSync', 'readdir', 'readdirSync']) {
    if (typeof obj[key] !== 'function') continue;
    const original = obj[key];
    obj[key] = function(path, ...args) { reads.push(String(path)); return original.call(this, path, ...args); };
  }
}
globalThis.fetch = async () => { networkAttempts.push('fetch'); throw new Error('PROBE blocked fetch'); };
syncBuiltinESMExports();
const sdk = await import(pathToFileURL(join(P, 'dist/index.js')));
const ai = await import(pathToFileURL(join(P, 'node_modules/@earendil-works/pi-ai/dist/index.js')));
const {createAgentSession, createExtensionRuntime, defineTool, ModelRuntime, SessionManager, SettingsManager, DefaultResourceLoader, readStoredCredential} = sdk;
console.log(JSON.stringify({test:'exports', version:sdk.VERSION, AuthStorage:typeof sdk.AuthStorage, ModelRuntime:typeof ModelRuntime, readStoredCredential:typeof readStoredCredential, rootGetModel:typeof ai.getModel}));

// Synthetic resources only. None is taken from the real user's profile/project.
const fixtures = {
  [join(agentDir, 'AGENTS.md')]: 'GLOBAL_AGENT_SENTINEL',
  [join(root, 'fixture/AGENTS.md')]: 'ANCESTOR_AGENT_SENTINEL',
  [join(cwd, 'AGENTS.override.md')]: 'PROJECT_AGENT_SENTINEL',
  [join(agentDir, 'SYSTEM.md')]: 'SYSTEM_SENTINEL',
  [join(agentDir, 'APPEND_SYSTEM.md')]: 'APPEND_SENTINEL',
  [join(agentDir, 'extensions/sentinel.js')]: 'export default function(){globalThis.syntheticExtensionLoads=(globalThis.syntheticExtensionLoads||0)+1}',
  [join(agentDir, 'skills/sentinel/SKILL.md')]: '---\nname: sentinel\ndescription: synthetic fixture\n---\nSKILL_SENTINEL',
  [join(agentDir, 'prompts/sentinel.md')]: 'PROMPT_SENTINEL',
  [join(agentDir, 'settings.json')]: JSON.stringify({defaultTools:['bash'], packages:[]}),
};
for (const [path, content] of Object.entries(fixtures)) { fs.mkdirSync(dirname(path),{recursive:true}); fs.writeFileSync(path, content); }
const settingsManager = SettingsManager.inMemory({compaction:{enabled:false}, retry:{enabled:false,provider:{maxRetries:0}}, enableSkillCommands:false, enableInstallTelemetry:false});
const credentials = new ai.InMemoryCredentialStore();
await credentials.modify('anthropic', () => ({type:'api_key', key:'synthetic-not-a-real-key'}));
const beforeRuntime = reads.length;
const modelRuntime = await ModelRuntime.create({credentials, modelsPath:null, allowModelNetwork:false, refreshOnCreate:false});
const model = modelRuntime.getModel('anthropic', 'claude-sonnet-4-5');
assert.ok(model);
const auth = await modelRuntime.getAuth(model, {signal:AbortSignal.timeout(2000)});
assert.equal(auth.auth.apiKey, 'synthetic-not-a-real-key');
assert.equal(reads.slice(beforeRuntime).some(p=>Object.keys(fixtures).includes(p)),false);
const names = ['knowledge_search','knowledge_read','knowledge_sources','submit_answer'];
let submitted;
const customTools = names.map(name=>defineTool({
  name, label:name, description:'Synthetic audit tool, no I/O',
  parameters:ai.Type.Object({text:ai.Type.String()},{additionalProperties:false}),
  async execute(_id, args) {
    if(name==='submit_answer') submitted=args.text;
    return {content:[{type:'text',text:'ok'}],details:{name},...(name==='submit_answer'?{terminate:true}:{})};
  },
}));
const extResult = {extensions:[],errors:[],runtime:createExtensionRuntime()};
let reloadCount=0;
const loader = {
  getExtensions:()=>extResult,
  getSkills:()=>({skills:[],diagnostics:[]}),
  getPrompts:()=>({prompts:[],diagnostics:[]}),
  getThemes:()=>({themes:[],diagnostics:[]}),
  getAgentsFiles:()=>({agentsFiles:[]}),
  getSystemPrompt:()=> 'Only use the four knowledge tools. Submit the answer with submit_answer alone.',
  getSystemPromptSource:()=>undefined,
  getAppendSystemPrompt:()=>[],
  getAppendSystemPromptSources:()=>[],
  extendResources:()=>{},
  reload:async()=>{reloadCount++},
};
const readStart=reads.length;
const {session,extensionsResult} = await createAgentSession({cwd,agentDir,model,modelRuntime,settingsManager,resourceLoader:loader,sessionManager:SessionManager.inMemory(cwd),tools:names,customTools,thinkingLevel:'off'});
assert.deepEqual(session.getActiveToolNames().sort(), [...names].sort());
assert.deepEqual(session.getAllTools().map(t=>t.name).sort(), [...names].sort());
assert.equal(extensionsResult.extensions.length,0);
assert.equal(session.messages.length,0);
assert.equal(session.sessionFile,undefined);
assert.equal(/SENTINEL/.test(session.systemPrompt),false);
for(const name of ['bash','read','write','edit','grep','find','ls','powershell','spawn_session']) {
  assert.throws(()=>ai.validateToolCall(session.agent.state.tools,{type:'toolCall',id:'bad',name,arguments:{}}));
}
session.setActiveToolsByName([...names,'bash','read']);
assert.deepEqual(session.getActiveToolNames().sort(), [...names].sort());
for(const tool of session.agent.state.tools){
  const args=ai.validateToolCall(session.agent.state.tools,{type:'toolCall',id:tool.name,name:tool.name,arguments:{text:'validated'}});
  const result=await tool.execute(tool.name,args);
  if(tool.name==='submit_answer') assert.equal(result.terminate,true);
}
assert.equal(submitted,'validated');
await session.reload();
assert.equal(reloadCount,1);
assert.deepEqual(session.getAllTools().map(t=>t.name).sort(), [...names].sort());
assert.equal(/SENTINEL/.test(session.systemPrompt),false);
assert.equal(reads.slice(readStart).some(p=>Object.keys(fixtures).includes(p)),false);
assert.equal(globalThis.syntheticExtensionLoads,undefined);
console.log(JSON.stringify({test:'restricted-session',active:session.getActiveToolNames(),all:session.getAllTools().map(t=>t.name),extensions:0,messages:session.messages.length,reloadCount,fixtureContentReads:0,unauthorizedToolNamesRejected:9,submitValidated:true,submitTerminateReturned:true,executeBashStillOnHost:typeof session.executeBash}));
session.dispose();
assert.equal(execAttempts.length,0);
assert.equal(networkAttempts.length,0);

// noTools:"builtin" only suppresses active defaults; tools:[] suppresses custom tools too.
for(const mode of ['builtin','empty-list']) {
  const {session:s}=await createAgentSession({cwd,agentDir,model,modelRuntime,settingsManager,resourceLoader:loader,sessionManager:SessionManager.inMemory(cwd),customTools,...(mode==='builtin'?{noTools:'builtin'}:{tools:[]})});
  if(mode==='builtin') {
    assert.deepEqual(s.getActiveToolNames().sort(),[...names].sort());
    assert.ok(s.getAllTools().some(t=>t.name==='bash'));
    s.setActiveToolsByName(['bash']);
    assert.deepEqual(s.getActiveToolNames(),['bash']);
  } else {
    assert.deepEqual(s.getAllTools(),[]);
    assert.deepEqual(s.getActiveToolNames(),[]);
  }
  console.log(JSON.stringify({test:'tool-option-semantics',mode,registered:s.getAllTools().map(t=>t.name),activeAfterAttempt:s.getActiveToolNames()}));
  s.dispose();
}
// Negative control: no-* flags do not disable SYSTEM/APPEND, nor inline factories.
let inlineLoads=0;
const defaultLoader = new DefaultResourceLoader({cwd,agentDir,settingsManager:SettingsManager.inMemory(),noExtensions:true,noSkills:true,noPromptTemplates:true,noThemes:true,noContextFiles:true,extensionFactories:[()=>{inlineLoads++}]});
await defaultLoader.reload();
assert.equal(defaultLoader.getSystemPrompt(),'SYSTEM_SENTINEL');
assert.deepEqual(defaultLoader.getAppendSystemPrompt(),['APPEND_SENTINEL']);
assert.equal(inlineLoads,1);
console.log(JSON.stringify({test:'default-loader-no-flags',systemStillLoaded:true,appendStillLoaded:true,inlineFactoriesStillRun:inlineLoads,agents:defaultLoader.getAgentsFiles().agentsFiles.length,skills:defaultLoader.getSkills().skills.length}));

// Overrides discard results only after discovery/reading (synthetic profile).
const overridesStart=reads.length;
const discardedExtensionErrors=[];
const overridden=new DefaultResourceLoader({cwd,agentDir,settingsManager:SettingsManager.inMemory(),extensionsOverride:(base)=>{discardedExtensionErrors.push(...base.errors);return {extensions:[],errors:[],runtime:createExtensionRuntime()}},agentsFilesOverride:()=>({agentsFiles:[]}),skillsOverride:()=>({skills:[],diagnostics:[]}),promptsOverride:()=>({prompts:[],diagnostics:[]}),systemPromptOverride:()=> 'fixed',appendSystemPromptOverride:()=>[]});
await overridden.reload();
assert.ok(reads.slice(overridesStart).includes(join(agentDir,'AGENTS.md')));
assert.ok(reads.slice(overridesStart).includes(join(agentDir,'SYSTEM.md')));
console.log(JSON.stringify({test:'overrides-after-discovery',syntheticExtensionLoads:globalThis.syntheticExtensionLoads??0,discardedExtensionErrors,returnedExtensions:overridden.getExtensions().extensions.length,agentsReadBeforeDiscard:true,systemReadBeforeOverride:true}));

// Raw credential reading is inert; default AuthStorage can execute command keys
// during create-time local refresh. All child-process calls are intercepted.
const authPath=join(root,'fixture/auth-command.json');
fs.writeFileSync(authPath,JSON.stringify({anthropic:{type:'api_key',key:'!PROBE_NEVER_EXECUTE'}}));
const commandStart=execAttempts.length;
assert.equal(readStoredCredential('anthropic',authPath).key,'!PROBE_NEVER_EXECUTE');
assert.equal(execAttempts.length,commandStart);
await ModelRuntime.create({authPath,modelsPath:null,allowModelNetwork:false});
assert.ok(execAttempts.length>commandStart);
console.log(JSON.stringify({test:'command-credential',rawReadExecuted:false,defaultLocalRefreshAttemptedExec:execAttempts.slice(commandStart),actualChildProcesses:0,outsideDiscoveryProbesSuppressed:[...new Set(outsideProbes)]}));
assert.equal(networkAttempts.length,0);
console.log(JSON.stringify({test:'complete',promptCalls:0,streamCalls:0,cloudRequests:0,fetchAttempts:networkAttempts.length,actualChildProcesses:0}));
