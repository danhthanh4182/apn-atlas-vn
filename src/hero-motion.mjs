// Hero motion: tách dòng h1, parallax theo con trỏ, đếm số, nút "hot", tạm dừng khi ngoài màn hình.
// Dùng: import {initHeroMotion} from './hero-motion.mjs'; gọi trong requestAnimationFrame SAU lần render đầu
// (khi #statTotal / #statSaved đã có giá trị). CSS tương ứng: hero-motion.css.
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;

// Bọc từng dòng (ngăn bởi <br>) để CSS làm hiệu ứng mask-reveal; giữ nguyên <em> bên trong.
function splitLines(h1){
  if(!h1||h1.dataset.hm)return;
  h1.dataset.hm='1';
  if(h1.querySelector('.hm-line'))return;
  const lines=[[]];
  [...h1.childNodes].forEach(n=>{if(n.nodeName==='BR')lines.push([]);else lines[lines.length-1].push(n);});
  h1.textContent='';
  lines.forEach((nodes,i)=>{
    const line=document.createElement('span'),inner=document.createElement('span');
    line.className='hm-line';inner.className='hm-in';inner.style.setProperty('--i',i);
    nodes.forEach(n=>inner.append(n));line.append(inner);h1.append(line);
  });
}

function countUp(root){
  root.querySelectorAll('.stat-num').forEach((n,i)=>{
    const to=parseInt(n.textContent,10),pad=n.textContent.length;
    if(n.dataset.counted||reduce||!Number.isFinite(to)||to<=0)return;
    n.dataset.counted='1';
    const delay=900+i*90;
    setTimeout(()=>{
      const t0=performance.now(),dur=800;
      const tick=now=>{
        const p=Math.min(Math.max((now-t0)/dur,0),1),e=1-Math.pow(1-p,3);
        n.textContent=String(Math.round(to*e)).padStart(pad,'0');
        if(p<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },delay);
  });
}

export function initHeroMotion(root=document){
  const hero=root.querySelector('.hero');
  if(!hero)return;
  splitLines(hero.querySelector('h1'));
  if (window.requestIdleCallback) requestIdleCallback(() => countUp(root)); else setTimeout(() => countUp(root), 300);
  if(reduce)return;
  new IntersectionObserver(([e])=>hero.classList.toggle('hm-paused',!e.isIntersecting)).observe(hero);
  document.addEventListener('visibilitychange',()=>hero.classList.toggle('hm-paused',document.hidden));
  const btn=hero.querySelector('.primary-btn');
  if(btn){
    const on=()=>hero.classList.add('hm-hot'),off=()=>hero.classList.remove('hm-hot');
    btn.addEventListener('pointerenter',on);btn.addEventListener('pointerleave',off);
    btn.addEventListener('focus',on);btn.addEventListener('blur',off);
  }
  if(!fine)return;
  let tx=0,ty=0,cx=0,cy=0,raf=0;
  const tick=()=>{
    cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
    hero.style.setProperty('--px',cx.toFixed(3));hero.style.setProperty('--py',cy.toFixed(3));
    raf=Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001?requestAnimationFrame(tick):0;
  };
  hero.addEventListener('pointermove',e=>{
    const r=hero.getBoundingClientRect();
    tx=((e.clientX-r.left)/r.width-.5)*2;ty=((e.clientY-r.top)/r.height-.5)*2;
    hero.style.setProperty('--mx',e.clientX-r.left+'px');hero.style.setProperty('--my',e.clientY-r.top+'px');
    hero.classList.add('hm-hover');
    if(!raf)raf=requestAnimationFrame(tick);
  });
  hero.addEventListener('pointerleave',()=>{tx=ty=0;hero.classList.remove('hm-hover');if(!raf)raf=requestAnimationFrame(tick);});
}
