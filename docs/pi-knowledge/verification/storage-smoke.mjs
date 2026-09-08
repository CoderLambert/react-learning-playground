// DESIGN VALIDATION ONLY. Not Pi Knowledge implementation and not a benchmark.
// Offline; only reads 3 explicitly allowlisted workspace documents. DBs live in /tmp.
import { DatabaseSync } from 'node:sqlite';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const workspace = '/home/lambert/study/react-study/unit1-env-init/react-init';
const sha = x => createHash('sha256').update(x).digest('hex');
let assertions = 0;
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label); assertions++; console.log(JSON.stringify({assertion: label, actual, pass:true})); }
function rejects(fn, pattern, label) { assert.throws(fn, pattern, label); assertions++; console.log(JSON.stringify({assertion:label, pass:true})); }
console.log(JSON.stringify({kind:'design-smoke-NOT-benchmark', node:process.version, execPath:process.execPath, sqlite:process.versions.sqlite, scriptSha256:sha(readFileSync(fileURLToPath(import.meta.url)))}));
const db = new DatabaseSync(root + `smoke-${process.versions.node}.sqlite`);
db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;');
db.function('sha256', {deterministic:true}, x => sha(x));
console.log(JSON.stringify({compileOptions:db.prepare('PRAGMA compile_options').all(), journal:db.prepare('PRAGMA journal_mode').get()}));
// Verify the builtin DB does not already provide vec; do not attempt to load unknown files.
rejects(() => db.prepare('SELECT vec_version()').get(), /no such function: vec_version/, 'sqlite-vec not builtin; dynamic loading UNVERIFIED (no installed artifact found)');
db.exec(`
CREATE VIRTUAL TABLE uni USING fts5(body, tokenize='unicode61');
CREATE VIRTUAL TABLE tri USING fts5(body, tokenize='trigram');
CREATE VIRTUAL TABLE code_under USING fts5(body, tokenize="unicode61 tokenchars '_'");
`);
const fixtures = ['中文知识检索系统', 'user.name foo_bar useState src/App.jsx C++', 'user/name foo-bar use State src-App-jsx C'];
for (const table of ['uni','tri','code_under']) for (const body of fixtures) db.prepare(`INSERT INTO ${table}(body) VALUES (?)`).run(body);
const phrase = q => '"' + q.replaceAll('"','""') + '"';
function hits(table,q) { return db.prepare(`SELECT rowid FROM ${table} WHERE ${table} MATCH ? ORDER BY rowid`).all(phrase(q)).map(r=>r.rowid); }
equal(hits('uni','知识'), [], 'unicode61 does not segment Chinese substring');
equal(hits('uni','中文知识检索系统'), [1], 'unicode61 matches whole Chinese run');
equal(hits('tri','知识检索'), [1], 'trigram matches Chinese substring >=3 codepoints');
equal(hits('tri','知识'), [], 'trigram MATCH misses 2-codepoint query');
equal(hits('uni','user.name'), [2,3], 'unicode61 punctuation loses dot-vs-slash distinction');
equal(hits('uni','foo_bar'), [2,3], 'unicode61 loses underscore-vs-hyphen distinction');
equal(hits('uni','C++'), [2,3], 'unicode61 loses C++-vs-C distinction');
equal(hits('uni','state'), [3], 'unicode61 does not split camelCase useState');
equal(hits('uni','useState'), [2], 'unicode61 preserves case-insensitive whole identifier');
equal(hits('code_under','foo_bar'), [2], 'underscore tokenchars improves foo_bar exact term');
equal(hits('tri','user.name'), [2], 'trigram distinguishes dotted symbol in fixture');
rejects(() => db.prepare('SELECT rowid FROM uni WHERE uni MATCH ?').all('user.name'), /fts5: syntax error/, 'SQL parameter binding alone does not escape FTS query grammar');
for (const table of ['uni','tri','code_under']) {
 db.exec(`CREATE VIRTUAL TABLE ${table}_vocab USING fts5vocab(${table}, 'row')`);
 console.log(JSON.stringify({tokenizer:table, vocabulary:db.prepare(`SELECT term,doc,cnt FROM ${table}_vocab ORDER BY term`).all()}));
}
// Predicate placement test: synthetic equal-text candidates with deterministic tie break.
// Proves logical top-k semantics only; not optimizer physical order, ACL product safety, or vec behavior.
db.exec(`CREATE TABLE meta(id INTEGER PRIMARY KEY, workspace TEXT NOT NULL);
CREATE VIRTUAL TABLE candidates USING fts5(body);
INSERT INTO meta VALUES(1,'outside'),(2,'outside'),(3,'allowed'),(4,'allowed');
INSERT INTO candidates(rowid,body) VALUES(1,'needle'),(2,'needle'),(3,'needle'),(4,'needle');`);
const preSQL = `SELECT c.rowid FROM candidates c JOIN meta m ON m.id=c.rowid WHERE candidates MATCH ? AND m.workspace=? ORDER BY bm25(candidates),c.rowid LIMIT 2`;
const postSQL = `WITH topk AS MATERIALIZED (SELECT rowid,bm25(candidates) AS score FROM candidates WHERE candidates MATCH ? ORDER BY score,rowid LIMIT 2) SELECT t.rowid FROM topk t JOIN meta m ON m.id=t.rowid WHERE m.workspace=? ORDER BY t.score,t.rowid`;
equal(db.prepare(preSQL).all('needle','allowed').map(r=>r.rowid), [3,4], 'scope predicate before LIMIT returns allowed top2');
equal(db.prepare(postSQL).all('needle','allowed').map(r=>r.rowid), [], 'global top2 then scope filter loses both eligible results');
console.log(JSON.stringify({filterSQL:{preSQL,postSQL},explainPre:db.prepare('EXPLAIN QUERY PLAN '+preSQL).all('needle','allowed'),explainPost:db.prepare('EXPLAIN QUERY PLAN '+postSQL).all('needle','allowed')}));
// Byte-addressed immutable source revision and evidence; chunks are replaceable derived data.
db.exec(`
CREATE TABLE revision(id TEXT PRIMARY KEY, source_uri TEXT NOT NULL, body BLOB NOT NULL, digest TEXT NOT NULL CHECK(digest=sha256(body)));
CREATE TABLE generation(id TEXT PRIMARY KEY, revision_id TEXT NOT NULL REFERENCES revision(id), chunker_version TEXT NOT NULL, UNIQUE(id,revision_id));
CREATE TABLE chunk(id TEXT PRIMARY KEY, generation_id TEXT NOT NULL, revision_id TEXT NOT NULL, start_byte INTEGER NOT NULL, end_byte INTEGER NOT NULL, CHECK(start_byte>=0 AND end_byte>start_byte), FOREIGN KEY(generation_id,revision_id) REFERENCES generation(id,revision_id));
CREATE TABLE active(singleton INTEGER PRIMARY KEY CHECK(singleton=1), generation_id TEXT NOT NULL REFERENCES generation(id));
CREATE TABLE evidence(id TEXT PRIMARY KEY, revision_id TEXT NOT NULL REFERENCES revision(id), start_byte INTEGER NOT NULL, end_byte INTEGER NOT NULL, quote BLOB NOT NULL, digest TEXT NOT NULL CHECK(digest=sha256(quote)), CHECK(start_byte>=0 AND end_byte>start_byte));
CREATE TRIGGER evidence_validate BEFORE INSERT ON evidence BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM revision r WHERE r.id=NEW.revision_id AND NEW.end_byte<=length(r.body) AND NEW.quote=substr(r.body,NEW.start_byte+1,NEW.end_byte-NEW.start_byte)) THEN RAISE(ABORT,'invalid evidence range/quote') END;
END;
`);
for (const table of ['revision','evidence']) for (const op of ['UPDATE','DELETE']) db.exec(`CREATE TRIGGER ${table}_${op.toLowerCase()} BEFORE ${op} ON ${table} BEGIN SELECT RAISE(ABORT,'immutable ${table}'); END;`);
const oldBody=Buffer.from('# 知识\n原始证据：useState(0)\n第二段\n');
const quote=Buffer.from('原始证据：useState(0)');
const start=oldBody.indexOf(quote), end=start+quote.length;
db.prepare('INSERT INTO revision VALUES(?,?,?,?)').run('r1','workspace://demo/doc.md',oldBody,sha(oldBody));
db.prepare('INSERT INTO generation VALUES(?,?,?)').run('g1','r1','whole-v1');
db.prepare('INSERT INTO chunk VALUES(?,?,?,?,?)').run('c1','g1','r1',0,oldBody.length);
db.exec("INSERT INTO active VALUES(1,'g1')");
db.prepare('INSERT INTO evidence VALUES(?,?,?,?,?,?)').run('e1','r1',start,end,quote,sha(quote));
const fetchEvidence=()=>db.prepare('SELECT * FROM evidence WHERE id=?').get('e1');
const frozen=fetchEvidence();
equal(Buffer.from(frozen.quote).toString(),quote.toString(),'evidence captures exact UTF-8 byte range');
rejects(()=>db.prepare('INSERT INTO evidence VALUES(?,?,?,?,?,?)').run('bad','r1',start,end,Buffer.from('wrong'),sha(Buffer.from('wrong'))),/invalid evidence range\/quote/,'mismatched quote rejected');
rejects(()=>db.exec("UPDATE evidence SET start_byte=0 WHERE id='e1'"),/immutable evidence/,'evidence update blocked');
rejects(()=>db.exec("DELETE FROM evidence WHERE id='e1'"),/immutable evidence/,'evidence delete blocked in ordinary write model');
rejects(()=>db.exec("UPDATE revision SET source_uri='changed' WHERE id='r1'"),/immutable revision/,'source snapshot update blocked');
rejects(()=>db.exec("DELETE FROM revision WHERE id='r1'"),/immutable revision/,'source snapshot delete blocked');
// Intentional failure after staging chunks: whole publish transaction must rollback.
db.exec('BEGIN IMMEDIATE');
try {
 db.exec("INSERT INTO generation VALUES('failed','r1','bad-v2'); INSERT INTO chunk VALUES('badchunk','failed','r1',0,1); UPDATE active SET generation_id='failed'");
 throw new Error('simulated publication failure');
} catch(e) { assert.match(e.message,/simulated publication failure/); db.exec('ROLLBACK'); }
equal(db.prepare('SELECT generation_id FROM active').get().generation_id,'g1','failed publication retains old active generation');
equal(db.prepare("SELECT count(*) n FROM generation WHERE id='failed'").get().n,0,'failed staging rolled back');
// Rechunk same revision; publish new generation atomically; discard old derived chunks.
db.exec('BEGIN IMMEDIATE');
db.exec("INSERT INTO generation VALUES('g2','r1','paragraph-v2')");
db.prepare('INSERT INTO chunk VALUES(?,?,?,?,?)').run('c2','g2','r1',0,start);
db.prepare('INSERT INTO chunk VALUES(?,?,?,?,?)').run('c3','g2','r1',start,oldBody.length);
db.exec("UPDATE active SET generation_id='g2'; DELETE FROM chunk WHERE generation_id='g1'; DELETE FROM generation WHERE id='g1'; COMMIT");
equal(fetchEvidence(),frozen,'rechunk and old chunk GC do not change evidence');
// A new source revision does not overwrite a previously cited snapshot.
const newBody=Buffer.from('# 知识\n修改后的证据：useState(1)\n');
db.prepare('INSERT INTO revision VALUES(?,?,?,?)').run('r2','workspace://demo/doc.md',newBody,sha(newBody));
db.exec('BEGIN IMMEDIATE');
db.exec("INSERT INTO generation VALUES('g3','r2','whole-v1')");
db.prepare('INSERT INTO chunk VALUES(?,?,?,?,?)').run('c4','g3','r2',0,newBody.length);
db.exec("UPDATE active SET generation_id='g3'; DELETE FROM chunk WHERE generation_id='g2'; DELETE FROM generation WHERE id='g2'; COMMIT");
equal(fetchEvidence(),frozen,'new source revision leaves old evidence immutable');
equal(sha(db.prepare("SELECT body FROM revision WHERE id='r1'").get().body),sha(oldBody),'old source snapshot digest survives source update');
console.log(JSON.stringify({evidence:{revisionId:'r1',startByte:start,endByte:end,quote:quote.toString(),sha256:sha(quote)},activeGeneration:db.prepare('SELECT * FROM active').get()}));
// Real candidate corpus availability and tiny retrieval probe; no claims of relevance benchmark.
const files=['README.md','PRD-react-learning-platform.md','DESIGN-react-learning-platform.md'];
db.exec('CREATE TABLE corpus_meta(id INTEGER PRIMARY KEY,path TEXT); CREATE VIRTUAL TABLE corpus_uni USING fts5(body, tokenize=unicode61); CREATE VIRTUAL TABLE corpus_tri USING fts5(body, tokenize=trigram);');
const manifest=files.map((path,i)=>{
 const bytes=readFileSync(workspace+'/'+path),text=bytes.toString('utf8');
 db.prepare('INSERT INTO corpus_meta VALUES(?,?)').run(i+1,path);
 for(const table of ['corpus_uni','corpus_tri']) db.prepare(`INSERT INTO ${table}(rowid,body) VALUES(?,?)`).run(i+1,text);
 return {path,bytes:bytes.length,codepoints:[...text].length,lines:text.split('\n').length-(text.endsWith('\n')?1:0),sha256:sha(bytes)};
});
writeFileSync(root+`corpus-${process.versions.node}.json`,JSON.stringify({workspace,manifest},null,2)+'\n');
console.log(JSON.stringify({candidateCorpus:manifest,totalBytes:manifest.reduce((n,m)=>n+m.bytes,0)}));
for(const q of ['进度','学习进度','localStorage','useState','src/demos/UseEffectDemo.jsx']) for(const table of ['corpus_uni','corpus_tri']) {
 const rows=db.prepare(`SELECT m.path FROM ${table} JOIN corpus_meta m ON m.id=${table}.rowid WHERE ${table} MATCH ? ORDER BY m.path`).all(phrase(q));
 console.log(JSON.stringify({realCorpusProbe:{q,table,paths:rows.map(r=>r.path)}}));
}
equal(db.prepare('PRAGMA foreign_key_check').all(),[],'foreign keys remain consistent');
equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok','SQLite integrity check');
db.close();
// Reopen for persistence verification (clean close only, not crash recovery).
const reopened=new DatabaseSync(root+`smoke-${process.versions.node}.sqlite`,{readOnly:true});
equal(reopened.prepare("SELECT digest FROM evidence WHERE id='e1'").get().digest,sha(quote),'evidence persisted after clean reopen');
reopened.close();
console.log(JSON.stringify({status:'PASS',assertions,limitations:['synthetic design model, not product implementation','no benchmark or embedding calls','no sqlite-vec loading/KNN test','no process-crash recovery, concurrency, authorization or malicious DB owner protection test','three real docs only; no relevance ground truth']}));
