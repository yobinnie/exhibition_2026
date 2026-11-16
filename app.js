'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const el=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e};
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const siteHeader=$('.site-header'),menuToggle=$('.menu-toggle'),menuBackdrop=$('.menu-backdrop'),dialog=$('#project-dialog');

let opener=null,headerFrame=0,menuOpen=false;
function syncHeaderHeight(){cancelAnimationFrame(headerFrame);headerFrame=requestAnimationFrame(()=>document.documentElement.style.setProperty('--header-height',Math.ceil(siteHeader.getBoundingClientRect().height)+'px'))}
new ResizeObserver(syncHeaderHeight).observe(siteHeader);window.addEventListener('resize',syncHeaderHeight,{passive:true});window.visualViewport?.addEventListener('resize',syncHeaderHeight,{passive:true});document.fonts?.ready.then(syncHeaderHeight);syncHeaderHeight();
function setMenuOpen(open,restoreFocus=false){menuOpen=open;siteHeader.classList.toggle('menu-open',open);menuBackdrop.classList.toggle('visible',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');document.body.style.overflow=open||dialog.open?'hidden':'';if(restoreFocus)menuToggle.focus()}
menuToggle.addEventListener('click',()=>setMenuOpen(!menuOpen));menuBackdrop.addEventListener('click',()=>setMenuOpen(false,true));siteHeader.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenuOpen(false)));siteHeader.addEventListener('focusout',e=>{if(menuOpen&&e.relatedTarget&&!siteHeader.contains(e.relatedTarget))setMenuOpen(false)});matchMedia('(max-width:640px)').addEventListener('change',()=>setMenuOpen(false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen)setMenuOpen(false,true)});
try{history.scrollRestoration='manual'}catch{}
$$('[data-reset-home]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.replaceState(null,'',location.pathname+location.search);window.scrollTo({top:0,behavior:'instant'});location.reload()}));
function openDialog(content,trigger){dialog.classList.toggle('is-project-detail',content.classList.contains('project-dialog-body'));opener=trigger;$('#dialog-content').replaceChildren(content);setMenuOpen(false);const title=content.querySelector('h2');if(title){title.tabIndex=-1;title.setAttribute('autofocus','')}dialog.showModal();document.body.style.overflow='hidden';dialog.scrollTop=0;title?.focus({preventScroll:true})}
$('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.style.overflow=menuOpen?'hidden':'';opener?.focus()});
// ALL follows the editorial sequence; categories filter without reordering it.
const projects=[
 {id:'squareline',name:'Squareline Website',started:'2026.10',koreanTitle:'스퀘어라인 웹사이트 리디자인',category:'web',categoryLabel:'WEB',visual:'squareline-image',cover:'assets/squareline-cover.png',coverAlt:'Squareline 웹 리디자인 표지',url:'https://yobinnie.github.io/squareline_shop_01/',description:["스퀘어라인 제품 실루엣과 브랜드가 추구하는 무드가 먼저 눈에 들어오도록\n공식 쇼핑몰을 리디자인했습니다.\n설명은 간결하게 줄이고, 상품 사진에 커서를 올리면\n모델 착용 컷으로 전환되는 인터렉션으로\n가방 실착용 시의 크기와 스타일을 쉽게 볼 수 있도록 했습니다.", "스퀘어라인의 모든 가방을 실제로 탐색할 수 있으며,\n[Compare] 기능을 추가하여 고민이 되는 가방 두 가지의 사이즈, 가격, 디자인을 두고 비교할 수 있도록\n소비자의 고민하는 과정을 도울 수 있도록 제작하였습니다.", "[SIZE LAB]에서는 휴대폰이나 노트북처럼\n매일 들고 다니는 물건과 가방의 크기를\n기기의 기종 별로 비교하며 개인의 일상에 맞는 제품을 택할 수 있습니다."],supportImages:[{"src": "assets/squareline-full-screen-v2.png", "alt": "스퀘어라인 웹사이트 전체 화면", "width": 634, "height": 2048}]},
 {id:'petit-jours',name:'Petit Jour',detailImage:{src:'assets/petit-jour-screen-v1.png',alt:'Petit Jour 플래너 할 일 화면',width:1895,height:906},started:'2026.09',koreanTitle:'종합 플래너 프로그램',category:'web',categoryLabel:'WEB',visual:'petit-image',cover:'assets/petit-jours-cover.png',coverAlt:'Petit Jour 플래너 표지',url:'https://yobinnie.github.io/Petit_jour_planner_04/',description:["Petit Jour는 오늘 할 일 하나를 적는 데서 시작하는 플래너입니다. 체크리스트와 시간표, 월별 일정을 한곳에 모았습니다. 책상에서는 PC 웹으로 쓰고 밖에서는 휴대폰 앱으로 열어보는 모습을 생각하며 기획했습니다.", "표지의 글씨를 가까이서 보면 작은 십자수가 이어집니다. 이름을 한 땀씩 수놓은 듯 적고 가장자리를 흰 레이스로 둘러서 손으로 꾸민 다이어리를 펼치는 느낌을 담고 싶었습니다."]},
 {id:'kyobo',name:'Gwanghwamun Poetry Board',started:'2026.07',koreanTitle:'2026 광화문글판 대학생 디자인 공모전',category:'graphic',categoryLabel:'GRAPHIC',visual:'kyobo-image',cover:'assets/kyobo-original.png',coverAlt:'노을빛 바다와 종이배로 표현한 미지의 페이지 표지',artwork:'assets/kyobo-original.png',artworkAlt:'교보문고 광화문글판 미지의 페이지 원본',description:["26.07.01 - 07.31 동안 개최되었던 교보생명 광화문글판 대학생 디자인 공모전 응모작입니다.\n'기업 전광판'이라는 큰 규격의 가로형 배너를 가을을 컨셉으로 디자인하는 과정에서\n배치와 색감을 고민하고 자료를 탐색하는 좋은 경험이었습니다.\n당선작들이 발표되고 나서 저의 작품과 비교해보고\n조금 미흡한 타이포그래피 표현 능력을 스스로 알 수 있었고,\n타협하거나 혹은 더 추진했어야 할 부분을 알아갈 수 있었습니다.", "주제를 은유적이면서도 메타포가 드러나게 표현하기 위해\n문안을 곱씹고 또 곱씹다보니 디자인과 진로에 대해 고민하던\n저 스스로도 깊이 생각하고 문안으로부터 위로를 받았습니다.", "비록 당선 되지는 못하였지만, 나아가야 할 방향과 원하는 것을 알아가고\n미래에 대한 막연한 걱정과 불안함이\n'가보지 않은 곳은 정말 어떻게 될 지 모른다' 라는\n희망적인 불안함(?)으로 바뀐, 감사하고 좋은 기억으로 남아 있습니다.\n\nAdobe Illustrator로 타이포그래피와 배경 그래픽을 구성했습니다."]},
 {id:'numbuzin',name:'Numbuzin No.3',started:'2026.06',koreanTitle:'넘버즈인 3번 참은만큼 보들보들 결세럼팩 상세페이지',category:'detail',categoryLabel:'DETAIL PAGE',visual:'numbuzin-image',cover:'assets/numbuzin-product-cover-v2.png',coverAlt:'옅은 핑크 배경 위 넘버즈인 3번 결세럼팩 제품 표지',detailCover:'assets/numbuzin-cover.png',detailCoverAlt:'넘버즈인 결세럼팩 상세페이지 디자인 목업',seamlessPages:true,pages:[{src:'assets/numbuzin-detail-pdf-v3-01.webp',width:1720,height:3300,alt:'넘버즈인 3번 결세럼팩 상세페이지 1'},{src:'assets/numbuzin-detail-pdf-v3-02.webp',width:1720,height:3300,alt:'넘버즈인 3번 결세럼팩 상세페이지 2'},{src:'assets/numbuzin-detail-pdf-v3-03.webp',width:1720,height:3300,alt:'넘버즈인 3번 결세럼팩 상세페이지 3'},{src:'assets/numbuzin-detail-pdf-v3-04.webp',width:1720,height:3023,alt:'넘버즈인 3번 결세럼팩 상세페이지 4'}],description:["Adobe Illustrator로 제작한 넘버즈인 3번 결세럼팩 상세페이지입니다. 제품의 특징과 사용 과정을 소개합니다. 패키지의 분홍색과 숫자 3을 중심으로 화면을 잡고 투명한 방울과 시트가 늘어나는 모습을 함께 배치해 세럼의 질감이 느껴지도록 했습니다.", "제품명에서 생기는 궁금증을 왜 참아야 하는지에 대한 질문으로 연결했습니다. 앞부분에서 제품의 인상을 전달한 뒤 시트와 성분, 사용 전후 자료로 이어지도록 내용을 정리했습니다."]},
 {id:'holidays',name:'Holidays Biotin 10000',started:'2026.04',koreanTitle:'홀리데이즈 비오틴 10000 상세페이지',category:'detail',categoryLabel:'DETAIL PAGE',visual:'holidays-image',cover:'assets/holidays-cover-v1.png',coverAlt:'홀리데이즈 비오틴 10000 상세페이지 표지',seamlessPages:true,pages:[{src:'assets/holidays-detail-pdf-v3-01.webp',width:1720,height:3300,alt:'홀리데이즈 비오틴 10000 상세페이지 1'},{src:'assets/holidays-detail-pdf-v3-02.webp',width:1720,height:3300,alt:'홀리데이즈 비오틴 10000 상세페이지 2'},{src:'assets/holidays-detail-pdf-v3-03.webp',width:1720,height:3300,alt:'홀리데이즈 비오틴 10000 상세페이지 3'},{src:'assets/holidays-detail-pdf-v3-04.webp',width:1720,height:3300,alt:'홀리데이즈 비오틴 10000 상세페이지 4'},{src:'assets/holidays-detail-pdf-v3-05.webp',width:1720,height:3300,alt:'홀리데이즈 비오틴 10000 상세페이지 5'},{src:'assets/holidays-detail-pdf-v3-06.webp',width:1720,height:3300,alt:'홀리데이즈 비오틴 10000 상세페이지 6'},{src:'assets/holidays-detail-pdf-v3-07.webp',width:1720,height:1418,alt:'홀리데이즈 비오틴 10000 상세페이지 7'}],description:["Adobe Photoshop으로 홀리데이즈 비오틴 10000을 소개하는 상세페이지를 제작했습니다. 패키지의 주황색을 제목과 주요 수치에 반복해 긴 화면에서도 제품의 인상이 이어지도록 했습니다. 숫자와 설명의 크기를 나눠 먼저 읽어야 할 내용이 눈에 들어오게 정리했습니다.", "함량과 원료처럼 낯설 수 있는 내용은 그래프와 일러스트로 풀고 원료 이름 옆에는 국기를 함께 배치했습니다. 마지막에는 섭취 방법과 일상 속 사용 사진을 넣어 제품을 이해한 뒤 이용 방법까지 살펴볼 수 있도록 구성했습니다."]},
 {id:'dot-game-cat',name:'Dot Game Cat',started:'2026.01',koreanTitle:'도트 게임 고양이 일러스트레이션',category:'graphic',categoryLabel:'GRAPHIC',visual:'dot-cat-cover-image',cover:'assets/dot-game-cat.png',artwork:'assets/dot-game-cat.png',artworkAlt:'레트로 게임 고양이 일러스트레이션 원본',coverAlt:'레트로 게임 화면 속 도트 고양이',description:["Adobe Illustrator에서 앞발을 들고 자기 주먹을 자랑하는 고양이 ‘고영칠’을 도트로 그렸습니다. 대화창에는 고양이의 얼굴을 한 번 더 넣고 대답은 ‘예!’와 ‘예?’ 두 가지로 적었습니다. 같은 말도 고르는 쪽에 따라 다르게 들렸으면 했습니다.", "생선 가시와 털실은 아이템 칸에 넣고 하트는 날짜 옆에 두었습니다. 오래된 게임 화면을 들여다보는 기분이 들도록 푸른색과 자주색의 채도를 낮췄습니다. ‘일단 등교’는 해당 일러스트를 작업한 후 컨셉을 이어가며 제작한 미니게임입니다."],related:{label:'일단 등교 미니게임',url:'https://yobinnie.github.io/justgotocollege_game_03/'}},
 {id:'catgel-catvil',name:'Catgel & Catvil',started:'2025.12',category:'graphic',categoryLabel:'GRAPHIC',visual:'catgel-image',cover:'assets/catgel-catvil.png',coverAlt:'서로를 감싼 천사 고양이와 악마 고양이',description:["Adobe Illustrator로 천사와 악마를 고양이의 모습으로 풀어낸 일러스트레이션입니다. 두 마리가 서로에게 기대어 둥글게 말린 구도로 흰 털과 검은 털이 한 화면 안에서 이어지도록 그렸습니다.", "흰 고양이의 푸른 눈과 검은 고양이의 분홍 눈을 서로 다른 방향에 두고 털의 결을 따라 짧은 선을 쌓았습니다. 멀리서는 두 고양이의 대비가 보이고 가까이에서는 그 안의 촘촘한 질감이 드러나도록 표현했습니다."],exhibition:{src:'assets/catgel-catvil-exhibition.jpg',alt:'Catgel & Catvil 전시 현장'}},
 {id:'romand',name:'Rom&nd Website',started:'2025.08',koreanTitle:'롬앤 웹사이트 시안',category:'web',categoryLabel:'WEB',visual:'romand-image',cover:'assets/romand-cover-v2.png',coverAlt:'롬앤 웹사이트 디자인 표지',pages:[{src:'assets/romand-full.jpg',alt:'롬앤 웹사이트 전체 시안'}],description:["Adobe Photoshop으로 제작한 롬앤 웹사이트 시안입니다. 첫 화면을 반으로 나눠 한쪽에는 둥근 치크를 쌓아 올린 사진을 두고 다른 쪽에는 같은 제품을 든 모델을 놓았습니다. 제품만 놓인 사진 옆에서 모델의 볼까지 한눈에 보이도록 했습니다.", "컬렉션은 매트와 글로우처럼 서로 다른 느낌을 축으로 삼고 컬러칩이 분포된 사분면으로 표현했습니다. 아래의 룩북은 모델 사진을 크고 작게 펼쳐 놓아 색이 얼굴에서 어떻게 보이는지 살펴보게 했습니다."]}
].sort((a,b)=>b.started.localeCompare(a.started));
function visualMarkup(p){
 let body='';
 if(p.cover)body='<img class="project-cover" src="'+p.cover+'" alt="'+p.coverAlt+'" loading="lazy">';
 if(p.pending)body='<span class="pending-cover-type" aria-hidden="true">'+p.name+'</span><span class="pending-cover-label">IMAGE TO COME</span>';
 return body+(p.status?'<span class="slot-status">'+p.status+'</span>':'');
}
function projectTarget(link){link.target=matchMedia('(max-width:640px), (hover:none)').matches?'_top':'_blank';link.rel='noopener noreferrer';return link.target==='_blank'?' 새 탭에서 보기':' 보기'}
function projectLink(url,label,className='project-visit'){const link=el('a',className,label+' ↗');link.href=url;link.setAttribute('aria-label',label+projectTarget(link));return link}
function projectPreview(p,className=''){
 const destination=p.url||p.related?.url;
 const preview=el(destination?'a':'div','dialog-image work-image '+p.visual+' '+className);
 if(destination){preview.href=destination;preview.style.display='block';preview.setAttribute('aria-label',p.name+' — '+(p.url?'사이트':p.related.label)+projectTarget(preview))}
 const face=className==='project-main-cover'&&p.detailImage?{...p,cover:p.detailImage.src,coverAlt:p.detailImage.alt}:p.artwork?{...p,cover:p.artwork,coverAlt:p.artworkAlt}:p.detailCover?{...p,cover:p.detailCover,coverAlt:p.detailCoverAlt}:p;
 preview.innerHTML=visualMarkup(face);
 if(className==='project-main-cover'&&p.detailImage){const image=preview.querySelector('img');image.width=p.detailImage.width;image.height=p.detailImage.height;}
 if(p.category==='graphic')preview.classList.add('original-artwork');
 return preview;
}
function showProject(p,trigger){
 const graphic=p.category==='graphic';
 const content=el('div','project-dialog-body detail-layout'+(graphic?' is-graphic':''));content.dataset.project=p.id;
 const sidebar=el('aside','project-sidebar'),main=el('div','project-main');
 sidebar.setAttribute('aria-label','작품 기본 정보');main.setAttribute('aria-label','작품 상세 내용');main.tabIndex=0;
 sidebar.append(el('p','project-tags',p.categoryLabel+(p.id==='squareline'?' / REDESIGN':'')));
 const title=el('h2','project-detail-title');title.id='dialog-title';title.append(el('span','project-title-en',p.parentName||p.name));if(p.koreanTitle)title.append(el('span','project-title-divider','_'),el('span','project-title-ko',p.koreanTitle));sidebar.append(title,el('p','project-started','작업 시작 '+p.started));if(p.parentName)sidebar.append(el('p','project-subtitle',p.name));
 if(graphic)main.append(projectPreview(p,'project-artwork'));
 else{
  sidebar.append(projectPreview(p,'project-summary-cover'));
  if(!p.pages&&!p.supportImages?.length)main.append(projectPreview(p,'project-main-cover'));
 }
 // All projects share the same left-column sequence: action, then description.
 if(p.url||p.related){
  const actions=el('div','project-actions');
  if(p.url){const link=projectLink(p.url,'Visit website');link.setAttribute('aria-label',p.name+' 사이트'+(link.target==='_blank'?' 새 탭에서 보기':' 보기'));actions.append(link)}
  if(p.related)actions.append(projectLink(p.related.url,p.related.label,'related-project-link'));
  sidebar.append(actions);
 }
 if(p.description){
  const copy=el('div','project-copy');
  for(const paragraph of (Array.isArray(p.description)?p.description:[p.description]))copy.append(el('p','project-description',paragraph));
  sidebar.append(copy);
 }else if(!p.cover&&!p.pending)sidebar.append(el('p','slot-caption','작업물 준비 중'));
 if(p.supportImages?.length){
  const images=el('div','project-support-images project-visual-gallery');images.setAttribute('aria-label','웹사이트 설명 화면');
  for(const photo of p.supportImages){const link=el('a','project-support-link');link.href=photo.src;link.setAttribute('aria-label',photo.alt+' 원본'+projectTarget(link));const image=el('img','project-support-image');image.src=photo.src;image.alt=photo.alt;image.width=photo.width;image.height=photo.height;image.loading='lazy';image.decoding='async';link.append(image);images.append(link)}
  main.append(images);
 }
 if(p.pages){
  const pages=el('div','project-pages'+(p.seamlessPages?' project-pages-seamless':''));
  for(const page of p.pages){
   const image=el('img','project-page');image.src=page.src;image.alt=page.alt;image.loading='lazy';image.decoding='async';if(page.width){image.width=page.width;image.height=page.height}
   const full=el(p.seamlessPages?'div':'a','project-page-link');
   if(p.seamlessPages)full.style.width='100%';else{if(page.width)full.style.width=page.width+'px';full.href=page.src;full.setAttribute('aria-label',page.alt+' 원본'+projectTarget(full))}
   full.append(image);pages.append(full);
  }
  main.append(pages);
 }
 if(p.exhibition){const section=el('section','exhibition-section');const heading=el('h3','','Exhibition view');heading.id='exhibition-title';section.setAttribute('aria-labelledby',heading.id);const photo=el('img','exhibition-photo');photo.src=p.exhibition.src;photo.alt=p.exhibition.alt;photo.loading='lazy';section.append(heading,photo);main.append(section)}
 content.append(sidebar,main);openDialog(content,trigger);
}
function projectCard(p){
 const brand=p.category==='brand';const b=el('button','work-card project'+(brand?' brand-card':''));b.type='button';b.dataset.project=p.id;b.setAttribute('aria-label',p.name+' — 소개 보기');
 const face=p.galleryOriginal?{...p,cover:p.artwork||p.cover,coverAlt:p.artworkAlt||p.coverAlt}:p;
 b.innerHTML='<div class="print-frame"><div class="work-image '+p.visual+'">'+visualMarkup(face)+'</div></div>';
 if(p.id==='numbuzin'){
  const title=el('span','numbuzin-cover-type');title.setAttribute('aria-hidden','true');
  title.append(el('span','numbuzin-cover-brand','NUMBUZIN'),el('span','numbuzin-cover-number','NO.3'),el('span','numbuzin-cover-copy','참은만큼 보들보들\n결세럼팩'),el('span','numbuzin-cover-label','DETAIL PAGE DESIGN'));
  b.querySelector('.work-image').append(title);
 }
 const caption=el('div','work-caption');caption.append(el('h3','',p.name),el('span','project-open-mark','↗'));b.append(caption);if(!brand){const meta=el('div','project-card-meta');meta.append(el('span','project-category',p.categoryLabel));const time=el('time','project-date',p.started);time.dateTime=p.started.replace('.','-');meta.append(time);b.append(meta)}b.addEventListener('click',()=>showProject(p,b));return b;
}
const cupPrints={
 'squareline':['squareline','website'], 'petit-jours':['petit jour'], 'romand':['rom&nd','website'],
 'numbuzin':['numbuzin','no.3'], 'holidays':['holidays','biotin 10000'],
 'kyobo':['gwanghwamun','poetry board'], 'dot-game-cat':['dot game cat'], 'catgel-catvil':['catgel &','catvil']
};
// Freeze the four approved photographic retouches. Only the other four use
// straight native lettering over a text-free interior ceramic patch.
const approvedCupPrints={'romand':.982143,'numbuzin':1.00905,'holidays':.990654,'catgel-catvil':.990868};
const straightCupPrints={
 'squareline':{angle:-36,x:900,y:520,gain:.990566},
 'petit-jours':{angle:100,x:580,y:520,gain:.991189},
 'kyobo':{angle:75,x:465,y:500,gain:.975248},
 'dot-game-cat':{angle:-58,x:850,y:545,gain:.967290}
};
function straightSpillPrint(id){
 const ns='http://www.w3.org/2000/svg',spec=straightCupPrints[id];
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1536 1024');svg.classList.add('cup-spill-lettering');svg.setAttribute('aria-hidden','true');
 const group=document.createElementNS(ns,'g');group.setAttribute('transform','translate('+spec.x+' '+spec.y+') rotate('+spec.angle+')');
 const lines=cupPrints[id];
 lines.forEach((line,i)=>{const text=document.createElementNS(ns,'text');text.setAttribute('x','0');text.setAttribute('y',String(lines.length===1?0:(i-.5)*71.28576));text.setAttribute('text-anchor','middle');text.setAttribute('dominant-baseline','central');text.textContent=line;group.append(text)});
 svg.append(group);return svg;
}
// Self-contained masks work when index.html is opened as a local file.
const cupRetouchMasks={"catgel-catvil":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1536\" height=\"1024\" viewBox=\"0 0 1536 1024\"><defs><filter id=\"soft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feMorphology operator=\"erode\" radius=\"7\"/><feGaussianBlur stdDeviation=\"3\"/></filter><clipPath id=\"inside\"><path d=\"M500 367L793 515L784 603L671 632L489 531L492 397Z\"/></clipPath></defs><g clip-path=\"url(#inside)\"><path d=\"M500 367L793 515L784 603L671 632L489 531L492 397Z\" fill=\"white\" filter=\"url(#soft)\"/></g></svg>","dot-game-cat":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1536\" height=\"1024\" viewBox=\"0 0 1536 1024\"><defs><filter id=\"soft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feMorphology operator=\"erode\" radius=\"7\"/><feGaussianBlur stdDeviation=\"3\"/></filter><clipPath id=\"inside\"><path d=\"M652 659L935 334L1032 419L750 744Z\"/></clipPath></defs><g clip-path=\"url(#inside)\"><path d=\"M652 659L935 334L1032 419L750 744Z\" fill=\"white\" filter=\"url(#soft)\"/></g></svg>","holidays":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1536\" height=\"1024\" viewBox=\"0 0 1536 1024\"><defs><filter id=\"soft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feMorphology operator=\"erode\" radius=\"7\"/><feGaussianBlur stdDeviation=\"3\"/></filter><clipPath id=\"inside\"><path d=\"M530 500L976 347L1043 542L598 695Z\"/></clipPath></defs><g clip-path=\"url(#inside)\"><path d=\"M530 500L976 347L1043 542L598 695Z\" fill=\"white\" filter=\"url(#soft)\"/></g></svg>","kyobo":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1536\" height=\"1024\" viewBox=\"0 0 1536 1024\"><defs><filter id=\"soft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feMorphology operator=\"erode\" radius=\"7\"/><feGaussianBlur stdDeviation=\"3\"/></filter><clipPath id=\"inside\"><path d=\"M247 345L539 345L653 370L669 630L647 655L244 655Z\"/></clipPath></defs><g clip-path=\"url(#inside)\"><path d=\"M247 345L539 345L653 370L669 630L647 655L244 655Z\" fill=\"white\" filter=\"url(#soft)\"/></g></svg>","numbuzin":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1536\" height=\"1024\" viewBox=\"0 0 1536 1024\"><defs><filter id=\"soft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feMorphology operator=\"erode\" radius=\"7\"/><feGaussianBlur stdDeviation=\"3\"/></filter><clipPath id=\"inside\"><path d=\"M408 366L865 463L846 660L382 562Z\"/></clipPath></defs><g clip-path=\"url(#inside)\"><path d=\"M408 366L865 463L846 660L382 562Z\" fill=\"white\" filter=\"url(#soft)\"/></g></svg>","petit-jours":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1536\" height=\"1024\" viewBox=\"0 0 1536 1024\"><defs><filter id=\"soft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feMorphology operator=\"erode\" radius=\"7\"/><feGaussianBlur stdDeviation=\"3\"/></filter><clipPath id=\"inside\"><path d=\"M499 331L660 331L674 692L492 711Z\"/></clipPath></defs><g clip-path=\"url(#inside)\"><path d=\"M499 331L660 331L674 692L492 711Z\" fill=\"white\" filter=\"url(#soft)\"/></g></svg>","romand":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1536\" height=\"1024\" viewBox=\"0 0 1536 1024\"><defs><filter id=\"soft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feMorphology operator=\"erode\" radius=\"7\"/><feGaussianBlur stdDeviation=\"3\"/></filter><clipPath id=\"inside\"><path d=\"M694 382L862 406L816 704L648 680Z\"/></clipPath></defs><g clip-path=\"url(#inside)\"><path d=\"M694 382L862 406L816 704L648 680Z\" fill=\"white\" filter=\"url(#soft)\"/></g></svg>","squareline":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1536\" height=\"1024\" viewBox=\"0 0 1536 1024\"><defs><filter id=\"soft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feMorphology operator=\"erode\" radius=\"7\"/><feGaussianBlur stdDeviation=\"3\"/></filter><clipPath id=\"inside\"><path d=\"M727 540L992 366L1080 367L1080 536L871 669L741 660Z\"/></clipPath></defs><g clip-path=\"url(#inside)\"><path d=\"M727 540L992 366L1080 367L1080 536L871 669L741 660Z\" fill=\"white\" filter=\"url(#soft)\"/></g></svg>"};
function decodedImage(image){
 if(typeof image.decode==='function')return image.decode();
 if(image.complete)return image.naturalWidth>0?Promise.resolve():Promise.reject(new Error('Image unavailable'));
 return new Promise((resolve,reject)=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',reject,{once:true})});
}
const cupHoverMedia=matchMedia('(hover:hover) and (pointer:fine)');
function activateCup(button){
 const gallery=$('#project-gallery'),previous=gallery.querySelector('.cup-project.is-active');
 if(previous===button)return;
 if(previous)previous.classList.remove('is-active');
 if(button)button.classList.add('is-active');
 gallery.classList.toggle('has-active-cup',Boolean(button));
}
function cupCard(p){
 const button=el('button','cup-project cup-'+p.id);button.type='button';button.dataset.project=p.id;
 button.setAttribute('aria-label',p.name+' — 소개 보기');button.title=p.name;
 const upright=el('span','cup-upright');
 const image=el('img','project-cup');image.src='assets/cups/cup-master-blank.png';image.alt='';image.setAttribute('aria-hidden','true');image.width=1536;image.height=1024;image.draggable=false;image.loading=p.category==='web'?'eager':'lazy';
 const print=el('span','cup-print');print.setAttribute('aria-hidden','true');
 for(const line of cupPrints[p.id])print.append(el('span','',line));
 upright.append(image,print);
 const spill=el('span','cup-spill');spill.setAttribute('aria-hidden','true');
 const base=el('img','cup-spill-base');base.src='assets/cups/spills/'+p.id+'-spill.png';base.alt='';base.width=1536;base.height=1024;base.draggable=false;base.decoding='async';base.loading='eager';base.fetchPriority='low';spill.append(base);
 const ready=()=>{if(base.naturalWidth>0)button.classList.add('spill-ready')};
 if(typeof base.decode==='function')base.decode().then(ready).catch(()=>{});else base.addEventListener('load',ready,{once:true});
 const patch=el('img','cup-print-retouch');patch.alt='';patch.width=1536;patch.height=1024;patch.draggable=false;patch.decoding='async';patch.fetchPriority='low';
 const approved=approvedCupPrints[p.id],maskSource="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(cupRetouchMasks[p.id]),mask="url('"+maskSource+"')";
 patch.src=approved?'assets/cups/spills-print-v2/'+p.id+'-spill.png':'assets/cups/spills-blank-v3/'+p.id+'.png';
 patch.style.maskImage=mask;patch.style.webkitMaskImage=mask;
 patch.style.filter="url('#cup-print-opaque') brightness("+(approved||straightCupPrints[p.id].gain)+')';spill.append(patch);
 const lettering=straightCupPrints[p.id]?straightSpillPrint(p.id):null;if(lettering)spill.append(lettering);
 const reveal=()=>{if(patch.naturalWidth>0){patch.classList.add('is-ready');lettering?.classList.add('is-ready')}};
 // Never show replacement type unless both the ceramic patch and its mask decode.
 const maskImage=new Image();maskImage.src=maskSource;
 Promise.all([decodedImage(patch),decodedImage(maskImage)]).then(reveal).catch(()=>{});
 const point=event=>{if(event.pointerType==='mouse'&&cupHoverMedia.matches)activateCup(button)};
 button.addEventListener('pointerenter',point);button.addEventListener('pointermove',point,{passive:true});
 button.addEventListener('pointerleave',()=>{if(button.classList.contains('is-active'))activateCup(null)});
 button.addEventListener('focus',()=>{if(button.matches(':focus-visible'))activateCup(button)});
 button.addEventListener('blur',()=>{if(button.classList.contains('is-active'))activateCup(null)});
 button.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse')activateCup(null)});
 button.append(upright,spill);button.addEventListener('click',()=>{activateCup(null);showProject(p,button)});return button;
}
function renderProjects(filter='all'){
 const gallery=$('#project-gallery');activateCup(null);gallery.classList.toggle('is-cup-gallery',filter==='all');gallery.classList.toggle('is-filtered',filter!=='all');gallery.classList.toggle('is-graphic-gallery',filter==='graphic');
 if(filter==='all'){
  const rows=[['web',['squareline','petit-jours','romand']],['detail',['numbuzin','holidays']],['graphic',['kyobo','dot-game-cat','catgel-catvil']]];
  gallery.replaceChildren(...rows.map(([category,ids])=>{const row=el('div','cup-row cup-row-'+category);row.setAttribute('role','group');row.setAttribute('aria-label',category==='web'?'웹 디자인':category==='detail'?'상세페이지 디자인':'그래픽 디자인');const label=el('span','cup-row-label',category==='web'?'[ WEB ]':category==='detail'?'[ DETAIL PAGE ]':'[ GRAPHIC ]');row.append(label);row.append(...ids.map(id=>cupCard(projects.find(p=>p.id===id))));return row}));
 }else if(filter==='graphic'){
  gallery.replaceChildren(...['catgel-catvil','dot-game-cat','kyobo'].map(id=>projectCard({...projects.find(p=>p.id===id),galleryOriginal:true})));
 }else{
  const selected=projects.filter(p=>p.category===filter);gallery.replaceChildren(...selected.map(projectCard));
 }
 gallery.hidden=false;
}
renderProjects();$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});renderProjects(b.dataset.filter);$('#work').scrollIntoView({behavior:'instant',block:'start'})}));
const tabs=$$('[role=tab]');function chooseTab(button){tabs.forEach(t=>{const active=t===button;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;const panel=document.getElementById(t.getAttribute('aria-controls'));panel.inert=!active;if(active)panel.removeAttribute('aria-hidden');else panel.setAttribute('aria-hidden','true')})}tabs.forEach((b,i)=>{b.addEventListener('click',()=>chooseTab(b));b.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;chooseTab(tabs[n]);tabs[n].focus()}})});
// Notes stay in this browser; the original storage key is retained for existing entries.
const storageKey='spark-on-me-notes-v1';let notes=[];
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))notes=saved.filter(n=>n&&typeof n.name==='string'&&typeof n.text==='string').slice(0,50).map((n,i)=>({id:typeof n.id==='string'?n.id:'existing-'+i,name:n.name.slice(0,10),text:n.text.slice(0,500),date:typeof n.date==='string'?n.date:'',tone:'ivory'}))}catch{}
function saveNotes(){try{localStorage.setItem(storageKey,JSON.stringify(notes));return true}catch{return false}}
function startNote(){document.getElementById('guestbook-form').scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'center'});$('#nickname').focus({preventScroll:true})}
function showNote(note,trigger){const sheet=el('div','note-detail tone-ivory');const title=el('h2','','From '+note.name+'.');title.id='dialog-title';const message=el('p','note-message',note.text);const meta=el('div','note-meta');meta.append(el('time','',note.date));const remove=el('button','delete-note','메모 삭제');remove.type='button';remove.addEventListener('click',()=>{notes=notes.filter(n=>n.id!==note.id);saveNotes();renderNotes();dialog.close()});meta.append(remove);sheet.append(title,message,meta);openDialog(sheet,trigger)}
function paper(note,index){
 const b=el('button','note-paper tone-ivory'+(note?'':' empty'));b.type='button';
 b.style.setProperty('--paper-angle',[-23,34,-58,13,-32,56,-16,22,-45,8][index%10]+'deg');
 b.style.setProperty('--stain-image',"url('assets/stcop/coaster-wash-"+(index%3+1)+".svg')");
 b.style.setProperty('--stain-angle',[-22,35,103,-66,16,51,145,-107,75,-38][index%10]+'deg');
 b.setAttribute('aria-label',note?note.name+'님의 방명록 보기':'티코스터에 방명록 남기기');
 b.innerHTML='<span class="coaster-ring" aria-hidden="true"></span>';
 if(note){
  // Only real visitor writing is printed. The full message stays in its dialog.
  const glyphs=Array.from(note.text.replace(/\s+/gu,' ').trim());
  const excerpt=glyphs.slice(0,92);if(glyphs.length>92)excerpt.push('…');
  const middle=Math.ceil(excerpt.length*.53);
  const printing=el('span','coaster-print');printing.setAttribute('aria-hidden','true');
  printing.append(el('span','coaster-copy coaster-copy-top',excerpt.slice(0,middle).join('')),el('span','coaster-copy coaster-copy-bottom',excerpt.slice(middle).join('')),el('span','coaster-signature',note.name));
  b.append(printing);
 }else{const mark=el('span','coaster-add','+');mark.setAttribute('aria-hidden','true');b.append(mark)}
 b.addEventListener('click',()=>{if(note)showNote(note,b);else startNote()});return b;
}
function renderNotes(){
 const board=$('#note-board'),items=notes.slice();
 if(items.length<50)items.push(null);
 while(items.length<10)items.push(null);
 const clusters=[];
 for(let i=0;i<items.length;i+=10){
  const cluster=el('div','coaster-cluster');
  cluster.append(...items.slice(i,i+10).map((note,j)=>paper(note,i+j)));
  clusters.push(cluster);
 }
 board.replaceChildren(...clusters);
}
renderNotes();
// Desktop keeps its hover; small screens switch poses with an explicit tap.
const portrait=document.querySelector('.portrait-composition');
const sip=portrait.querySelector('.portrait-sip');
const sipReady=()=>{if(sip.naturalWidth>0)portrait.classList.add('sip-ready')};
if(typeof sip.decode==='function')sip.decode().then(sipReady).catch(()=>{});
else if(sip.complete)sipReady();else sip.addEventListener('load',sipReady,{once:true});
const mobilePortrait=matchMedia('(max-width:640px)');
function syncPortraitMode(){if(mobilePortrait.matches){portrait.setAttribute('role','button');portrait.tabIndex=0;portrait.setAttribute('aria-label','프로필 사진 바꾸기');portrait.setAttribute('aria-pressed',String(portrait.classList.contains('is-sipping')))}else{portrait.classList.remove('is-sipping');for(const attr of ['role','tabindex','aria-label','aria-pressed'])portrait.removeAttribute(attr)}}
function togglePortrait(){if(!mobilePortrait.matches||!portrait.classList.contains('sip-ready'))return;const sipping=portrait.classList.toggle('is-sipping');portrait.setAttribute('aria-pressed',String(sipping))}
portrait.addEventListener('click',togglePortrait);portrait.addEventListener('keydown',event=>{if(mobilePortrait.matches&&['Enter',' '].includes(event.key)){event.preventDefault();togglePortrait()}});mobilePortrait.addEventListener('change',syncPortraitMode);syncPortraitMode();
$('#guestbook-form').addEventListener('submit',e=>{e.preventDefault();const name=$('#nickname').value.trim(),text=$('#opinion').value.trim(),status=$('#form-status');if(!name||!text){status.textContent='이름과 메모를 입력해주세요.';return}const id=globalThis.crypto?.randomUUID?.()||Date.now()+'-'+Math.random().toString(16).slice(2);notes.unshift({id,name:name.slice(0,10),text:text.slice(0,500),date:new Date().toLocaleDateString('ko-KR'),tone:'ivory'});notes=notes.slice(0,50);const saved=saveNotes();renderNotes();e.target.reset();status.textContent=saved?'메모를 남겼어요. 고마워요!':'이 환경에서는 새로고침하면 메모가 사라질 수 있어요.';$('#guestbook').scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'start'})});
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('cyv050811@gmail.com');$('#copy-status').textContent='이메일을 복사했어요.'}catch{$('#copy-status').textContent='cyv050811@gmail.com'}});
let scrollFrame=0;function syncScroll(){scrollFrame=0;siteHeader.classList.toggle('is-scrolled',scrollY>8);let current='profile';['profile','work','archive','guestbook'].forEach(id=>{if(document.getElementById(id).getBoundingClientRect().top<innerHeight*.4)current=id});$$('nav a').forEach(a=>{const active=a.hash==='#'+current;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(syncScroll)},{passive:true});syncScroll();

