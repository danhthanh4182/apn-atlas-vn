import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CARRIERS, filterProfiles, validateCustomProfile, buildBackup, parseBackup, getCarrierApnForPlatform, buildAndroidReferenceXml, profileFields, buildProfileCopyText, DATA_REVIEWED} from '../src/catalog.mjs';

test('MVNO directory distinguishes verified and reference APNs',()=>{
  const byId=id=>CARRIERS.find(c=>c.id===id);
  assert.equal(byId('itel').apn,'m9-itelecom');
  assert.equal(byId('itel').status,'official');
  assert.equal(byId('wintel').apn,'m9-wintel');
  assert.equal(byId('wintel').status,'official');
  for(const id of ['local','vnsky','fpt','pottel']) assert.notEqual(byId(id).status,'official');
  assert.equal(byId('fpt').apn,'');
  assert.equal(getCarrierApnForPlatform(byId('pottel'),'ios'),'');
  assert.equal(getCarrierApnForPlatform(byId('pottel'),'android'),'pottel');
  assert.equal(byId('skyfi').apn,'');
});
test('search finds MVNO by alias and APN',()=>{
  assert.equal(filterProfiles(CARRIERS,{query:'Reddi'})[0].id,'wintel');
  assert.equal(filterProfiles(CARRIERS,{query:'vnsky',kind:'mvno'})[0].id,'vnsky');
});
test('profile data can be backed up and XML is reference-only',()=>{
  const p=validateCustomProfile({name:'Demo',apn:'internet',note:'test'});
  const backup=parseBackup(buildBackup([p.id],[p]));
  assert.equal(backup.customProfiles[0].apn,'internet');
  assert.match(buildAndroidReferenceXml(p),/reference-only/);
});
test('profile fields and copy-all text follow platform and advanced rules',()=>{
  const byId=id=>CARRIERS.find(c=>c.id===id);
  const androidLines=buildProfileCopyText(byId('viettel'),'android').split('\n');
  for(const line of ['Tên APN: Viettel','APN: v-internet','APN type: default,supl','Protocol: IPv4/IPv6']) assert.ok(androidLines.includes(line),`missing ${line}`);
  assert.ok(!androidLines.some(line=>line.startsWith('Username:')),'empty username is not copied');
  assert.ok(profileFields(byId('viettel'),'android').some(f=>f.advanced===true&&f.label==='Proxy'),'advanced fields are flagged');
  const custom=validateCustomProfile({name:'Demo',apn:'internet',proxy:'10.0.0.1'});
  assert.ok(!buildProfileCopyText(custom,'android',{includeAdvanced:false}).includes('Proxy:'));
  assert.ok(buildProfileCopyText(custom,'android',{includeAdvanced:true}).includes('Proxy: 10.0.0.1'));
  const ios=buildProfileCopyText(byId('pottel'),'ios');
  for(const label of ['Cellular Data','LTE setup','Personal Hotspot']) assert.ok(!ios.includes(label),`${label} omitted when iOS auto-configures`);
  assert.equal(DATA_REVIEWED,'2026-11-05');
});
