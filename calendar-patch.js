// Full production calendars for 2026/2027 + dedicated print action.
(function(){
  const monthNames=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const weekNames=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const holidays={
    2026:new Set(['2026-01-01','2026-01-02','2026-01-05','2026-01-06','2026-01-07','2026-01-08','2026-01-09','2026-02-23','2026-03-09','2026-05-01','2026-05-11','2026-06-12','2026-11-04','2026-12-31']),
    2027:new Set(['2027-01-01','2027-01-04','2027-01-05','2027-01-06','2027-01-07','2027-01-08','2027-02-22','2027-02-23','2027-03-08','2027-05-03','2027-05-10','2027-06-14','2027-11-04','2027-11-05','2027-12-31'])
  };
  const shortDays={
    2026:new Set(['2026-04-30','2026-05-08','2026-06-11','2026-11-03']),
    2027:new Set(['2027-04-30','2027-06-11','2027-11-03'])
  };

  function isoDate(y,m,d){return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`}

  function monthCalendar(y,m){
    const first=new Date(y,m,1,12), days=new Date(y,m+1,0,12).getDate();
    const mondayIndex=(first.getDay()+6)%7;
    let cells='';
    for(let i=0;i<mondayIndex;i++)cells+='<span class="cal-day empty"></span>';
    for(let d=1;d<=days;d++){
      const dt=new Date(y,m,d,12), dow=dt.getDay(), key=isoDate(y,m,d);
      const weekend=dow===0||dow===6, holiday=holidays[y]?.has(key), short=shortDays[y]?.has(key);
      cells+=`<span class="cal-day ${(weekend||holiday)?'off':''} ${short?'short':''}">${d}${short?'<sup>*</sup>':''}</span>`;
    }
    return `<section class="cal-month"><h3>${monthNames[m]}</h3><div class="cal-week">${weekNames.map((x,i)=>`<span class="${i>4?'off':''}">${x}</span>`).join('')}</div><div class="cal-days">${cells}</div></section>`;
  }

  function calendarBody(y){
    return `<div class="calendar-print-area" data-calendar-year="${y}">
      <div class="calendar-print-title">ПРОИЗВОДСТВЕННЫЙ КАЛЕНДАРЬ НА ${y} ГОД</div>
      <div class="calendar-print-subtitle">для пятидневной рабочей недели${y===2027?' · ПРОЕКТ':''}</div>
      <div class="calendar-year-grid">${Array.from({length:12},(_,m)=>monthCalendar(y,m)).join('')}</div>
      <div class="calendar-legend"><span><b class="legend-red"></b> выходные и праздничные дни</span><span><b>*</b> предпраздничный день, рабочее время сокращается на 1 час</span></div>
    </div>`;
  }

  yearCalendar=function(y){
    return `<div class="calendar-year-modal">
      <div class="eyebrow">ПРОИЗВОДСТВЕННЫЙ КАЛЕНДАРЬ</div>
      <div class="calendar-year-toolbar">
        <div><h2>${y} год</h2><div class="subtle">Выходные, праздники и переносы для пятидневной рабочей недели${y===2027?' · проект':''}</div></div>
        <div class="calendar-year-actions">
          <button class="btn lav" data-year-back>← Другой год</button>
          <button class="btn pink calendar-print-btn" type="button" onclick="window.printSelectedCalendar(${y})">🖨 Печать</button>
        </div>
      </div>
      ${calendarBody(y)}
      <div class="calendar-bottom-actions"><button class="btn pink calendar-print-btn" type="button" onclick="window.printSelectedCalendar(${y})">🖨 Распечатать календарь ${y}</button></div>
    </div>`;
  };

  window.printSelectedCalendar=function(y){
    const source=document.querySelector(`.calendar-print-area[data-calendar-year="${y}"]`);
    if(!source)return;
    const w=window.open('','_blank','width=1400,height=900');
    if(!w){showToast?.('Разрешите всплывающие окна для печати');return;}
    w.document.open();
    w.document.write(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Календарь ${y}</title><style>
      @page{size:A4 landscape;margin:8mm}
      *{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#221437;background:#fff}
      .calendar-print-area{width:100%}.calendar-print-title{text-align:center;font-weight:900;font-size:20px;margin:0 0 3px}.calendar-print-subtitle{text-align:center;font-size:12px;margin-bottom:10px}
      .calendar-year-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px 10px}.cal-month{border:1px solid #cfc5d7;border-radius:7px;padding:5px;break-inside:avoid}.cal-month h3{text-align:center;margin:0 0 5px;font-size:12px}.cal-week,.cal-days{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;text-align:center}.cal-week span{font-size:7px;font-weight:800;padding:2px 0;border-bottom:1px solid #e6dfea}.cal-day{font-size:8px;padding:2px 0;min-height:13px}.cal-day.off,.cal-week .off{color:#e13e49;font-weight:800}.cal-day.empty{visibility:hidden}.cal-day sup{font-size:5px}.calendar-legend{display:flex;justify-content:center;gap:24px;font-size:8px;margin-top:8px}.legend-red{display:inline-block;width:8px;height:8px;border-radius:2px;background:#e13e49;margin-right:4px;vertical-align:-1px}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    </style></head><body>${source.outerHTML}<script>window.onload=()=>setTimeout(()=>window.print(),250);<\/script></body></html>`);
    w.document.close();
  };

  const style=document.createElement('style');
  style.textContent=`
    .modal.medium:has(.calendar-year-modal){width:min(1380px,94vw);max-width:1380px}
    .calendar-year-toolbar{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px}
    .calendar-year-toolbar h2{margin:0 0 4px}.calendar-year-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}
    .calendar-print-btn{min-width:150px}.calendar-print-area{border:1px solid #eee4ef;border-radius:22px;padding:18px;background:#fffdfb}
    .calendar-print-title{text-align:center;font-weight:900;font-size:20px;letter-spacing:.02em;color:#25143e}.calendar-print-subtitle{text-align:center;color:#74677e;font-size:12px;margin:4px 0 16px}
    .calendar-year-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.cal-month{border:1px solid #e6dbea;border-radius:15px;padding:10px;background:linear-gradient(180deg,#fff,#fdfafe);box-shadow:0 4px 12px rgba(66,39,88,.05)}
    .cal-month h3{text-align:center;font-family:Georgia,serif;font-size:17px;margin:0 0 8px;color:#2d1847}.cal-week,.cal-days{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center}.cal-week span{font-size:10px;font-weight:900;color:#695976;padding:3px 0;border-bottom:1px solid #eee5f1}.cal-day{font-size:11px;padding:5px 1px;border-radius:7px;min-height:26px;color:#342244}.cal-day.off,.cal-week .off{color:#e15463;font-weight:900;background:#fff2f3}.cal-day.short{box-shadow:inset 0 0 0 1px #edc574}.cal-day.empty{visibility:hidden}.cal-day sup{font-size:7px;color:#b47b21}.calendar-legend{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;margin-top:16px;color:#776a80;font-size:11px}.legend-red{display:inline-block;width:10px;height:10px;background:#e15463;border-radius:3px;margin-right:5px}.calendar-bottom-actions{display:flex;justify-content:center;margin-top:16px}
    @media(max-width:1050px){.calendar-year-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:760px){.calendar-year-toolbar{align-items:stretch;flex-direction:column}.calendar-year-actions{justify-content:flex-start}.calendar-year-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.calendar-print-area{padding:12px}}
    @media(max-width:480px){.calendar-year-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
  if(account)render();
})();
