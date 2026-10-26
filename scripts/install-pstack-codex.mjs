#!/usr/bin/env node
import { existsSync, lstatSync, mkdirSync, cpSync, symlinkSync, rmSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const names=['pstack-mode','pstack-tdd','pstack-review'];
const source=resolve(dirname(fileURLToPath(import.meta.url)),'../harness/pstack/codex');
const present=path=>{try{lstatSync(path);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
export function install(project, from=source) {
  project=resolve(project);
  if (!existsSync(project)||!lstatSync(project).isDirectory()) throw new Error('Project must be an existing directory');
  if (!existsSync(join(from,'provenance.json'))) throw new Error('Build the Codex bundle before installing');
  const target=join(project,'docs/agents/pstack/codex');
  const discovery=join(project,'.agents/skills');
  const links=names.map(name=>join(discovery,name));
  for(const path of [target,...links]) if(present(path)) throw new Error(`Refusing to overwrite: ${path}`);
  // The destination is exclusively owned by this installation; only these new paths are rolled back.
  const created=[];
  try {
    mkdirSync(dirname(target),{recursive:true});
    created.push(target);cpSync(from,target,{recursive:true,errorOnExist:true,force:false});
    mkdirSync(discovery,{recursive:true});
    for(let i=0;i<names.length;i++) {
      symlinkSync(relative(discovery,join(target,'skills',names[i])),links[i],'dir');created.push(links[i]);
    }
  } catch(error){for(const path of created.reverse())rmSync(path,{recursive:true,force:true});throw error;}
  return {target,links};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try{if(process.argv.length!==3)throw new Error('Usage: node scripts/install-pstack-codex.mjs /path/to/project');console.log(JSON.stringify(install(process.argv[2]),null,2));}
  catch(error){console.error(error.message);process.exitCode=1;}
}
