/* O Ponto — capa editorial fiel ao layout de referência, somente notícias publicadas. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const clean=s=>String(s||'');
const reading=p=>Math.max(1,Math.ceil(clean(p.body).replace(/<[^>]*>/g,' ').split(/\s+/).length/220));
const all=()=>typeof items==='function'?items():[];
function link(p){if(typeof showArticle==='function')showArticle(p.id)}
function create(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function boot(){const main=document.querySelector('main.container');if(!main)return;
const lead=$('lead'),news=main.querySelector('.news-section');if(!lead||!news)return;
const ticker=create('section','op-ticker');ticker.setAttribute('aria-label','Últimas notícias');ticker.innerHTML='<strong class="op-ticker-label">ϟ ÚLTIMAS NOTÍCIAS</strong><div id="opTickerItems" class="op-ticker-items"></div><a href="#heading">Ver todas →</a>';main.insertBefore(ticker,lead);
const categories=create('section','op-categories');categories.setAttribute('aria-label','Destaques por editoria');categories.innerHTML='<div class="op-category-grid" id="opCategoryGrid"></div><aside class="op-popular"><h2>▥ Mais lidas</h2><div id="opPopularList"></div></aside>';main.insertBefore(categories,news);
const nav=document.querySelector('.navinner');if(nav&&!nav.querySelector('[data-cat="O Ponto TV"]')){const tv=create('a','op-tv','▣ O Ponto TV');tv.href='#';tv.title='Seção de vídeos em preparação';tv.onclick=e=>{e.preventDefault();const el=document.querySelector('.op-tv');el.title='Conteúdo em vídeo ainda não publicado'};nav.append(tv)}
refresh();document.addEventListener('portalca:feed-ready',refresh);document.addEventListener('portalca:feed-error',refresh);
}
function refresh(){const data=all();const ticker=$('opTickerItems'),grid=$('opCategoryGrid'),popular=$('opPopularList');if(!ticker||!grid||!popular)return;
ticker.replaceChildren();for(const p of data.slice(0,2)){const a=create('button','op-ticker-story');a.type='button';a.append(create('span','op-ticker-dot','●'),create('span','',p.title));a.onclick=()=>link(p);ticker.append(a)}if(!data.length)ticker.append(create('span','op-empty','As próximas notícias aparecerão aqui.'));
grid.replaceChildren();const preferred=['Economia','Tecnologia','Cidades'];const used=new Set();const chosen=[];for(const c of preferred){const p=data.find(p=>{const n=clean(p.category).toLowerCase();return !used.has(p.id)&&(n===c.toLowerCase()||(c==='Cidades'&&n==='cidade'))});if(p){chosen.push(p);used.add(p.id)}}for(const p of data){if(chosen.length>=3)break;if(!used.has(p.id)){chosen.push(p);used.add(p.id)}}
for(const p of chosen){const card=create('article','op-category-card');const title=create('h2','',p.category||'Notícias');const a=create('button','op-category-link');a.type='button';const img=create('img');img.src=typeof photo==='function'?photo(p):p.image_url||'';img.alt='';img.loading='lazy';const h=create('h3','',p.title);a.append(img,h,create('span','op-readtime','◷ '+reading(p)+' min de leitura'));a.onclick=()=>link(p);card.append(title,a);grid.append(card)}
popular.replaceChildren();let counts={};try{counts=JSON.parse(localStorage.getItem('portalca-reads-v1')||'{}')}catch{}const ranked=[...data].sort((a,b)=>(counts[b.id]||0)-(counts[a.id]||0)).slice(0,3);for(const [i,p] of ranked.entries()){const b=create('button','op-popular-item');b.type='button';b.append(create('b','',String(i+1)),create('span','',p.title));b.onclick=()=>link(p);popular.append(b)}if(!ranked.length)popular.append(create('p','op-empty','Ainda não há notícias publicadas.'));
}
document.addEventListener('DOMContentLoaded',boot);
})();