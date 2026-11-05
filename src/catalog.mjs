// Data reviewed 2026-11-05. Unknown values are intentionally left blank.
// A host network's APN is NOT automatically the right APN for its MVNO.
export const CARRIERS = Object.freeze([
  {
    id:'viettel', name:'Viettel', kind:'network', status:'official',
    apn:'v-internet', prefix:'03x, 096-098', host:'Own radio network',
    aliases:['Viettel Telecom'], symbol:'VT', hue:'red',
    source:'https://media.vietteltelecom.vn/upload/InternationalMessagePrice/81/35/58/c3e6d410c510145d179f2a233284b0247270ce88.pdf',
    sourceLabel:'Viettel Telecom', note:'Data APN confirmed in official roaming documentation.'
  },
  {
    id:'vinaphone', name:'VinaPhone', kind:'network', status:'reference',
    apn:'m3-world', prefix:'081-085, 088, 091, 094', host:'Own radio network',
    aliases:['VNPT','Vina'], symbol:'VN', hue:'blue',
    source:'https://noidungsohanoi.mobifone.vn/dieu-gi-khien-sim-ghep-khong-len-4g-cach-khac-phuc',
    sourceLabel:'MobiFone content portal', note:'Published by another network operator; confirm against your VinaPhone SIM if it already auto-configured.'
  },
  {
    id:'mobifone', name:'MobiFone', kind:'network', status:'official',
    apn:'m-wap', prefix:'07x, 089, 090, 093', host:'Own radio network',
    aliases:['Mobi'], symbol:'MB', hue:'cyan',
    source:'https://www.mobifone.vn/dich-vu-di-dong/dich-vu/thue-bao-mobifone-ra-nuoc-ngoai-ROAMINGOUT',
    sourceLabel:'MobiFone', note:'Confirmed in official roaming instructions. No username/password prefilled.'
  },
  {
    id:'vietnamobile', name:'Vietnamobile', kind:'network', status:'official',
    apn:'internet', prefix:'052, 056, 058, 092', host:'Own radio network',
    aliases:['Vietnam Mobile'], symbol:'VM', hue:'orange',
    source:'https://www.vietnamobile.com.vn/en/cac-cau-hoi-thuong-gap-ve-du-lieu',
    sourceLabel:'Vietnamobile', note:'Confirmed in official data FAQ.'
  },
  {
    id:'itel', name:'iTel', kind:'mvno', status:'official',
    apn:'m9-itelecom', prefix:'087', host:'VNPT / VinaPhone',
    aliases:['iTelecom','Indochina Telecom'], symbol:'iT', hue:'violet',
    source:'https://itel.vn/huong-dan-nguoi-dung/huong-dan-cai-dat-apn-Xiaomi',
    sourceLabel:'iTel', note:'Official APN for Android and iPhone. Leave username/password empty.'
  },
  {
    id:'wintel', name:'Wintel', kind:'mvno', status:'official',
    apn:'m9-wintel', prefix:'055', host:'VNPT / VinaPhone',
    aliases:['Reddi','Mobicast'], symbol:'Wi', hue:'purple',
    source:'https://wintel.vn/huong-dan-cai-dat-apn',
    sourceLabel:'Wintel', note:'Formerly Reddi; Wintel confirms the APN on its official support page.'
  },
  {
    id:'local', name:'Local', kind:'mvno', status:'reference',
    apn:'local', prefix:'089', host:'MobiFone',
    aliases:['Local SIM','ASIM','ASIM Telecom'], symbol:'Lo', hue:'green',
    source:'https://hanhtinker.com/sim-nao-nuoi-duong-backup-re-nhat-local-itel-vnsky-so-voi-nh',
    sourceLabel:'Hạnh Tinker (bên thứ ba)',
    note:'APN tham khảo từ nguồn bên thứ ba, chưa xác nhận chính thức với Local/ASIM. Nếu SIM đang hoạt động tốt, không sửa cấu hình tự động.',
    alternatives:[{apn:'m-wap',status:'reference',source:'https://hanhtinker.com/sim-mang-ao-hien-chu-r-va-mat-mang-bat-chuyen-vung-du-lieu-c',note:'APN hạ tầng MobiFone được nguồn bên thứ ba đề cập; chỉ thử khi hỗ trợ Local/ASIM xác nhận phù hợp với SIM.'}]
  },
  {
    id:'vnsky', name:'VNSKY', kind:'mvno', status:'reference',
    apn:'vnsky', prefix:'0777', host:'MobiFone',
    aliases:['Digilife','VNPay'], symbol:'SK', hue:'sky',
    source:'https://hanhtinker.com/sim-nao-nuoi-duong-backup-re-nhat-local-itel-vnsky-so-voi-nh',
    sourceLabel:'Hạnh Tinker (bên thứ ba)',
    note:'APN tham khảo từ nguồn bên thứ ba, chưa xác nhận chính thức với VNSKY. Các hướng dẫn cộng đồng còn chưa thống nhất; ưu tiên cấu hình SIM tự nhận.',
    alternatives:[{apn:'m-wap',status:'reference',source:'https://hanhtinker.com/sim-mang-ao-hien-chu-r-va-mat-mang-bat-chuyen-vung-du-lieu-c',note:'APN hạ tầng MobiFone được nguồn bên thứ ba đề cập; chỉ thử khi hỗ trợ VNSKY xác nhận phù hợp với SIM.'}]
  },
  {
    id:'fpt', name:'FPT SIM', kind:'mvno', status:'unverified',
    apn:'', prefix:'0775', host:'MobiFone',
    aliases:['FPT Retail','FPT Mobile'], symbol:'FP', hue:'orange',
    source:'https://fptshop.com.vn/tin-tuc/tin-khuyen-mai/viet-nam-co-them-mang-di-dong-fpt-174228',
    sourceLabel:'FPT Shop', note:'Network launch confirmed; a public official APN value is not confirmed.'
  },
  {
    id:'pottel', name:'Pottel', kind:'mvno', status:'reference',
    apn:'pottel', prefix:'075 (chưa khai thác)', host:'VNPT / VinaPhone',
    aliases:['Vietnam Post','VNPost','SIM du lịch Pottel'], symbol:'PT', hue:'yellow',
    source:'https://bellroam.com/vi/esim/vietnam-vinaphone-pottel',
    sourceLabel:'BellRoam (nhà phân phối SIM du lịch)', iosAuto:true,
    note:'APN tham khảo pottel chỉ được nhà phân phối hướng dẫn cho SIM/eSIM du lịch Pottel trên Android; chưa xác nhận là cấu hình chung của mọi SIM Pottel. iPhone theo nhà phân phối không cần nhập APN. Đầu số 075 chưa khai thác chính thức.'
  },
  {
    id:'gmobile', name:'Gmobile', kind:'other', status:'official',
    apn:'m-wap', prefix:'059, 099', host:'MobiFone (partner SIM)',
    aliases:['Gtel','Gmobile-MobiFone'], symbol:'GM', hue:'teal',
    source:'https://beta.gmobile.vn/thiet-lap-apn',
    sourceLabel:'Gmobile', note:'Applies to Gmobile 4G SIMs in the MobiFone partner program. Older SIM types may differ.'
  },
  {
    id:'skyfi', name:'SkyFi', kind:'mvno', status:'upcoming',
    apn:'', prefix:'Not announced', host:'Not publicly confirmed',
    aliases:['Galaxy Telecom'], symbol:'SF', hue:'slate',
    source:'https://vnexpress.net/thi-truong-canh-tranh-giup-vien-thong-viet-nam-trong-top-dau-the-gioi-5126748.html',
    sourceLabel:'VnExpress', note:'Licensed but not officially launched as of November 2026. No APN should be assumed.'
  }
]);

