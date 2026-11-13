/* O Ponto — carregamento das notícias publicadas do Supabase, sem exemplos fictícios. */
document.addEventListener("DOMContentLoaded",async()=>{
 try{
  const remote=await caPublished();
  if(!Array.isArray(remote))throw Error("Resposta inesperada");
  const ids=new Set(DEMOS.map(p=>String(p.id)));
  for(const p of remote){if(!ids.has(String(p.id))){DEMOS.push({...p,date:new Date(p.created_at).toLocaleDateString("pt-BR")});ids.add(String(p.id))}}
  DEMOS.sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));
  if(typeof render==="function")render();
  document.dispatchEvent(new Event("portalca:feed-ready"));
 }catch(e){console.warn("O Ponto: não foi possível carregar notícias publicadas",e);document.dispatchEvent(new Event("portalca:feed-error"))}
});