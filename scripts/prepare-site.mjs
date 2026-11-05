import { cpSync, copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'site');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ['index.html','styles.css','sw.js','manifest.webmanifest'])
  copyFileSync(join(root,f),join(out,f));
for (const folder of ['src','assets'])
  cpSync(join(root,folder),join(out,folder),{recursive:true});
writeFileSync(join(out,'.nojekyll'),'');
console.log('Pages site built to site/');
