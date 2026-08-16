// Today view: always tied to the real current calendar date + close button back to weekly schedule.
(function(){
  const previousBind = bind;

  todayView = function(){
    const now = currentDate();
    const lessons = state.schedule
      .filter(x => x.dow === now.getDay())
      .sort((a,b) => a.time.localeCompare(b.time));

    return `<div class="today-screen">
      <div class="dashboard-head today-head">
        <div>
          <h1 class="section-title">Сегодня</h1>
          <div class="title-underline"></div>
          <div class="today-calendar-date">${DOW[now.getDay()]}, ${fmtShort(now)}</div>
        </div>
        <div class="today-head-actions">
          <button class="add-lesson-3d" data-open="addLesson"><span class="plus-badge"></span>Добавить урок</button>
          <button class="today-close" type="button" data-today-close aria-label="Вернуться к таблице Моя неделя" title="Вернуться к таблице Моя неделя">×</button>
        </div>
      </div>

      <div class="today-view">
        <div class="today-list">
          <div class="today-date-card">
            <strong>${fmtTop(now)}</strong>
            <span>Расписание на текущий календарный день</span>
          </div>
          <div class="subtle today-sync-note">Данные берутся из «Моего расписания». Любые изменения уроков отображаются здесь автоматически.</div>
          ${lessons.length
            ? lessons.map(l=>`<div class="today-lesson">
                <div class="today-time">${esc(l.time)}</div>
                <div class="today-dot" style="background:${COLORS[l.color]}"></div>
                <div><div class="today-title">${esc(l.name)}</div><div class="today-group">${esc(l.group||'Без группы')}</div></div>
              </div>`).join('')
            : `<div class="today-empty">На ${fmtShort(now)} уроков нет. Если добавить урок на этот день в «Моём расписании», он сразу появится здесь.</div>`}
        </div>
        <div class="right-col">${ideasCard()}${planCard()}${paidTracker()}</div>
      </div>
    </div>`;
  };

  bind = function(){
    previousBind();
    const closeToday = $('[data-today-close]');
    if(closeToday){
      closeToday.onclick = () => {
        view = 'week';
        modal = null;
        render();
      };
    }
  };

  const style=document.createElement('style');
  style.textContent=`
    .today-head{align-items:flex-start!important}
    .today-calendar-date{margin-top:8px;font-size:14px;font-weight:800;color:#75657f}
    .today-head-actions{display:flex;align-items:center;gap:12px}
    .today-close{width:52px;height:52px;flex:0 0 52px;border:1px solid #dfd1e9;border-radius:18px;background:linear-gradient(180deg,#fff,#f4edf9);color:#5b456d;font-size:34px;line-height:1;font-weight:500;cursor:pointer;box-shadow:0 5px 0 #d2c0df,0 9px 18px rgba(68,43,86,.14),inset 0 1px 0 #fff;transition:transform .14s ease,box-shadow .14s ease}
    .today-close:hover{transform:translateY(-2px);box-shadow:0 7px 0 #d2c0df,0 12px 21px rgba(68,43,86,.16),inset 0 1px 0 #fff}
    .today-close:active{transform:translateY(4px);box-shadow:0 1px 0 #d2c0df,0 4px 8px rgba(68,43,86,.12)}
    .today-date-card{display:flex;flex-direction:column;gap:4px;margin:0 0 12px;padding:16px 18px;border:1px solid #e8dff0;border-radius:18px;background:linear-gradient(135deg,#fff,#faf6fd)}
    .today-date-card strong{font-family:Georgia,serif;font-size:22px;color:var(--ink)}
    .today-date-card span{font-size:12px;color:#817486}
    .today-sync-note{margin-bottom:14px}
    @media(max-width:720px){.today-head-actions{width:100%;justify-content:space-between}.today-head{gap:14px;flex-wrap:wrap}.today-close{width:48px;height:48px;flex-basis:48px}}
  `;
  document.head.appendChild(style);
  render();
})();
