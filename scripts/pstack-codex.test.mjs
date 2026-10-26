import test from 'node:test';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, realpathSync, rmSync, existsSync, symlinkSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { install, names } from './install-pstack-codex.mjs';
import { build, bundle, enabled, files, root } from './build-pstack-codex.mjs';

function project(t) {const p=mkdtempSync(join(tmpdir(),'pstack-install-'));t.after(()=>rmSync(p,{recursive:true,force:true}));return p;}
test('generated files reproduce upstream content, executable flags and recorded hashes',()=>assert.ok(build(true)>0));
test('relocated installation resolves all executable entry references and preserves Matt',t=>{
  const p=project(t);const matt=join(p,'.agents/skills/tdd/SKILL.md');mkdirSync(dirname(matt),{recursive:true});writeFileSync(matt,'existing Matt skill');
  const {target,links}=install(p);
  assert.equal(readFileSync(matt,'utf8'),'existing Matt skill');
  assert.deepEqual(readdirSync(join(p,'.agents/skills')).sort(),[...names,'tdd'].sort());
  for(let i=0;i<names.length;i++)assert.equal(realpathSync(links[i]),realpathSync(join(target,'skills',names[i])));
  for(const file of [...names.map(n=>join(target,'skills',n,'SKILL.md')),...files(join(target,'references'))]) {
    for(const match of readFileSync(file,'utf8').matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|#)/.test(match[1]))continue;
      assert.ok(existsSync(resolve(dirname(file),match[1].split('#')[0])),`${file}: unresolved ${match[1]}`);
    }
  }
  for(const name of enabled) {
    const skill=join(target,'upstream/skills',name,'SKILL.md');
    const adapter=resolve(dirname(skill),'../../../references/codex-adapter.md');
    assert.ok(existsSync(adapter),`missing adapter for ${name}`);
  }
  assert.equal(readdirSync(join(target,'upstream/skills')).filter(n=>n.startsWith('principle-')).length,24);
});
test('existing skill conflict fails before copying bundle or altering existing file',t=>{
  const p=project(t);const conflict=join(p,'.agents/skills/pstack-review');mkdirSync(conflict,{recursive:true});writeFileSync(join(conflict,'SKILL.md'),'keep');
  assert.throws(()=>install(p),/Refusing to overwrite/);
  assert.equal(readFileSync(join(conflict,'SKILL.md'),'utf8'),'keep');
  assert.equal(existsSync(join(p,'docs/agents/pstack/codex')),false);
});
test('dangling discovery link is also a conflict and is never overwritten',t=>{
  const p=project(t);mkdirSync(join(p,'.agents/skills'),{recursive:true});symlinkSync('/nonexistent/pstack-fixture-target',join(p,'.agents/skills/pstack-mode'));
  assert.throws(()=>install(p),/Refusing to overwrite/);
  assert.equal(existsSync(join(p,'docs/agents/pstack/codex')),false);
});
test('second installation refuses to replace user-edited installed content',t=>{
  const p=project(t);const {target}=install(p);const file=join(target,'skills/pstack-mode/SKILL.md');writeFileSync(file,'local adaptation');
  assert.throws(()=>install(p),/Refusing to overwrite/);assert.equal(readFileSync(file,'utf8'),'local adaptation');
});

test('Claude generator preserves sibling Codex tree in build and check modes',t=>{
  const p=project(t);
  cpSync(join(root,'pstack'),join(p,'pstack'),{recursive:true});
  mkdirSync(join(p,'scripts'));cpSync(join(root,'scripts/generate-pstack-harness-trees.mjs'),join(p,'scripts/generate-pstack-harness-trees.mjs'));
  const sentinel=join(p,'harness/pstack/codex/keep.txt');mkdirSync(dirname(sentinel),{recursive:true});writeFileSync(sentinel,'codex-owned');
  execFileSync(process.execPath,[join(p,'scripts/generate-pstack-harness-trees.mjs')]);
  assert.equal(readFileSync(sentinel,'utf8'),'codex-owned');
  execFileSync(process.execPath,[join(p,'scripts/generate-pstack-harness-trees.mjs'),'--check']);
});
