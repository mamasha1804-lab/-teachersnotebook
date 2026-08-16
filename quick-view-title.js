(function(){
  function findTrackerHost(input){
    let node=input.parentElement;
    let best=null;
    for(let i=0;i<6 && node;i++,node=node.parentElement){
      const r=node.getBoundingClientRect();
      const text=(node.textContent||'').toLowerCase();
      if(r.width>320 && r.height>90 && (text.includes('файл') || text.includes('ok'))){best=node;}
    }
    return best;
  }

  function injectQuickViewTitle(){
    const inputs=[...document.querySelectorAll('input')];
    const input=inputs.find(el=>{
      const p=(el.getAttribute('placeholder')||'').toLowerCase();
      return p.includes('ссыл');
    });
    if(!input) return;

    const host=findTrackerHost(input);
    if(!host || host.querySelector(':scope > .quick-view-heading-injected')) return;

    host.classList.add('quick-view-tracker-host');
    const heading=document.createElement('div');
    heading.className='quick-view-heading-injected';
    heading.innerHTML='<div class="quick-view-title">Быстрый просмотр файлов</div><div class="quick-view-subtitle">Открой ссылку, PDF или файл прямо на экране</div>';
    host.prepend(heading);
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(injectQuickViewTitle));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',injectQuickViewTitle);
  setTimeout(injectQuickViewTitle,300);
  setTimeout(injectQuickViewTitle,1200);
})();