export const PROFILE_DEFAULTS = Object.freeze({
  type:'default,supl', protocol:'IPv4/IPv6', roamingProtocol:'IPv4/IPv6',
  auth:'None', bearer:'Unspecified', username:'', password:'',
  proxy:'', port:'', server:'', mmsc:'', mmsProxy:'', mmsPort:'', mcc:'', mnc:'', mvnoType:'None', mvnoMatchData:'', iosLte:'', iosHotspot:''
});

export function normalizeText(value='') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g,'d').replace(/\u0110/g,'D').toLowerCase().trim();
}

export function filterProfiles(profiles, {query='', kind='all', savedOnly=false, savedIds=[]}={}) {
  const q=normalizeText(query);
  const saved=new Set(savedIds);
  return profiles.filter(p => {
    if (kind !== 'all' && p.kind !== kind) return false;
    if (savedOnly && !saved.has(p.id)) return false;
    if (!q) return true;
    const content = [p.name,p.apn,p.host,p.prefix,p.note,...(p.aliases||[]),...(p.alternatives||[]).map(x=>x.apn)].join(' ');
    return normalizeText(content).includes(q);
  });
}

function limitedString(value, max=160) {return typeof value === 'string' ? value.trim().slice(0,max) : '';}
export function validateCustomProfile(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid profile');
  if (typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 80) throw new Error('Invalid name (1-80 characters)');
  if (typeof input.apn !== 'string' || !input.apn.trim() || input.apn.trim().length > 128) throw new Error('Invalid APN (1-128 characters)');
  if(input.mcc && !/^\d{3}$/.test(String(input.mcc))) throw new Error('Invalid MCC');
  if(input.mnc && !/^\d{2,3}$/.test(String(input.mnc))) throw new Error('Invalid MNC');
  const id=typeof input.id==='string' && /^custom_[a-zA-Z0-9_-]{6,90}$/.test(input.id)
    ? input.id : `custom_${globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+Math.random().toString(36).slice(2)}`;
  return {
    id, name:limitedString(input.name,80), kind:'custom', status:'custom',
    apn:limitedString(input.apn,128), host:limitedString(input.host,80),
    prefix:limitedString(input.prefix,50),
    username:limitedString(input.username,128),password:limitedString(input.password,128),
    type:limitedString(input.type || PROFILE_DEFAULTS.type,80),
    protocol:['IPv4','IPv6','IPv4/IPv6'].includes(input.protocol) ? input.protocol : PROFILE_DEFAULTS.protocol,
    roamingProtocol:['IPv4','IPv6','IPv4/IPv6'].includes(input.roamingProtocol) ? input.roamingProtocol : PROFILE_DEFAULTS.roamingProtocol,
    auth:['None','PAP','CHAP','PAP or CHAP'].includes(input.auth) ? input.auth : 'None',
    bearer:limitedString(input.bearer || PROFILE_DEFAULTS.bearer,60),
    mcc:limitedString(input.mcc,3),mnc:limitedString(input.mnc,3),
    proxy:limitedString(input.proxy,160),port:limitedString(input.port,8),server:limitedString(input.server,160),
    mmsc:limitedString(input.mmsc,300),mmsProxy:limitedString(input.mmsProxy,160),mmsPort:limitedString(input.mmsPort,8),
    mvnoType:['None','SPN','IMSI','GID','ICCID'].includes(input.mvnoType)?input.mvnoType:'None',
    mvnoMatchData:limitedString(input.mvnoMatchData,160),
    iosLte:limitedString(input.iosLte,128),iosHotspot:limitedString(input.iosHotspot,128),
    note:limitedString(input.note,500),symbol:'CU',hue:'teal',aliases:[],source:'',sourceLabel:''
  };
}

