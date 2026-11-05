import {carrierAvatarMarkup} from './logos.mjs';
import {CARRIERS,PROFILE_DEFAULTS,filterProfiles,validateCustomProfile,buildBackup,parseBackup,buildAndroidReferenceXml,escapeHtml,getCarrierApnForPlatform,DATA_REVIEWED,profileFields,buildProfileCopyText} from './catalog.mjs';
import {initHeroMotion} from './hero-motion.mjs';
const NATIVE_SHELL=false;

const el=id=>document.getElementById(id);
const qsa=s=>[...document.querySelectorAll(s)];
const esc=escapeHtml;
const icon=(name,cls='')=>`<svg class="icon${cls?' '+cls:''}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

const detailPane=document.querySelector('.detail-pane');
const TABLET_MEDIA=window.matchMedia('(min-width:744px)');
const REDUCED=window.matchMedia('(prefers-reduced-motion: reduce)');
function isNativeTablet(){return NATIVE_SHELL&&TABLET_MEDIA.matches;}
const focusStack=[];
function rememberFocus(){focusStack.push(document.activeElement);}
function restoreFocus(){
  const node=focusStack.pop();
  if(node&&node!==document.body&&node.isConnected){node.focus();return;}
  const target=[el('search'),...qsa('[data-view].active')].find(x=>x&&x.getClientRects().length>0);
  target?.focus();
}
function trapFocus(event,container){
  if(event.key!=='Tab')return false;
  const items=[...container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')].filter(node=>node.getClientRects().length>0);
  if(!items.length)return false;
  const first=items[0],last=items[items.length-1];
  if(!items.includes(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus();return true;}
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();return true;}
  if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();return true;}
  return false;
}
function topDialog(){
  for(const id of ['editorScrim','backupScrim','detailScrim']){const node=el(id);if(node&&!node.hidden)return node;}
  return null;
}
function scrollBehavior(){return REDUCED.matches?'auto':'smooth';}
function updateCustomActions(){el('customActions').hidden=!(NATIVE_SHELL&&state.view==='custom');}
function formatReviewedDate(){const [year,month,day]=DATA_REVIEWED.split('-');return `${day}.${month}.${year}`;}
const FIELD_ERRORS=[
  ['Invalid name','editName','Tên cấu hình phải từ 1 đến 80 ký tự.'],
  ['Invalid APN','editApn','APN phải từ 1 đến 128 ký tự.'],
  ['Invalid MCC','editMcc','MCC phải gồm đúng 3 chữ số.'],
  ['Invalid MNC','editMnc','MNC phải gồm 2 hoặc 3 chữ số.']
];
const K_SAVED='apn-atlas-saved-v1', K_CUSTOM='apn-atlas-custom-v1';
const STATUS={
  official:'Đã xác minh',
  reference:'Cần kiểm tra',
  unverified:'Cần kiểm tra',
  upcoming:'Chưa ra mắt',
  custom:'Cấu hình riêng'
};
const KIND={
  network:'M&#7841;ng s&#7903; h&#7919;u h&#7841; t&#7847;ng',
  mvno:'M&#7841;ng di &#273;&#7897;ng &#7843;o (MVNO)',
  other:'M&#7841;ng h&#7907;p t&#225;c',
  custom:'C&#7845;u h&#236;nh c&#225; nh&#226;n'
};

const state={view:'library',kind:'all',platform:'android',query:'',savedIds:[],customProfiles:[],detailId:null};
let toastTimer, installPrompt;
try {
  const saved=JSON.parse(localStorage.getItem(K_SAVED)||'[]');
  const customs=JSON.parse(localStorage.getItem(K_CUSTOM)||'[]');
  state.savedIds=Array.isArray(saved)?saved.filter(id=>typeof id==='string'):[];
  state.customProfiles=Array.isArray(customs)?customs.slice(0,200).map(x=>{try{return validateCustomProfile(x)}catch{return null}}).filter(Boolean):[];
} catch(e) {console.warn('Storage unavailable:',e);}

function persist(){
  try {localStorage.setItem(K_SAVED,JSON.stringify(state.savedIds));localStorage.setItem(K_CUSTOM,JSON.stringify(state.customProfiles));return true;}
  catch(e){showToast('Kh\u00f4ng th\u1ec3 l\u01b0u: b\u1ed9 nh\u1edb tr\u00ecnh duy\u1ec7t b\u1ecb kh\u00f3a');return false;}
}
function showToast(message){const t=el('toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2700);announce(message);}
function updateModalInertness(){
  const hasModal=!el('editorScrim').hidden||!el('backupScrim').hidden||(!isNativeTablet()&&!el('detailScrim').hidden);
  const shell=document.querySelector('.app-shell');
  if(hasModal){shell?.setAttribute('inert','');shell?.setAttribute('aria-hidden','true');}
  else{shell?.removeAttribute('inert');shell?.removeAttribute('aria-hidden');}
  const higherModal=!el('editorScrim').hidden||!el('backupScrim').hidden;
  if(higherModal&&!el('detailScrim').hidden){el('detailScrim')?.setAttribute('inert','');}
  else{el('detailScrim')?.removeAttribute('inert');}
}
let announceTimer;
function announce(message){
  clearTimeout(announceTimer);
  announceTimer=setTimeout(()=>{
    const live=el('a11yStatus');
    if(live)live.textContent=message;
  },120);
}
function getAll(){return [...CARRIERS,...state.customProfiles];}
function getById(id){return getAll().find(p=>p.id===id);}
function isSaved(id){return state.savedIds.includes(id);}
function badge(profile){return `<span class="status ${esc(profile.status)}"><span class="status-dot-small"></span>${STATUS[profile.status]||STATUS.unverified}</span>`;}
function sourceLine(p){
  if(p.kind==='custom')return `<div class="detail-source-line">${badge(p)}<span>Lưu trên thiết bị này</span></div>`;
  const official=p.status==='official';
  const prefix=official?'Nguồn công khai':'Nguồn tham khảo';
  const label=p.sourceLabel||prefix;
  const link=p.source?`<a class="detail-source-link" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">${esc(label)}${icon('external','icon--sm')}</a>`:esc(label);
  return `<div class="detail-source-line">${badge(p)}<span>${prefix}: ${link} &middot; ${formatReviewedDate()}</span></div>`;
}
function titleCase(p){return p.kind==='network'?'MNO':p.kind==='mvno'?'MVNO':p.kind==='other'?'PARTNER':'CUSTOM';}
function updateCounters(){el('statTotal').textContent=String(CARRIERS.length).padStart(2,'0');el('statSaved').textContent=String(state.savedIds.length).padStart(2,'0');el('savedCountSide').textContent=state.savedIds.length;}
function toggleSave(id){
  const grid=el('carrierGrid'),active=document.activeElement;
  const saveFocused=active?.matches?.('[data-save]')&&grid.contains(active)?active:null;
  const index=saveFocused?[...grid.children].findIndex(card=>card.contains(saveFocused)):-1;
  if(isSaved(id)){state.savedIds=state.savedIds.filter(s=>s!==id);showToast('\u0110\u00e3 b\u1ecf kh\u1ecfi danh s\u00e1ch l\u01b0u');announce('Đã bỏ lưu '+(getById(id)?.name||id));}
  else{state.savedIds=[...state.savedIds,id];showToast('\u0110\u00e3 l\u01b0u c\u1ea5u h\u00ecnh');announce('Đã lưu '+(getById(id)?.name||id));}
  persist();renderCards();if(state.detailId===id)renderDetail(id);
  if(!saveFocused)return;
  const still=grid.querySelector(`[data-save="${CSS.escape(id)}"]`);
  if(still){still.focus();return;}
  const opens=qsa('#carrierGrid .card-open');
  (opens[Math.min(Math.max(index,0),opens.length-1)]||opens[0]||el('search')).focus();
}
function renderCards({animate=false}={}){
  updateCounters();
  const savedOnly=state.view==='saved';
  const kind=state.view==='custom'?'custom':state.kind;
  const results=filterProfiles(getAll(),{query:state.query,kind,savedOnly,savedIds:state.savedIds});
  const heading=el('libraryHeading');
  const names={library:'Th\u01b0 vi\u1ec7n nh\u00e0 m\u1ea1ng ',saved:'C\u1ea5u h\u00ecnh \u0111\u00e3 l\u01b0u ',custom:'C\u1ea5u h\u00ecnh c\u1ee7a t\u00f4i '};
  heading.firstChild.textContent=names[state.view]||names.library;
  el('visibleCount').textContent=results.length;
  if(state.query){announce(results.length?('Tìm thấy '+results.length+' nhà mạng'):'Không tìm thấy cấu hình phù hợp');}
  el('librarySubheading').textContent=state.view==='saved'
    ?'C\u00e1c c\u1ea5u h\u00ecnh b\u1ea1n \u0111\u00e3 \u0111\u00e1nh d\u1ea5u. L\u01b0u c\u1ee5c b\u1ed9 tr\u00ean thi\u1ebft b\u1ecb n\u00e0y.'
    :state.view==='custom'?'Th\u00eam v\u00e0 ch\u1ec9nh s\u1eeda h\u1ed3 s\u01a1 APN c\u1ee7a ri\u00eang b\u1ea1n.'
    :'C\u1ea5u h\u00ecnh APN c\u00f3 ngu\u1ed3n, minh b\u1ea1ch tr\u1ea1ng th\u00e1i x\u00e1c minh.';
  const grid=el('carrierGrid');
  grid.innerHTML=results.map((p,index)=>{
    const saved=isSaved(p.id), shownApn=getCarrierApnForPlatform(p,state.platform), available=!!shownApn, selected=p.id===state.detailId;
    return `<article class="carrier-card${selected?' selected':''}" data-id="${esc(p.id)}" style="--i:${Math.min(index,11)}">
      <button class="card-open" type="button" data-open="${esc(p.id)}" aria-label="Xem chi tiết ${esc(p.name)}" aria-current="${selected?'true':'false'}"></button>
      <div class="card-body"><div class="card-top">${carrierAvatarMarkup(p)}<button type="button" class="bookmark ${saved?'saved':''}" data-save="${esc(p.id)}" aria-pressed="${saved}" aria-label="${saved?'Bỏ lưu':'Lưu'} ${esc(p.name)}">${icon('bookmark',saved?'icon--fill':'')}</button></div>
      <h3 class="carrier-name">${esc(p.name)}</h3><div class="carrier-kind">${KIND[p.kind]||KIND.custom} <span aria-hidden="true">&#183;</span> ${esc(p.prefix||'--')}</div>
      <div class="apn-chip ${available?'':'unavailable'}">${available?esc(shownApn):p.iosAuto&&state.platform==='ios'?'T\u1ef1 nh\u1eadn theo SIM':p.status==='upcoming'?'Ch\u01b0a c\u00f4ng b\u1ed1':'Ch\u01b0a x\u00e1c nh\u1eadn APN'}</div></div>
      <div class="card-footer">${badge(p)}<span class="card-cta">Chi ti\u1ebft ${icon('arrow-up-right','icon--sm')}</span></div>
    </article>`;
  }).join('');
  grid.classList.toggle('cards-enter',animate);
  el('libraryView')?.classList.add('has-rendered');
  el('emptyState').hidden=results.length>0;
  qsa('.chip').forEach(btn=>{const on=btn.dataset.kind===kind;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));});
  updateSelectedCard();
  ensureTabletSelection(results);
  updateCustomActions();
}
function updateSelectedCard(){
  qsa('#carrierGrid .carrier-card').forEach(card=>{
    const selected=card.dataset.id===state.detailId;
    card.classList.toggle('selected',selected);
    const open=card.querySelector('.card-open');
    if(open)open.setAttribute('aria-current',selected?'true':'false');
  });
}
function ensureTabletSelection(results){
  if(!isNativeTablet())return;
  const focusInDetail=el('detailContent').contains(document.activeElement);
  if(!results.length){
    if(state.detailId)closeDetail();
    if(focusInDetail)el('search').focus();
    return;
  }
  if(results.some(p=>p.id===state.detailId))return;
  const next=results[0];
  openDetail(next.id);
  if(!focusInDetail)return;
  const grid=el('carrierGrid');
  (grid.querySelector(`[data-open="${CSS.escape(next.id)}"]`)||grid.querySelector(`[data-id="${CSS.escape(next.id)}"]`)||el('search')).focus();
}
function switchView(view){
  state.view=view;
  if(view==='custom')state.kind='custom';
  else if(state.kind==='custom')state.kind='all';
  document.documentElement.classList.toggle('guide-view',view==='guide');
  el('guideView').hidden=view!=='guide';
  el('libraryView').hidden=view==='guide';
  updateCustomActions();
  if(view!=='guide'){
    const normal=view==='library';
    document.querySelector('.hero').hidden=!normal;
    el('statsRow').hidden=!normal;
    renderCards({animate:true});
  } else renderGuide();
  const section=view==='guide'?el('guideView'):el('libraryView');
  section.classList.remove('view-enter');
  void section.offsetWidth;
  section.classList.add('view-enter');
  qsa('[data-view]').forEach(b=>{const current=b.dataset.view===view;b.classList.toggle('active',current);if(current)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  (isNativeTablet()?document.querySelector('.main-wrap'):window).scrollTo({top:0,behavior:scrollBehavior()});
  announce('Đã chuyển sang '+(view==='guide'?'Hướng dẫn':view==='saved'?'Cấu hình đã lưu':view==='custom'?'Cấu hình của tôi':'Thư viện'));
}

function fieldRow(label,value,{copy=true}={}){
  const has=value!==undefined && value!==null && String(value)!=='';
  return `<div class="field-row"><span class="field-label">${label}</span><div class="field-right"><span class="field-value ${has?'':'missing'}">${has?esc(value):'&#272;&#7875; tr&#7889;ng'}</span>${copy&&has?`<button type="button" class="field-copy" data-copy="${esc(value)}" aria-label="Sao chép ${esc(label)}">${icon('copy')}</button>`:''}</div></div>`;
}
function detailFocusSnapshot(){
  const active=document.activeElement;
  if(!(active instanceof Element)||!el('detailContent').contains(active))return null;
  return {platform:active.dataset?.platform||'',saveRegion:active.dataset?.saveRegion||'',action:active.dataset?.action||'',copyLabel:active.getAttribute('aria-label')||''};
}
function restoreDetailFocus(snapshot){
  if(!snapshot)return;
  const root=el('detailContent');
  const pick=selector=>selector?[...root.querySelectorAll(selector)].find(node=>node.getClientRects().length>0)||null:null;
  const captured=Boolean(snapshot.platform||snapshot.saveRegion||snapshot.action||snapshot.copyLabel);
  const node=
    pick(snapshot.platform&&`.detail-platform [data-platform="${CSS.escape(snapshot.platform)}"]`)||
    pick(snapshot.saveRegion&&`[data-action="save-detail"][data-save-region="${CSS.escape(snapshot.saveRegion)}"]`)||
    pick(snapshot.action&&`[data-action="${CSS.escape(snapshot.action)}"]`)||
    pick(snapshot.copyLabel&&`[aria-label="${CSS.escape(snapshot.copyLabel)}"]`)||
    (captured?pick('.detail-platform button[aria-pressed="true"]'):null);
  node?.focus();
}
function renderDetail(id){
  const p=getById(id);if(!p){closeDetail();return;}
  const focusSnapshot=detailFocusSnapshot();
  state.detailId=id;
  const shownApn=getCarrierApnForPlatform(p,state.platform), available=!!shownApn, iosAuto=!!p.iosAuto&&state.platform==='ios';
  const canExport=!!p.apn;
  const custom=p.kind==='custom';
  const verified=p.status==='official'&&available;
  const reference=p.status==='reference'||p.status==='unverified';
  const caution=reference||!available;
  const saved=isSaved(p.id);
  const bannerClass=verified?'':custom?'custom':'warn';
  const bannerLabel=iosAuto?'APN IPHONE / TỰ ĐỘNG':custom?'CẤU HÌNH RIÊNG':reference?'APN THAM KHẢO / CẦN KIỂM TRA':verified?'ACCESS POINT NAME (APN)':'APN STATUS';
  const fields=profileFields(p,state.platform);
  const rowOf=field=>fieldRow(field.label,field.value,{copy:field.copy!==false});
  const basicFields=fields.filter(field=>!field.advanced).map(rowOf).join('');
  const advancedFields=fields.filter(field=>field.advanced).map(rowOf).join('');
  const saveLabel=saved?'Đã lưu':'Lưu';
  const saveAria=`${saved?'Bỏ lưu':'Lưu'} ${esc(p.name)}`;
  const platformButton=(value,label)=>`<button type="button" class="platform-tab${state.platform===value?' active':''}" data-platform="${value}" aria-pressed="${state.platform===value}">${label}</button>`;
  const alternatives=p.alternatives?.length&&state.platform==='android'
    ?`<details class="detail-advanced apn-alternatives"><summary>APN thay thế tham khảo (chưa xác minh)</summary><p class="detail-note detail-note-warn">Đây là các giá trị do bên thứ ba đề cập, KHÔNG phải khuyến nghị của nhà mạng. Chỉ thay APN nếu được hỗ trợ xác nhận.</p>${p.alternatives.map(a=>`${fieldRow('APN khác',a.apn,{copy:true})}<p class="apn-alternative-note">${esc(a.note)}</p>${a.source?`<a class="detail-source" href="${esc(a.source)}" target="_blank" rel="noopener noreferrer">Nguồn tham khảo ${icon('external','icon--sm')}</a>`:''}`).join('')}</details>`
    :'';
  el('detailContent').innerHTML=`
    <div class="detail-top"><button type="button" class="detail-back" data-action="close-detail">${icon('arrow-left')} Thư viện</button><div class="detail-actions"><button type="button" class="detail-icon-btn ${saved?'saved':''}" data-action="save-detail" data-save-region="header" aria-pressed="${saved}" title="${saveAria}" aria-label="${saveAria}">${icon('bookmark',saved?'icon--fill':'')}</button><button type="button" class="close-btn" data-action="close-detail" aria-label="Đóng">${icon('close')}</button></div></div>
    <div class="detail-header">${carrierAvatarMarkup(p,'detail-emblem')}<span class="detail-kicker">${titleCase(p)} <span style="padding:0 8px">/</span> ${esc(p.prefix||'VIETNAM')}</span><h2 id="detailTitle">${esc(p.name)}</h2><div class="detail-meta">${KIND[p.kind]||KIND.custom}<br>${esc(p.host||'')}</div></div>
    ${sourceLine(p)}
    <div class="platform-switch detail-platform" role="group" aria-label="Chọn nền tảng">${platformButton('android',icon('android')+' Android')}${platformButton('ios',icon('apple')+' iPhone')}</div>
    <div class="detail-banner${bannerClass?' '+bannerClass:''}"><span class="banner-label">${bannerLabel}</span><div class="banner-apn">${available?esc(shownApn):iosAuto?'Không cần nhập APN':p.status==='upcoming'?'Chưa phát hành':'Chưa có APN được xác minh'}</div>${available?`<button type="button" class="copy-big" data-copy="${esc(shownApn)}">${icon('copy')} Sao chép APN</button>`:`<span class="status ${esc(p.status)}"><span class="status-dot-small"></span>${STATUS[p.status]}</span>`}</div>
    <div class="detail-block"><div class="detail-block-title"><span>THÔNG SỐ KỸ THUẬT</span>${badge(p)}</div><div class="field-list">
      ${basicFields}
      ${advancedFields?`<details class="detail-advanced detail-advanced-fields"><summary>Thông số nâng cao ${icon('chevron-right','icon--sm')}</summary>${advancedFields}</details>`:''}
    </div><div class="detail-note ${caution?'detail-note-warn':''}">${esc(p.note||'Custom profile saved on your device.')} ${available?'Giữ nguyên thông số SIM đã tự nhận nếu mạng đang hoạt động tốt. Các giá trị chung như IPv4/IPv6 là gợi ý, không phải tài liệu riêng của mọi nhà mạng.':''} ${!available?'Không sao chép APN của mạng chủ khi chưa được nhà mạng xác nhận.':''}</div>${alternatives}</div>
    <div class="detail-block"><div class="detail-block-title"><span>HƯỚNG DẪN</span><span style="color:var(--lime)">${state.platform==='android'?'ANDROID':'IPHONE'}</span></div><div class="detail-note">${state.platform==='android'?'Cài đặt → SIM &amp; mạng di động → Tên điểm truy cập → Thêm APN. Giữ MCC/MNC theo SIM; không sửa IMS/MMS có sẵn.':'Cài đặt → Di động → Chọn SIM → Mạng dữ liệu di động. Chỉ chỉnh sửa được nếu nhà mạng cho phép.'}</div></div>
    <details class="detail-tools"><summary>Xuất &amp; chia sẻ</summary><div class="detail-tools-body"><button type="button" class="outline-btn" data-action="${custom?'edit':'duplicate'}" ${!canExport?'disabled':''}>${custom?icon('edit')+' Chỉnh sửa':icon('copy')+' Sao chép / Sửa'}</button><button type="button" class="primary-btn" data-action="export-profile" ${!canExport?'disabled':''}>Xuất JSON ${icon('arrow-up-right')}</button><button type="button" class="outline-btn" data-action="export-android" ${!canExport?'disabled':''}>Xuất Android XML (tham khảo)</button>${custom?`<button type="button" class="outline-btn" data-action="delete-custom">${icon('trash')} Xóa</button>`:''}</div></details>
    <div class="detail-actionbar"><button type="button" class="outline-btn" data-action="save-detail" data-save-region="footer" aria-pressed="${saved}">${saveLabel}</button><button type="button" class="primary-btn" data-action="copy-all">Sao chép tất cả</button></div>`;
  restoreDetailFocus(focusSnapshot);
}
function openDetail(id){
  state.detailId=id;
  if(isNativeTablet()){
    setDetailColumnVisible(true);
    renderDetail(id);
    el('detailColumn').scrollTop=0;
    updateSelectedCard();
    return;
  }
  if(el('detailScrim').hidden)rememberFocus();
  el('detailScrim').hidden=false;document.body.style.overflow='hidden';renderDetail(id);detailPane.scrollTop=0;
  if(!el('detailScrim').hidden)el('detailContent').querySelector('.close-btn')?.focus();
  updateSelectedCard();
  updateModalInertness();
}
function closeDetail(){
  const inline=isNativeTablet();
  state.detailId=null;
  if(inline){
    el('detailContent').innerHTML='';
    setDetailColumnVisible(false);
  }else{
    el('detailScrim').hidden=true;document.body.style.overflow='';
    updateModalInertness();
    restoreFocus();
  }
  updateSelectedCard();
}
function setDetailColumnVisible(visible){
  const column=el('detailColumn');
  column.hidden=!visible;
  column.style.display=visible?'':'none';
}
function updateLayoutMode({refresh=true}={}){
  const inline=isNativeTablet();
  document.documentElement.classList.toggle('native-tablet',inline);
  const scrim=el('detailScrim');

  if(inline){
    el('detailColumn').append(detailPane);
    detailPane.setAttribute('role','region');
    detailPane.removeAttribute('aria-modal');
    scrim.hidden=true;
    document.body.style.overflow='';
    setDetailColumnVisible(!!state.detailId);
  }else{
    scrim.append(detailPane);
    detailPane.setAttribute('role','dialog');
    detailPane.setAttribute('aria-modal','true');
    setDetailColumnVisible(false);
    const showDetail=!!state.detailId&&state.view!=='guide';
    scrim.hidden=!showDetail;
    document.body.style.overflow=showDetail?'hidden':'';
  }
  if(state.detailId&&state.view!=='guide'&&el('editorScrim').hidden&&el('backupScrim').hidden)detailPane.focus();
  if(inline&&refresh)renderCards({animate:false});
  updateModalInertness();
}
async function copyText(value,successMessage){
  try {
    if(navigator.clipboard && (window.isSecureContext||location.protocol==='file:')) {await navigator.clipboard.writeText(String(value));}
    else throw new Error('clipboard not allowed');
  } catch {
    const inp=document.createElement('textarea');inp.value=String(value);inp.style.position='fixed';inp.style.opacity='0';document.body.append(inp);inp.select();
    const worked=document.execCommand?.('copy');inp.remove();
    if(!worked){showToast('Trình duyệt không cho phép sao chép');return;}
  }
  showToast(successMessage??('Đã sao chép: '+value));
  announce(successMessage??('Đã sao chép: '+value));
}
function downloadFile(name,text,mime='application/json'){const blob=new Blob([text],{type:mime+';charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportProfile(p){
  const safe={name:p.name,apn:p.apn,username:p.username||'',password:p.password||'',type:p.type||PROFILE_DEFAULTS.type,
    protocol:p.protocol||PROFILE_DEFAULTS.protocol,roamingProtocol:p.roamingProtocol||PROFILE_DEFAULTS.roamingProtocol,
    auth:p.auth||PROFILE_DEFAULTS.auth,bearer:p.bearer||PROFILE_DEFAULTS.bearer,
    proxy:p.proxy||'',port:p.port||'',server:p.server||'',mmsc:p.mmsc||'',mmsProxy:p.mmsProxy||'',mmsPort:p.mmsPort||'',
    mcc:p.mcc||'',mnc:p.mnc||'',mvnoType:p.mvnoType||'None',mvnoMatchData:p.mvnoMatchData||'',
    iosLte:p.iosLte||'',iosHotspot:p.iosHotspot||'',iosAuto:!!p.iosAuto,alternatives:p.alternatives||[],note:p.note||'',source:p.source||'',sourceLabel:p.sourceLabel||'',status:p.status};
  downloadFile(`apn-${p.id}.json`,JSON.stringify(safe,null,2));showToast('Profile JSON \u0111\u00e3 \u0111\u01b0\u1ee3c xu\u1ea5t');
}
function exportXml(p){downloadFile(`apn-${p.id}-android.xml`,buildAndroidReferenceXml(p),'application/xml');showToast('XML tham kh\u1ea3o, kh\u00f4ng t\u1ef1 c\u00e0i APN');}

function clearFormError(){
  const region=el('formError');
  region.textContent='';region.hidden=true;
  qsa('#profileForm [aria-invalid="true"]').forEach(field=>{field.removeAttribute('aria-invalid');field.removeAttribute('aria-describedby');});
}
function showFormError(fieldId,message){
  const field=el(fieldId),region=el('formError');
  const group=field.closest('details');
  if(group)group.open=true;
  region.textContent=message;region.hidden=false;
  field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby','formError');field.focus();
}
function openEditor(p=null){
  el('editId').value=p?.id||'';
  el('editorTitle').textContent=p?'Chỉnh sửa cấu hình':'Tạo cấu hình APN';
  for(const [id,key] of [['editName','name'],['editApn','apn'],['editUsername','username'],['editPassword','password'],['editType','type'],['editProtocol','protocol'],['editNote','note'],['editProxy','proxy'],['editPort','port'],['editServer','server'],['editMMSC','mmsc'],['editMMSProxy','mmsProxy'],['editMMSPort','mmsPort'],['editMcc','mcc'],['editMnc','mnc'],['editMvnoType','mvnoType'],['editMvnoMatchData','mvnoMatchData'],['editAuth','auth'],['editBearer','bearer'],['editRoamingProtocol','roamingProtocol'],['editIosLte','iosLte'],['editIosHotspot','iosHotspot']]){
    const input=el(id);input.value=p?.[key]??(PROFILE_DEFAULTS[key] ?? '');
  }
  clearFormError();
  rememberFocus();
  el('editorScrim').hidden=false;document.body.style.overflow='hidden';setTimeout(()=>el('editName').focus(),110);
  updateModalInertness();
}
function closeEditor(){el('editorScrim').hidden=true;document.body.style.overflow=el('detailScrim').hidden?'':'hidden';updateModalInertness();restoreFocus();}
function saveEditor(event){
  event.preventDefault();
  clearFormError();
  try{
    const oldId=el('editId').value;
    const input={id:oldId||undefined,name:el('editName').value,apn:el('editApn').value,
      username:el('editUsername').value,password:el('editPassword').value,
      type:el('editType').value,protocol:el('editProtocol').value,note:el('editNote').value,
      proxy:el('editProxy').value,port:el('editPort').value,server:el('editServer').value,
      mmsc:el('editMMSC').value,mmsProxy:el('editMMSProxy').value,mmsPort:el('editMMSPort').value,
      mcc:el('editMcc').value,mnc:el('editMnc').value,
      mvnoType:el('editMvnoType').value,mvnoMatchData:el('editMvnoMatchData').value,
      auth:el('editAuth').value,bearer:el('editBearer').value,roamingProtocol:el('editRoamingProtocol').value,
      iosLte:el('editIosLte').value,iosHotspot:el('editIosHotspot').value};
    const custom=validateCustomProfile(input);
    const index=state.customProfiles.findIndex(p=>p.id===custom.id);
    if(index<0){state.customProfiles.push(custom)}else{state.customProfiles[index]=custom;}
    persist();closeEditor();renderCards();if(state.detailId)closeDetail();openDetail(custom.id);
    showToast('Đã lưu cấu hình riêng');
  }catch(e){
    const mapped=FIELD_ERRORS.find(([needle])=>String(e?.message||'').includes(needle));
    if(mapped){showFormError(mapped[1],mapped[2]);return;}
    showToast('Cấu hình không hợp lệ: '+e.message);
  }
}
function deleteCustom(id){
  if(!confirm('Xóa cấu hình này khỏi thiết bị?'))return;
  const restoreInlineFocus=isNativeTablet()&&state.detailId===id&&detailPane.contains(document.activeElement);
  state.customProfiles=state.customProfiles.filter(p=>p.id!==id);
  state.savedIds=state.savedIds.filter(p=>p!==id);
  persist();if(state.detailId===id)closeDetail();renderCards();
  if(restoreInlineFocus)(el('carrierGrid').querySelector('.carrier-card.selected .card-open')||el('search')).focus();
  if(!document.activeElement||document.activeElement===document.body){
    (qsa('#carrierGrid .card-open')[0]||el('search')).focus();
  }
  showToast('Đã xóa cấu hình');
}
function openBackup(){rememberFocus();el('backupScrim').hidden=false;document.body.style.overflow='hidden';setTimeout(()=>el('backupClose').focus(),110);updateModalInertness();}
function closeBackup(){el('backupScrim').hidden=true;document.body.style.overflow='';updateModalInertness();restoreFocus();}
function exportBackup(){downloadFile('apn-atlas-vn-backup.json',buildBackup(state.savedIds,state.customProfiles));showToast('Đã xuất bản sao lưu');}
async function importBackup(file){
  if(!file)return;
  try{
    if(file.size>500000)throw Error('File too large');
    const data=parseBackup(await file.text());
    state.savedIds=data.savedIds;state.customProfiles=data.customProfiles;
    persist();closeBackup();renderCards();showToast('Kh\u00f4i ph\u1ee5c th\u00e0nh c\u00f4ng');
  }catch(e){showToast('T\u1ec7p sao l\u01b0u kh\u00f4ng h\u1ee3p l\u1ec7: '+e.message);}finally{el('fileInput').value='';}
}

function renderGuide(){
  const android=state.platform==='android';
  const steps=android?[
    ['01','M\u1edf C\u00e0i \u0111\u1eb7t','V\u00e0o C\u00e0i \u0111\u1eb7t, ch\u1ecdn SIM v\u00e0 m\u1ea1ng di \u0111\u1ed9ng. T\u00ean m\u1ee5c c\u00f3 th\u1ec3 kh\u00e1c theo h\u00e3ng m\u00e1y.'],
    ['02','M\u1edf Danh s\u00e1ch APN','Ch\u1ecdn T\u00ean \u0111i\u1ec3m truy c\u1eadp (Access Point Names), sau \u0111\u00f3 ch\u1ecdn Th\u00eam.'],
    ['03','Sao ch\u00e9p th\u00f4ng s\u1ed1','T\u1eeb APN Atlas, nh\u1ea5n Sao ch\u00e9p APN. Kh\u00f4ng t\u1ef1 s\u1eeda MCC/MNC c\u1ee7a SIM.'],
    ['04','L\u01b0u & th\u1eed k\u1ebft n\u1ed1i','L\u01b0u APN, ch\u1ecdn c\u1ea5u h\u00ecnh m\u1edbi v\u00e0 th\u1eed b\u1eadt/t\u1eaft ch\u1ebf \u0111\u1ed9 m\u00e1y bay.']
  ]:[
    ['01','M\u1edf C\u00e0i \u0111\u1eb7t','Truy c\u1eadp C\u00e0i \u0111\u1eb7t (Settings) > Di \u0111\u1ed9ng (Cellular / Mobile Data).'],
    ['02','Ch\u1ecdn SIM','V\u1edbi m\u00e1y c\u00f3 hai SIM, ch\u1ecdn \u0111\u00fang SIM c\u1ea7n c\u00e0i APN.'],
    ['03','M\u1ea1ng d\u1eef li\u1ec7u di \u0111\u1ed9ng','N\u1ebfu nh\u00e0 m\u1ea1ng cho ph\u00e9p, v\u00e0o Cellular Data Network v\u00e0 nh\u1eadp APN trong m\u1ee5c Cellular Data.'],
    ['04','X\u00e1c nh\u1eadn v\u1edbi nh\u00e0 m\u1ea1ng','Kh\u00f4ng th\u1ea5y m\u1ee5c APN? Nh\u00e0 m\u1ea1ng \u0111ang qu\u1ea3n l\u00fd. H\u00e3y li\u00ean h\u1ec7 h\u1ed7 tr\u1ee3; kh\u00f4ng c\u00e0i profile kh\u00f4ng r\u00f5 ngu\u1ed3n.']
  ];
  el('guideSteps').innerHTML=steps.map(s=>`<div class="step-card"><span class="step-number">${esc(s[0])} / 04</span><h3>${esc(s[1])}</h3><p>${esc(s[2])}</p></div>`).join('');
}
function setPlatform(platform){
  state.platform=platform;
  qsa('[data-platform]').forEach(b=>{const on=b.dataset.platform===platform;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  announce('Đã chọn nền tảng '+(platform==='ios'?'iPhone':'Android'));
  renderGuide();
  renderCards({animate:true});
  if(state.detailId)renderDetail(state.detailId);
}
function bindEvents(){
  qsa('[data-view]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
  qsa('.chip').forEach(b=>b.addEventListener('click',()=>{
    state.kind=b.dataset.kind;
    renderCards({animate:true});
    const kindNames={all:'Tất cả',mno:'Mạng hạ tầng',network:'Mạng hạ tầng',mvno:'Mạng ảo',other:'Đối tác',custom:'Của tôi'};
    const count=el('visibleCount')?.textContent||'0';
    announce('Đã lọc: '+(kindNames[state.kind]||state.kind)+', hiển thị '+count+' nhà mạng');
  }));
  el('search').addEventListener('input',e=>{state.query=e.target.value;renderCards();});
  el('skipLink')?.addEventListener('click',e=>{
    e.preventDefault();
    const target=el('mainContent');
    if(target){target.focus();target.scrollIntoView({behavior:scrollBehavior()});}
  });
  el('carrierGrid').addEventListener('keydown',e=>{
    if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key))return;
    const target=e.target.closest('.card-open');
    if(!target)return;
    const buttons=qsa('#carrierGrid .card-open');
    const idx=buttons.indexOf(target);
    if(idx<0)return;
    e.preventDefault();
    if(e.key==='Home'){buttons[0]?.focus();return;}
    if(e.key==='End'){buttons[buttons.length-1]?.focus();return;}
    if(e.key==='ArrowRight'||e.key==='ArrowDown')buttons[(idx+1)%buttons.length]?.focus();
    else buttons[(idx-1+buttons.length)%buttons.length]?.focus();
  });
  el('carrierGrid').addEventListener('click',e=>{const bookmark=e.target.closest('[data-save]');if(bookmark){toggleSave(bookmark.dataset.save);return;}const card=e.target.closest('[data-open]');if(card)openDetail(card.dataset.open);});
  document.addEventListener('click',e=>{
    if(!(e.target instanceof Element))return;
    const platformBtn=e.target.closest('[data-platform]');
    if(platformBtn){setPlatform(platformBtn.dataset.platform);return;}
    if(e.target===el('detailScrim')){closeDetail();return;}
    const control=e.target.closest('#detailContent [data-copy], #detailContent [data-action]');if(!control)return;
    if(control.dataset.copy!==undefined){copyText(control.dataset.copy);return;}
    const action=control.dataset.action,p=getById(state.detailId);if(!p)return;
    if(action==='close-detail'){closeDetail();return;}
    if(action==='copy-all'){
      const includeAdvanced=document.querySelector('#detailContent .detail-advanced-fields')?.open===true;
      copyText(buildProfileCopyText(p,state.platform,{includeAdvanced}),'Đã sao chép tất cả thông số');
      return;
    }
    if(action==='save-detail')toggleSave(p.id);
    if(action==='export-profile'&&p.apn)exportProfile(p);
    if(action==='export-android'&&p.apn)exportXml(p);
    if(action==='edit'&&p.kind==='custom')openEditor(p);
    if(action==='duplicate'&&p.apn)openEditor({...p,id:'',name:p.name+' - copy'});
    if(action==='delete-custom'&&p.kind==='custom')deleteCustom(p.id);
  });
  ['newProfileHeader','mobileAdd','emptyCreate','customCreate'].forEach(id=>el(id).addEventListener('click',()=>openEditor()));
  el('profileForm').addEventListener('submit',saveEditor);
  el('profileForm').addEventListener('input',()=>clearFormError());
  ['editorClose','editorCancel'].forEach(id=>el(id).addEventListener('click',closeEditor));
  ['backupNav'].forEach(id=>el(id).addEventListener('click',openBackup));
  el('backupClose').addEventListener('click',closeBackup);
  el('exportBackup').addEventListener('click',exportBackup);
  el('importBackup').addEventListener('click',()=>el('fileInput').click());
  el('fileInput').addEventListener('change',e=>importBackup(e.target.files?.[0]));
  el('headerHelp').addEventListener('click',()=>switchView('guide'));
  el('exploreBtn').addEventListener('click',()=>el('catalogAnchor').scrollIntoView({behavior:scrollBehavior()}));
  el('brandHome').addEventListener('click',e=>{e.preventDefault();switchView('library');});
  qsa('.scrim').forEach(scrim=>{if(scrim.id!=='detailScrim')scrim.addEventListener('click',e=>{if(e.target!==scrim)return;if(scrim.id==='editorScrim')closeEditor();if(scrim.id==='backupScrim')closeBackup();});});
  document.addEventListener('keydown',e=>{
    const dialog=topDialog();
    if(dialog&&trapFocus(e,dialog))return;
    if(e.key==='Escape'){
      if(!el('editorScrim').hidden)closeEditor();
      else if(!el('backupScrim').hidden)closeBackup();
      else if(!el('detailScrim').hidden)closeDetail();
      return;
    }
    if(e.key==='/'&&!dialog&&document.activeElement?.tagName!=='INPUT'&&document.activeElement?.tagName!=='TEXTAREA'&&el('libraryView').hidden===false){e.preventDefault();el('search').focus();}
  });
}

document.documentElement.classList.toggle('native-app',NATIVE_SHELL);
bindEvents();updateCounters();
updateLayoutMode({refresh:false});
renderCards({animate:true});renderGuide();
requestAnimationFrame(()=>initHeroMotion());
if(NATIVE_SHELL)TABLET_MEDIA.addEventListener('change',()=>updateLayoutMode());
if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Offline cache not available',e));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});

document.addEventListener('error',event=>{
 if(event.target?.matches?.('img.carrier-logo'))event.target.closest('.carrier-avatar')?.classList.add('logo-failed');
},true);
