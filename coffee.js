/* Standalone landing: works from file:// and static HTTP hosting. */
(async function(){
'use strict';
/* Keep the authored video on its final decoded frame after playback ends. */
const W=1672,H=941;
const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});
async function createCoffeeScene({baseCanvas}){
 const start=await load('assets/stcop/landing-open.png');
 const film=document.querySelector('#spill-film'),base=baseCanvas.getContext('2d',{alpha:false});
 const tile=document.createElement('canvas');tile.width=tile.height=128;
 const tileCtx=tile.getContext('2d');
 for(let row=0;row<2;row++)for(let col=0;col<2;col++){
  tileCtx.save();tileCtx.translate(col?128:0,row?128:0);tileCtx.scale(col?-1:1,row?-1:1);
  tileCtx.drawImage(start,30,877,64,64,0,0,64,64);tileCtx.restore();
 }
 const pattern=base.createPattern(tile,'repeat');
 let w=0,h=0,dpr=1,progress=0,playing=false,resumeOnShow=false;
 function art(){
  const height=w*H/W;
  return {x:0,y:w/h<1.2?h*.18:Math.min(0,(h-height)*.4),w,h:height};
 }
 function render(p=progress){
  progress=p;if(!w||!h)return;
  const a=art(),src=p>=1&&film.ended&&film.readyState>=2?film:start;
  base.setTransform(dpr,0,0,dpr,0,0);base.fillStyle='#eee9dd';base.fillRect(0,0,w,h);
  if(a.y>0)base.drawImage(start,25,270,300,180,0,0,w,a.y+1);
  if(a.y+a.h<h){base.save();base.translate(0,a.y+a.h-1);base.scale(a.w/W,a.h/H);base.fillStyle=pattern;base.fillRect(0,0,w*W/a.w,(h-a.y-a.h+1)*H/a.h);base.restore();}
  base.drawImage(src,a.x,a.y,a.w,a.h);
 }
 function resize(){
  w=baseCanvas.clientWidth;h=baseCanvas.clientHeight;dpr=Math.min(devicePixelRatio||1,2);
  baseCanvas.width=Math.round(w*dpr);baseCanvas.height=Math.round(h*dpr);
  base.imageSmoothingQuality='high';const a=art();
  Object.assign(film.style,{left:a.x+'px',top:a.y+'px',width:a.w+'px',height:a.h+'px'});
  render(progress);
 }
 function play(){
  return new Promise((resolve,reject)=>{
   playing=true;let closed=false;
   const done=(event)=>{if(closed)return;closed=true;playing=false;resumeOnShow=false;
    film.removeEventListener('ended',done);film.removeEventListener('error',done);
    film.removeEventListener('playing',show);
    if(event?.type==='ended'){film.pause();film.classList.add('show-film');render(1);resolve();}
    else{film.classList.remove('show-film');reject(film.error||new Error('Playback unavailable'));}
   };
   const show=()=>{if(!closed)film.classList.add('show-film');};
   film.addEventListener('ended',done);film.addEventListener('error',done);
   film.addEventListener('playing',show);
   if(film.error){done();return;}
   film.play().catch(error=>{if(error.name==='AbortError'&&resumeOnShow)return;done();});
  });
 }
 function visibility(){
  if(!playing)return;
  if(document.hidden){resumeOnShow=true;film.pause();}
  else if(resumeOnShow){resumeOnShow=false;film.play().catch(()=>film.dispatchEvent(new Event('error')));}
 }
 document.addEventListener('visibilitychange',visibility);
 function mugBounds(){const a=art();return{left:a.x+350/W*a.w,top:a.y+455/H*a.h,width:445/W*a.w,height:355/H*a.h};}
 resize();return {render,resize,mugBounds,play};
}



const stage=document.querySelector('#coffee-stage');
const baseCanvas=document.querySelector('#scene-canvas');
const mug=document.querySelector('#mug-trigger');
const status=document.querySelector('#phase-status');
const main=document.querySelector('#main-preview');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let scene=null,phase='loading',progress=0,queued=false,mainReady=false,completedAt=0;
let pendingEntry=false,loadDeadline=0;

