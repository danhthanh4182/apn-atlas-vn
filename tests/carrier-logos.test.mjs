import test from 'node:test';
import assert from 'node:assert/strict';
import {CARRIERS} from '../src/catalog.mjs';
import {CARRIER_LOGOS,carrierAvatarMarkup} from '../src/logos.mjs';
test('all carriers map to distinct local source-attributed logos',()=>{
 const paths=new Set();
 for(const c of CARRIERS){
  const logo=CARRIER_LOGOS[c.id];
  assert.ok(logo,'Missing logo for '+c.id);
  assert.equal(logo.path,'./assets/carriers/'+c.id+'.png');
  assert.match(logo.source,/^https:\/\//);
  assert.ok(!paths.has(logo.path));
  paths.add(logo.path);
 }
});
test('avatar uses bundled logo and accessible fallback',()=>{
 const markup=carrierAvatarMarkup(CARRIERS[0]);
 assert.match(markup,/img class="carrier-logo"/);
 assert.match(markup,/assets\/carriers\/viettel\.png/);
 assert.match(markup,/class="logo-fallback"/);
});
test('custom profiles are escaped and do not fake a carrier logo',()=>{
 const markup=carrierAvatarMarkup({id:'custom_id',name:'<b>',symbol:'C&',hue:'teal'});
 assert.doesNotMatch(markup,/<img/);
 assert.match(markup,/C&amp;/);
 assert.doesNotMatch(markup,/<b>/);
});