export function buildBackup(savedIds=[],customProfiles=[]) {
  const ids=Array.from(new Set(savedIds.filter(x=>typeof x==='string')));
  const customs=customProfiles.map(validateCustomProfile);
  const savedCarriers=CARRIERS.filter(c=>ids.includes(c.id));
  return JSON.stringify({format:'apn-atlas-vn',version:1,exportedAt:new Date().toISOString(),
    savedIds:ids,
    savedProfiles:savedCarriers,
    customProfiles:customs
  },null,2);
}

export function parseBackup(raw) {
  if (typeof raw !== 'string' || raw.length > 500000) throw new Error('Invalid backup size');
  let obj;
  try {obj=JSON.parse(raw);} catch {throw new Error('Invalid JSON');}
  if (!obj || obj.format !== 'apn-atlas-vn' || obj.version !== 1) throw new Error('Unsupported backup version');
  if (!Array.isArray(obj.savedIds) || !Array.isArray(obj.customProfiles) || obj.customProfiles.length > 200) throw new Error('Invalid backup content');
  const customs=obj.customProfiles.map(validateCustomProfile);
  const known=new Set([...CARRIERS.map(p=>p.id),...customs.map(p=>p.id)]);
  return {savedIds:[...new Set(obj.savedIds.filter(id=>typeof id==='string' && known.has(id)))],customProfiles:customs};
}

