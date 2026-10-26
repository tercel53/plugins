#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync, existsSync } from 'node:fs';
import { resolve, relative, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const bundle = join(root, 'harness/pstack/codex');
export const enabled = ['poteto-mode','how','why','architect','arena','swarm','tdd','interrogate','no-comments','show-me-your-work','benchmark-checklist','typescript-best-practices','technical-writing','unslop'];
export function files(dir) {
  return readdirSync(dir, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(entry => {
    if (['node_modules','.DS_Store','.git'].includes(entry.name)) return [];
    if (entry.isSymbolicLink()) throw new Error(`Unexpected source symlink: ${join(dir,entry.name)}`);
    const path=join(dir,entry.name);
    return entry.isDirectory()?files(path):[path];
  });
}
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export function expected() {
  const source=join(root,'pstack');
  const entries = files(source).map(path=>{
    const name=relative(source,path).split('\\').join('/');
    const raw=readFileSync(path);
    let bytes=raw;
    if (enabled.some(skill=>name===`skills/${skill}/SKILL.md`)) {
      const text=raw.toString();
      const marker='> Codex：本文保留上游方法。执行前先读 [Codex adapter](../../../references/codex-adapter.md) 和 [依赖映射](../../../references/dependencies.md)；工具、模型、授权及阶段行为以适配版为准，不执行未映射的上游命令。\n\n';
      if (!/^# /m.test(text)) throw new Error(`Missing insertion point: ${name}`);
      bytes=Buffer.from(text.replace(/^# /m,marker+'# '));
    }
    return {name,bytes,executable:Boolean(statSync(path).mode&0o111),sourceSha256:hash(raw),generatedSha256:hash(bytes)};
  });
  const manifest={source:'https://github.com/cursor/plugins',sourcePath:'pstack/',version:JSON.parse(readFileSync(join(source,'plugin.json'))).version,enabled,files:entries.map(({bytes,...item})=>item)};
  return {entries,manifest:JSON.stringify(manifest,null,2)+'\n'};
}
export function build(check=false) {
  const output=join(bundle,'upstream');
  const {entries,manifest}=expected();
  if (check) {
    if (!existsSync(output)) throw new Error('Missing generated upstream; run build first');
    const actual=files(output).map(p=>relative(output,p)).sort();
    if (JSON.stringify(actual)!==JSON.stringify(entries.map(e=>e.name).sort())) throw new Error('Generated file set differs');
    for (const item of entries) {
      const path=join(output,item.name);
      if (!readFileSync(path).equals(item.bytes)||Boolean(statSync(path).mode&0o111)!==item.executable) throw new Error(`Generated source drift: ${item.name}`);
    }
    if (readFileSync(join(bundle,'provenance.json'),'utf8')!==manifest) throw new Error('Provenance drift');
  } else {
    rmSync(output,{recursive:true,force:true});
    for (const item of entries) {
      const path=join(output,item.name);mkdirSync(dirname(path),{recursive:true});
      writeFileSync(path,item.bytes,{mode:item.executable?0o755:0o644});
    }
    writeFileSync(join(bundle,'provenance.json'),manifest);
  }
  return entries.length;
}
if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try { console.log(`${process.argv.includes('--check')?'Verified':'Generated'} ${build(process.argv.includes('--check'))} upstream files for Codex`); }
  catch(error){console.error(error.message);process.exitCode=1;}
}
