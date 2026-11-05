import { cpSync, copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
rmSync(out,{recursive:true,force:true});
mkdirSync(out,{recursive:true});
for (const f of ['index.html','styles.css','manifest.webmanifest'])
  copyFileSync(join(root,f),join(out,f));
for (const folder of ['src','assets'])
  cpSync(join(root,folder),join(out,folder),{recursive:true});
const appFile=join(out,'src','app.mjs');
const contents=readFileSync(appFile,'utf8');
const withoutWorker=contents.replace(/if\('serviceWorker' in navigator && location\.protocol!=='file:'\)navigator\.serviceWorker\.register\('\.\/sw\.js'\)\.catch\(e=>console\.warn\('Offline cache not available',e\)\);/,'');
if(contents === withoutWorker) throw Error('Service worker line not found; avoid registering Pages worker in native app');
const withNative=withoutWorker.replace('const NATIVE_SHELL=false;','const NATIVE_SHELL=true;');
if(withNative === withoutWorker) throw Error('Native shell flag not found; avoid shipping the web shell in the native app');
writeFileSync(appFile,withNative);
console.log('Native web bundle built to www/');
