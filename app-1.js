'use strict';
const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>[...e.querySelectorAll(s)];
const ACCOUNTS_KEY='etp_accounts_v2', SESSION_KEY='etp_session_v2', LEGACY_KEY='etp_v1';
const DOW=['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
const SHORT=['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'];
const COLORS={coral:'#f0b5c5',lilac:'#cdb5ed',mint:'#b9e4d4',yellow:'#f5dda0',blue:'#bcd8f5'};
const colorNames={coral:'Пастельно-розовый',lilac:'Сиреневый',mint:'Мятный',yellow:'Жёлтый',blue:'Голубой'};
const defaultSchedule=[
{id:'l1',dow:1,time:'08:00',name:'Present Perfect',group:'2Б',color:'coral'},
{id:'l2',dow:1,time:'11:00',name:'Speaking Club',group:'7A',color:'lilac'},
{id:'l3',dow:1,time:'13:00',name:'Vocabulary Check',group:'8B',color:'mint'},
{id:'l4',dow:2,time:'09:00',name:'Speaking Club',group:'7Б',color:'coral'},
{id:'l5',dow:2,time:'13:00',name:'Speaking Club',group:'8A',color:'coral'},
{id:'l6',dow:2,time:'15:00',name:'Speaking Club',group:'7A',color:'coral'},
{id:'l7',dow:3,time:'09:00',name:'Новый урок',group:'',color:'lilac'},
{id:'l8',dow:3,time:'11:00',name:'My Family',group:'6Б',color:'yellow'},
{id:'l9',dow:3,time:'13:00',name:'Speaking Club',group:'7Б',color:'lilac'},
{id:'l10',dow:3,time:'15:00',name:'Vocabulary Check',group:'8В',color:'mint'},
{id:'l11',dow:4,time:'09:00',name:'Новый урок',group:'',color:'lilac'}];
const initial=()=>({schedule:structuredClone(defaultSchedule),ideas:['составить тест про лохматого ёжика в лаптях','создать закладки алфавит + маленькие персонажи'],plans:{},students:[{className:'2Б',students:[{name:'Аникина Лариса',grade:''},{name:'Бабаев',grade:'2'},{name:'Гусев',grade:''},{name:'Коротаева Ксения',grade:''}]}],materials:[{id:'m1',name:'Карточки с алфавитом',file:'ABC_cards.pdf'}],homework:[],payments:[],mediaUrl:''});
let account=null,state=null,view='week',modal=null,authMode='login',authError='',toastTimer,lastCalendarDateKey='',mediaRuntime={url:'',type:'',name:''};

function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function getAccounts(){try{return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||'{}')}catch{return {}}}
function setAccounts(v){localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(v))}
async function hash(text){const data=new TextEncoder().encode(text);const digest=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function dataKey(login){return `etp_data_v2_${login}`}
function loadState(login){try{const raw=localStorage.getItem(dataKey(login));return raw?{...initial(),...JSON.parse(raw)}:initial()}catch{return initial()}}
function save(){if(account&&state)localStorage.setItem(dataKey(account.login),JSON.stringify(state))}
function currentDate(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const v=Object.fromEntries(parts.map(p=>[p.type,p.value]));return new Date(+v.year,+v.month-1,+v.day,12,0,0)}
function dateKey(d=currentDate()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function fmtTop(d){const m=['ЯНВАРЯ','ФЕВРАЛЯ','МАРТА','АПРЕЛЯ','МАЯ','ИЮНЯ','ИЮЛЯ','АВГУСТА','СЕНТЯБРЯ','ОКТЯБРЯ','НОЯБРЯ','ДЕКАБРЯ'];return `${d.getDate()} ${m[d.getMonth()]} · ${DOW[d.getDay()].toUpperCase()}`}
function fmtShort(d){const m=['янв.','февр.','мар.','апр.','мая','июн.','июл.','авг.','сен.','окт.','ноя.','дек.'];return `${d.getDate()} ${m[d.getMonth()]}`}
function weekDates(){const now=currentDate(),day=now.getDay()||7,mon=addDays(now,-day+1);return Array.from({length:7},(_,i)=>addDays(mon,i))}
function times(){const a=[];for(let h=6;h<=23;h++)for(const m of [0,30]){if(h===23&&m===30)continue;a.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)}return a}
function hourRows(){return Array.from({length:9},(_,i)=>8+i)}
function uid(){return crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)}
function showToast(msg){clearTimeout(toastTimer);$('.toast')?.remove();const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);toastTimer=setTimeout(()=>t.remove(),1900)}
function persist(msg='Сохранено'){save();showToast(msg);render()}

function startSession(login){const accounts=getAccounts();if(!accounts[login])return false;account={login,teacherName:accounts[login].teacherName};state=loadState(login);sessionStorage.setItem(SESSION_KEY,login);return true}
function restoreSession(){const login=sessionStorage.getItem(SESSION_KEY);return login&&startSession(login)}
function logout(){sessionStorage.removeItem(SESSION_KEY);account=null;state=null;modal=null;view='week';render()}

function render(){const app=$('#app');if(!account){renderAuth(app);return}app.innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="brand"><span>TEACHER <img class="brand-heart" src="${ETP_ASSETS['heart.svg']}" alt=""></span><span>DAY</span></div><div class="nav">${navButton('today','🏠','Сегодня')}${navButton('calendar','🗓️','Календарь')}${navButton('students','<img src="${ETP_ASSETS['students-pencil.svg']}" alt="">','Списки учеников по классам')}${navButton('schedule','📖','Моё расписание')}${navButton('payments','💗','Платные занятия')}${navButton('homework','🏫','Домашние задания')}${navButton('materials','🗂️','Материалы')}</div><button class="logout" data-logout>Выйти · ${esc(account.login)}</button></aside><main class="main">${hero()}${view==='today'?todayView():weekView()}</main></div>${decorations()}${modal?renderModal():''}`;bind();updateClock()}
