import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync} from 'node:fs';

test('Pages and native builds include identical carrier catalogs',()=>{
  execFileSync(process.execPath,['scripts/prepare-site.mjs']);
  execFileSync(process.execPath,['scripts/prepare-web.mjs']);
  assert.ok(existsSync('site/.nojekyll'));
  assert.ok(existsSync('site/sw.js'));
  assert.ok(existsSync('www/src/catalog.mjs'));
  assert.deepEqual(readFileSync('site/src/catalog.mjs'),readFileSync('www/src/catalog.mjs'));
  assert.doesNotMatch(readFileSync('www/src/app.mjs','utf8'),/serviceWorker\.register/);
  assert.match(readFileSync('site/src/app.mjs','utf8'),/serviceWorker\.register/);
  assert.match(readFileSync('www/src/app.mjs','utf8'),/const NATIVE_SHELL=true;/);
  assert.match(readFileSync('site/src/app.mjs','utf8'),/const NATIVE_SHELL=false;/);
  assert.match(readFileSync('site/src/catalog.mjs','utf8'),/m9-itelecom/);
  assert.ok(existsSync('site/assets/fonts/be-vietnam-pro-vietnamese-700.woff2'));
  assert.ok(existsSync('www/assets/fonts/be-vietnam-pro-vietnamese-700.woff2'));
});
