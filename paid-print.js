(function(){
  const originalPaymentsModal = paymentsModal;
  paymentsModal = function(){
    const html = originalPaymentsModal();
    const marker = '<div class="actions"><button class="btn lav" data-payment-add>＋ Добавить ребёнка</button>';
    const replacement = '<div class="actions"><button class="btn lav" data-payment-add>＋ Добавить ребёнка</button><button class="btn lav payment-print-btn" type="button" data-payment-print>🖨 Печать</button>';
    return html.replace(marker,replacement);
  };

  const originalBind = bind;
  bind = function(){
    originalBind();
    const printBtn = $('[data-payment-print]');
    if(printBtn){
      printBtn.onclick = function(){
        document.body.classList.add('payment-printing');
        window.print();
        setTimeout(()=>document.body.classList.remove('payment-printing'),500);
      };
    }
  };

  window.addEventListener('afterprint',()=>document.body.classList.remove('payment-printing'));
})();
