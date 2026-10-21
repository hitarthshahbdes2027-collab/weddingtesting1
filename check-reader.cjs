const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class Element{constructor(){this.style={};this.dataset={};this.children=[];this.clientWidth=390;this.clientHeight=780;this.disabled=false;}setAttribute(){} append(...e){this.children.push(...e)} addEventListener(){} showModal(){this.open=true}close(){this.open=false}}
const ids=new Map(),el=id=>{if(!ids.has(id))ids.set(id,new Element());return ids.get(id)};
let constructed=0;
class PageFlip{constructor(book,settings){constructed++;this.settings=settings;this.index=0;this.events={};}getSettings(){return this.settings}getCurrentPageIndex(){return this.index}getOrientation(){return this.settings.usePortrait?'portrait':'landscape'}on(k,f){this.events[k]=f}loadFromHTML(pages){this.pages=pages;this.events.init()}update(){this.events.flip()}turnToNextPage(){this.index=Math.min(8,this.index+(this.settings.usePortrait?1:2));this.events.flip()}turnToPrevPage(){this.index=Math.max(0,this.index-(this.settings.usePortrait?1:2));this.events.flip()}flipNext(){this.turnToNextPage()}flipPrev(){this.turnToPrevPage()}}
const ctx={console,window:{St:{PageFlip}},St:{PageFlip},document:{body:new Element(),getElementById:el,createElement:()=>new Element()},matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){},ResizeObserver:class{observe(){}}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('dist/app.js','utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
for(const [w,h] of [[320,500],[390,780],[626,795],[1440,850],[900,500],[800,1000]]){const d=run(`dimensions(${w},${h})`);assert(d.width*(d.spread?2:1)<=w);assert(d.height<=h);assert(Math.abs(d.width/d.height-1641/2328)<.004);}
assert.equal(el('count').textContent,'1 / 9');assert(el('prev').disabled);run('go(-1)');assert.equal(run('index'),0);
for(let i=0;i<12;i++)run('go(1)');assert.equal(run('index'),8);assert(el('next').disabled);
run('go(-1)');assert.equal(run('index'),7);run('turning=true;go(-1)');assert.equal(run('index'),7);run('turning=false');
el('viewport').clientWidth=1400;el('viewport').clientHeight=850;run('build()');assert.equal(constructed,1);assert.equal(run('index'),7);
run('flip.index=0;sync()');assert.equal(el('count').textContent,'1–2 / 9');run('go(1)');assert.equal(run('index'),2);
assert.equal(run('cards.length'),9);for(const file of run('cards.map(c=>c[0])'))assert(fs.existsSync('dist/assets/'+file+'.jpg'));
const html=fs.readFileSync('dist/index.html','utf8');assert(!html.includes('celebrations'));assert(!html.includes('envelope'));assert(fs.statSync('dist/vendor/page-flip.browser.js').size>10000);
console.log('Passed: 6 viewport sizes, nine assets, navigation boundaries, turn lock, spread count, resize without duplicate engines, cards-only markup.');
assert.equal(run('pageColours.length'),run('cards.length'));
for(let i=0;i<9;i++){run(`flip.index=${i};sync()`);assert.equal(ctx.document.body.style.backgroundColor,run(`pageColours[${i}]`));}
run('flip.index=4;sync();flip.index=3;sync()');assert.equal(ctx.document.body.style.backgroundColor,'#edc1d9');
const css=fs.readFileSync('dist/style.css','utf8');assert(css.includes('transition:background-color 850ms'));assert(css.includes('transition:none!important'));
console.log('Passed: all nine page colours, backward navigation colour and reduced-motion transition override.');