function setPhase(value){phase=value;document.body.dataset.phase=value;}
function positionMug(){
 if(!scene)return;
 const {left,top,width,height}=scene.mugBounds();
 Object.assign(mug.style,{left:left+'px',top:top+'px',width:width+'px',height:height+'px'});
}
function resize(){if(!scene)return;scene.resize();scene.render(progress);positionMug();}
function prepareMain(){
 try{
  const doc=main.contentDocument;
  const url=new URL(main.contentWindow.location.href);
  if(!doc||doc.readyState==='loading'||url.origin!==location.origin||!url.pathname.endsWith('/showroom.html'))return;
  mainReady=true;
  // Home returns to the top-level landing instead of nesting a new entrance.
  for(const link of doc.querySelectorAll('a[href]')){
   const target=new URL(link.getAttribute('href'),main.contentWindow.location.href);
   if(target.origin===location.origin&&(/\/index\.html$/.test(target.pathname)||target.pathname==='/'))link.target='_top';
  }
 }catch{mainReady=false;}
}
main.addEventListener('load',()=>{
 prepareMain();
 if(pendingEntry&&mainReady)revealMain();
});
prepareMain();
function revealMain(){
 if(phase==='entering'||phase==='entered')return;
 // Local files have opaque origins: navigate after playback instead of accessing the iframe.
 if(location.protocol==='file:'){location.replace('showroom.html'+location.hash);return;}
 // A slow portrait or hidden iframe must not consume the visitor's second click.
 if(!mainReady)prepareMain();
 if(!mainReady){
  if(!pendingEntry){
   pendingEntry=true;
   loadDeadline=setTimeout(()=>{
    if(!pendingEntry)return;
    prepareMain();
    if(mainReady)revealMain();else location.replace('showroom.html');
   },3500);
  }
  return;
 }
 clearTimeout(loadDeadline);pendingEntry=false;
 // The video ends directly on the already prepared main document.
 stage.inert=true;status.textContent='';setPhase('entered');stage.hidden=true;
 main.inert=false;main.removeAttribute('aria-hidden');main.removeAttribute('tabindex');
 history.replaceState(null,'','showroom.html');
 try{
  const inner=main.contentDocument;document.title=inner.title;
  document.querySelector('meta[name="theme-color"]').content=inner.querySelector('meta[name="theme-color"]').content;
  main.contentWindow.dispatchEvent(new main.contentWindow.Event('stcop:showroom-visible'));
  main.contentWindow.focus();
 }catch{}
}

function finishSpill(){
 progress=1;scene.render(1);setPhase('complete');status.textContent='';revealMain();
}
function spill(){
 if(phase==='loading'){queued=true;return;}
 if(phase!=='ready')return;
 mug.hidden=true;setPhase('spilling');status.textContent='';
 if(scene.play){scene.play().then(finishSpill,revealMain);return;}
 finishSpill();
}
mug.addEventListener('click',spill);
window.addEventListener('click',()=>{
 if(phase==='complete'&&performance.now()-completedAt>180)revealMain();
});
window.addEventListener('keydown',event=>{
 if(event.key!=='Enter'||event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
 if(!['ready','loading','complete'].includes(phase))return;
 if(event.target.closest?.('input,textarea,select,[contenteditable=true]'))return;
 event.preventDefault();
 if(phase==='complete'){if(performance.now()-completedAt>180)revealMain();}
 else spill();
});
window.addEventListener('resize',resize,{passive:true});
window.visualViewport?.addEventListener('resize',resize,{passive:true});
if(['#profile','#work','#archive','#guestbook','#contact'].includes(location.hash))location.replace('showroom.html'+location.hash);
try{
 scene=await createCoffeeScene({baseCanvas});
 if(scene.ready)await scene.ready;
 resize();stage.classList.add('is-canvas-ready');setPhase('ready');mug.removeAttribute('aria-disabled');
 if(queued)spill();
}catch(error){
 // Keep the supplied photo as the fallback and allow the entrance to finish.
 setPhase('ready');mug.removeAttribute('aria-disabled');
 Object.assign(mug.style,{left:'21%',top:'48%',width:'29%',height:'38%'});
 scene={render(){},resize(){},mugBounds(){return mug.getBoundingClientRect();}};
 if(queued)spill();
 console.error('Coffee scene could not load',error);
}

})();
