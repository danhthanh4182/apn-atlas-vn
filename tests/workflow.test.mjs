import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = name => readFileSync(new URL('../.github/workflows/' + name, import.meta.url),'utf8');
test('Android CI avoids the removed Android SDK tools package',()=>{
  for(const file of ['android.yml','android-release.yml']){
    assert.match(read(file),/android-actions\/setup-android@v4/);
    assert.doesNotMatch(read(file),/setup-android@v3/);
  }
});
test('iOS CI points to the Capacitor Swift Package Manager project',()=>{
  for(const file of ['ios.yml','ios-ipa.yml']){
    assert.match(read(file),/-project ios\/App\/App\.xcodeproj/);
    assert.doesNotMatch(read(file),/App\.xcworkspace/);
  }
});

test('unsigned iPhone packaging uses device SDK and marks signing as disabled',()=>{
  const wf=read('ios-unsigned-ipa.yml');
  assert.match(wf,/CODE_SIGNING_ALLOWED=NO build/);
  assert.match(wf,/-sdk iphoneos/);
  assert.match(wf,/Payload\/App\.app/);
  assert.match(wf,/APN-Atlas-VN-unsigned\.ipa/);
});
