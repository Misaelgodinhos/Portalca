/* O Ponto 5.0 — audiência agregada por reportagem. Sem IP, cookies de rastreamento ou identificação de leitores. */
(()=>{'use strict';
const valid=id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id||''));
async function api(path,options={}){if(!window.CA?.url||!CA.key)throw Error('Configuração indisponível');const token=sessionStorage.getItem('portal_ca_token');const headers={'apikey':CA.key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(options.headers||{})};const r=await fetch(CA.url+'/rest/v1/'+path,{...options,headers});if(!r.ok)throw Error('Erro de audiência ('+r.status+')');return r.status===204||options.method==='POST'?null:r.json()}
async function totals(){try{const rows=await api('op_article_view_totals?select=article_id,views&limit=1000');return Object.fromEntries(rows.map(r=>[r.article_id,Number(r.views)||0]))}catch(e){console.warn('O Ponto: métricas indisponíveis',e);return null}}
async function record(id){if(!valid(id))return;const key='oponto-view-'+id,day=new Date().toISOString().slice(0,10);try{if(localStorage.getItem(key)===day)return;await api('op_article_views',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({article_id:id})});localStorage.setItem(key,day)}catch(e){console.warn('O Ponto: não foi possível registrar a leitura',e)}}
window.opontoAnalytics={totals,record};
if(document.getElementById('article')){const id=new URLSearchParams(location.search).get('id');if(valid(id))document.addEventListener('DOMContentLoaded',()=>record(id))}
})();