export function escapeXml(value='') {
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

export function buildAndroidReferenceXml(profile) {
  const p={...PROFILE_DEFAULTS,...profile};
  const keys=['name','apn','username','password','type','protocol','roamingProtocol','auth','bearer','mcc','mnc','proxy','port','server','mmsc','mmsProxy','mmsPort','mvnoType','mvnoMatchData'];
  return `<?xml version="1.0" encoding="UTF-8"?>\n`+
    `<!-- reference-only: Android does not import this file into system APN settings. -->\n`+
    `<apn-profile source="APN Atlas VN" version="1" platform="android" purpose="reference-only">\n`+
    keys.map(key=>`  <${key}>${escapeXml(p[key] || '')}</${key}>`).join('\n')+
    `\n</apn-profile>\n`;
}
export function escapeHtml(value='') {
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

export function getCarrierApnForPlatform(profile, platform='android') {
  if (platform === 'ios' && profile?.iosAuto === true) return '';
  return profile?.apn || '';
}

export const DATA_REVIEWED = '2026-11-05';

export function profileFields(profile, platform='android') {
  const p={...PROFILE_DEFAULTS,...profile};
  const apn=getCarrierApnForPlatform(p,platform);
  if (platform === 'ios') {
    const iosAuto=p.iosAuto===true;
    return [
      {label:'Tên APN', value:p.name||''},
      {label:'Cellular Data', value:apn},
      {label:'Username', value:p.username},
      {label:'Password', value:p.password},
      {label:'LTE setup (optional)', value:iosAuto?'':p.iosLte||(p.id==='itel'?p.apn:'')},
      {label:'Personal Hotspot', value:iosAuto?'':p.iosHotspot||(p.id==='itel'?p.apn:'')}
    ];
  }
  const hasMccMnc=Boolean(p.mcc&&p.mnc);
  return [
    {label:'Tên APN', value:p.name||''},
    {label:'APN', value:apn},
    {label:'Username', value:p.username},
    {label:'Password', value:p.password},
    {label:'APN type', value:p.type},
    {label:'Protocol', value:p.protocol},
    {label:'Roaming protocol', value:p.roamingProtocol},
    {label:'Authentication', value:p.auth},
    {label:'Bearer', value:p.bearer},
    {label:'MCC / MNC', value:hasMccMnc?`${p.mcc} / ${p.mnc}`:'Tự nhận theo SIM', copy:hasMccMnc},
    {label:'Proxy', value:p.proxy, advanced:true},
    {label:'Port', value:p.port, advanced:true},
    {label:'Server', value:p.server, advanced:true},
    {label:'MMSC', value:p.mmsc, advanced:true},
    {label:'MMS proxy', value:p.mmsProxy, advanced:true},
    {label:'MMS port', value:p.mmsPort, advanced:true},
    {label:'MVNO type', value:p.mvnoType||'None', advanced:true},
    {label:'MVNO value', value:p.mvnoMatchData, advanced:true}
  ];
}

export function buildProfileCopyText(profile, platform='android', {includeAdvanced=true}={}) {
  return profileFields(profile, platform)
    .filter(({value, copy, advanced}) => copy !== false && String(value ?? '').trim() !== '' && (includeAdvanced || !advanced))
    .map(({label, value}) => `${label}: ${value}`)
    .join('\n');
}
