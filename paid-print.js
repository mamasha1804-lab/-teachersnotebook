(function(){
  const originalPaymentsModal = paymentsModal;
  paymentsModal = function(){
    const html = originalPaymentsModal();
    const marker = '<div class="actions"><button class="btn lav" data-payment-add>＋ Добавить ребёнка</button>';
    const replacement = '<div class="actions"><button class="btn lav" data-payment-add>＋ Добавить ребёнка</button><button class="btn lav print-3d-btn" type="button" data-payment-print>🖨 Печать</button>';
    return html.replace(marker,replacement);
  };

  const originalStudentsModal = studentsModal;
  studentsModal = function(){
    const html = originalStudentsModal();
    const marker = '<div class="actions"><button class="btn lav" data-add-class>＋ Добавить класс</button><button class="btn pink" data-save-students>Сохранить</button></div>';
    const replacement = '<div class="actions"><button class="btn lav" data-add-class>＋ Добавить класс</button><button class="btn lav print-3d-btn" type="button" data-students-print>🖨 Печать</button><button class="btn pink" data-save-students>Сохранить</button></div>';
    return html.replace(marker,replacement);
  };

  const originalBind = bind;
  bind = function(){
    originalBind();

    const paymentPrintBtn = $('[data-payment-print]');
    if(paymentPrintBtn){
      paymentPrintBtn.onclick = function(){
        document.body.classList.add('payment-printing');
        window.print();
        setTimeout(()=>document.body.classList.remove('payment-printing'),500);
      };
    }

    const studentsPrintBtn = $('[data-students-print]');
    if(studentsPrintBtn){
      studentsPrintBtn.onclick = function(){
        document.body.classList.add('students-printing');
        window.print();
        setTimeout(()=>document.body.classList.remove('students-printing'),500);
      };
    }
  };

  window.addEventListener('afterprint',()=>{
    document.body.classList.remove('payment-printing');
    document.body.classList.remove('students-printing');
  });
})();
