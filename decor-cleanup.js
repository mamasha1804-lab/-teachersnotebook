(function(){
  function cleanupBrokenDecor(){
    document.querySelectorAll('.sparkle-btn img').forEach(function(img){
      var btn=img.closest('.sparkle-btn');
      function hide(){ if(btn) btn.style.display='none'; }
      if(!img.dataset.cleanupBound){
        img.dataset.cleanupBound='1';
        img.addEventListener('error',hide,{once:true});
      }
      if(img.complete && img.naturalWidth===0) hide();
    });
  }
  var observer=new MutationObserver(cleanupBrokenDecor);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',cleanupBrokenDecor);
  cleanupBrokenDecor();
})();
