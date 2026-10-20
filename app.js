(() => {
'use strict';
const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=(a,b,x)=>{let t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const make=(tag,attrs,parent)=>{let e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));parent.append(e);return e};
const leaves=[];
[[.1,-1,1.06],[.18,1,.88],[.31,-1,1.24],[.42,1,1.13],[.54,-1,.84],[.62,1,.62]].forEach(([start,side,size],i)=>{
const g=make('g',{},$('#leaves'));
make('path',{d:'M0 0 C-27-7-52-28-61-67 C-42-70-8-51 0 0Z',fill:'url(#leafGradient)'},g);
make('path',{d:'M0 0Q-28-31-59-64 M-17-24l-18-6M-28-37l-2-17M-37-46l-15-3',fill:'none',stroke:'#bbc098','stroke-width':'.7',opacity:'.6'},g);
leaves.push({g,start,side,size});
});
// Layered translucent petals and fine veins keep the flower organic at every size.
const petalPath='M0 13 C-25 22-88-9-107-54 C-123-91-108-126-88-137 C-72-148-63-135-48-145 C-26-157-2-149 12-133 C32-110 34-72 20-43 C10-18 1-5 0 13Z';
for(let i=0;i<8;i++){
const angle=i*45-17,g=make('g',{transform:`rotate(${angle}) scale(${i<4?1:.84})`},$('#petals'));
make('path',{d:petalPath,fill:`url(#petal${i%2?'A':'B'})`,'fill-opacity':i<4?'.96':'.89',stroke:'#9e2725','stroke-width':'.5'},g);
for(let j=0;j<9;j++){let x=-85+j*12;make('path',{d:`M0 4Q${x*.6} -49 ${x} ${-125+Math.abs(j-4)*2}`,fill:'none',stroke:j%2?'#ffd5a4':'#8b1727','stroke-width':j%2?'.7':'.5',opacity:j%2?'.17':'.19'},g)}
}
for(let i=0;i<52;i++){let a=i*2.3999,r=24+(i%7)*2.1,x=Math.cos(a)*r,y=Math.sin(a)*r;make('path',{d:`M0 0L${x} ${y}`,stroke:'#482524','stroke-width':'1.2'},$('#stamens'));make('ellipse',{cx:x,cy:y,rx:2,ry:2.8,fill:i%3?'#332723':'#b9985b',transform:`rotate(${a*180/Math.PI} ${x} ${y})`},$('#stamens'))}
for(let i=0;i<11;i++){let a=i*Math.PI*2/11;make('path',{d:`M0 0L${Math.cos(a)*17} ${Math.sin(a)*17}`,stroke:'#9b9e6d','stroke-width':'1.4',opacity:'.65'},$('#seedHead'))}
const motes=[];for(let i=0;i<14;i++){motes.push(make('circle',{r:i%3===0?1.3:.7,opacity:'.28'},$('#motes')))}
const chapters=[
  {phase:'Khởi đầu của một điều đẹp đẽ.',phrase:'Mọi hành trình bắt đầu từ một mầm nhỏ.'},
  {phase:'Đón nắng và vươn mình.',phrase:'Không cần vội. Cứ hướng về phía ánh sáng.'},
  {phase:'Một lời hẹn còn khép lại.',phrase:'Có những chờ đợi mang hình dáng một nụ hoa.'},
  {phase:'Khoảnh khắc của riêng mình.',phrase:'Một đóa nở. Cả một hành trình.'}
];
// Two days pass as the plant grows; reverse scrolling rewinds the sky too.
const sky=$('#sky'),sun=$('#sun'),moon=$('#moon'),stars=$('#stars'),clouds=$('#clouds');
const root=document.documentElement;
for(let i=0;i<64;i++){
  make('circle',{cx:(i*173.37+47)%1000,cy:22+(i*89.13)%620,r:i%7===0?1.5:.55+(i%3)*.25,opacity:.35+(i%5)*.12,class:'star'},stars);
}
const skyStops=[
  {at:0,top:[187,212,220],mid:[230,232,216],bottom:[243,237,218]},
  {at:.23,top:[105,124,160],mid:[199,158,152],bottom:[240,194,146]},
  {at:.5,top:[10,20,40],mid:[27,43,67],bottom:[54,67,81]},
  {at:.77,top:[110,125,159],mid:[206,169,164],bottom:[246,213,171]},
  {at:1,top:[187,212,220],mid:[230,232,216],bottom:[243,237,218]}
];
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const rgb=c=>`rgb(${c.join(',')})`;
let lastSkyProgress=-1,lastSkyLabel='';
function paintSky(p){
  if(p===lastSkyProgress)return;
  lastSkyProgress=p;
  const cycle=(p*2)%1,angle=p*Math.PI*4,daylight=(1+Math.cos(angle))/2;
  const night=smooth(.1,.95,1-daylight);
  const index=skyStops.findIndex((stop,i)=>i<skyStops.length-1&&cycle>=stop.at&&cycle<=skyStops[i+1].at);
  const a=skyStops[Math.max(0,index)],b=skyStops[Math.max(0,index)+1];
  const blend=smooth(a.at,b.at,cycle);
  const top=mix(a.top,b.top,blend),mid=mix(a.mid,b.mid,blend),bottom=mix(a.bottom,b.bottom,blend);
  sky.style.background=`linear-gradient(180deg,${rgb(top)},${rgb(mid)} 65%,${rgb(bottom)})`;
  root.style.setProperty('--night',night.toFixed(3));
  root.style.setProperty('--paper',rgb(bottom));
  const luminance=c=>c[0]*.2126+c[1]*.7152+c[2]*.0722;
  const darkGround=luminance(bottom)<140,darkSky=luminance(top)<145;
  root.style.setProperty('--ink',rgb(darkGround?[235,241,234]:[43,58,49]));
  root.style.setProperty('--muted',rgb(darkGround?[185,204,211]:[70,92,82]));
  root.style.setProperty('--line',rgb(darkGround?[92,117,132]:[165,183,169]));
  root.style.setProperty('--sky-ink',rgb(darkSky?[240,242,231]:[43,58,49]));
  root.style.setProperty('--sky-muted',rgb(darkSky?[217,227,224]:[70,92,82]));
  root.style.setProperty('--sky-line',darkSky?'rgba(225,235,230,.25)':'rgba(65,87,73,.2)');
  root.style.setProperty('--cloud-shift',`${(p*120).toFixed(1)}px`);
  sun.style.left=`${50+31*Math.sin(angle+.65)}%`;
  sun.style.top=`${23+62*(1-daylight)}%`;
  sun.style.opacity=smooth(.12,.68,daylight).toFixed(3);
  moon.style.left=`${50-31*Math.sin(angle+.65)}%`;
  moon.style.top=`${23+62*daylight}%`;
  moon.style.opacity=smooth(.2,.85,1-daylight).toFixed(3);
  stars.style.opacity=smooth(.3,.94,night).toFixed(3);
  clouds.style.opacity=(.65-.57*night).toFixed(3);
  const label=night>.8?'Ban đêm':night>.24?(Math.sin(angle)>0?'Hoàng hôn':'Bình minh'):'Ban ngày';
  if(label!==lastSkyLabel){$('#skyLabel').textContent=label;lastSkyLabel=label;}
}
let target=0,current=0,lastChapter=-1,audio=null,soundOn=false,gain=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function scrollToProgress(p){window.scrollTo({top:p*(document.documentElement.scrollHeight-innerHeight),behavior:reduced?'instant':'smooth'})}
function updateScroll(){target=clamp(scrollY/(document.documentElement.scrollHeight-innerHeight))}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);
function render(t){
current=reduced?target:current+(target-current)*.085;if(Math.abs(target-current)<.0001)current=target;const p=current;
paintSky(p);
const grow=smooth(0,.73,p),topY=626-226*grow,topX=350,sway=reduced?0:Math.sin(t*.0007)*1.4*grow;
$('#stem').setAttribute('d',`M350 712 C${341+sway} ${666-grow*60} ${392+sway} ${topY+100} ${topX+sway} ${topY}`);
leaves.forEach(({g,start,side,size},i)=>{let s=smooth(start-.12,start+.2,p);if(i<2)s=.55+.45*s;let y=683-(35+i*36)*(.18+grow*.82),x=350+Math.sin((712-y)/(712-topY)*3)*12;g.setAttribute('transform',`translate(${x+sway} ${y}) rotate(${side===1?103:0}) scale(${s*size*(.54+grow*.46)} ${s*size*(.54+grow*.46)})`)});
const bloom=smooth(.72,1,p),bud=smooth(.43,.67,p)*(1-smooth(.73,.88,p));
$('#bud').setAttribute('transform',`translate(${topX+sway} ${topY}) rotate(${(1-bloom)*-12}) scale(${bud*.73})`);
$('#flower').setAttribute('transform',`translate(${topX+sway} ${topY-8}) rotate(${-11+8*bloom}) scale(${bloom*1.3})`);
$('#flower').style.opacity=smooth(.72,.79,p);
$('#roots').style.opacity=.25+.2*grow;
motes.forEach((m,i)=>{const time=reduced?0:t*.000012;m.setAttribute('cx',280+Math.sin(i*7.21+time)*160);m.setAttribute('cy',300+((i*43-time*100)%350));m.style.opacity=(.13+grow*.13)*(i%3?.5:1)});
$('#trackFill').style.width=`${p*100}%`;$('#day').textContent=String(Math.round(1+p*89)).padStart(2,'0');
const chapter=p<.26?0:p<.57?1:p<.79?2:3;
if(chapter!==lastChapter){const c=chapters[chapter];$('#phase').textContent=c.phase;$('#chapterPhrase').textContent=c.phrase;$('#chapterIndex').textContent=`0${chapter+1} / 04`;$('#specimenNumber').textContent=`FIG. 0${chapter+1}`;document.body.classList.toggle('bloomed',chapter===3);document.querySelectorAll('.chapter').forEach((b,i)=>{b.classList.toggle('active',i<=chapter);b.setAttribute('aria-current',i===chapter?'step':'false')});lastChapter=chapter}
if(gain&&audio)gain.gain.setTargetAtTime(soundOn?.055+p*.025:0,audio.currentTime,.3);
requestAnimationFrame(render)}
$('#begin').onclick=()=>scrollToProgress(.34);$('#replay').onclick=()=>scrollToProgress(0);$('.wordmark').onclick=e=>{e.preventDefault();scrollToProgress(0)};
document.querySelectorAll('[data-progress]').forEach(b=>b.onclick=()=>scrollToProgress(Number(b.dataset.progress)));
$('#aboutButton').onclick=()=>$('#about').showModal();$('#about .close').onclick=()=>$('#about').close();$('#about').onclick=e=>{if(e.target===$('#about')){let r=$('#about').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#about').close()}};
$('#sound').onclick=async()=>{try{if(!audio){audio=new(window.AudioContext||window.webkitAudioContext)();gain=audio.createGain();gain.gain.value=0;gain.connect(audio.destination);[130.81,196,261.63,329.63].forEach((f,i)=>{let o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.17/(i+1);o.connect(g);g.connect(gain);o.start();let l=audio.createOscillator(),lg=audio.createGain();l.frequency.value=.08+i*.025;lg.gain.value=.06;l.connect(lg);lg.connect(g.gain);l.start()})}await audio.resume();soundOn=!soundOn;$('#sound').setAttribute('aria-pressed',String(soundOn));$('#sound span').textContent=soundOn?'Âm thanh bật':'Âm thanh tắt'}catch{$('#sound span').textContent='Âm thanh chưa khả dụng'}};
updateScroll();requestAnimationFrame(render);
})();
