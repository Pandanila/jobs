// ===== Mock data =====
const VACANCIES = [
  {
    id:1,
    company:'Авито',
    position:'Менеджер по продажам',
    sphere:'Продажи',
    format:'Гибрид',
    location:'Москва',
    salary:'80 000 — 120 000 ₽',
    tags:['b2b','crm','переговоры'],
    color:'#1A1AFF',
    cover:'uploads/avito-cover.png',
    logo:'uploads/avito-logo.png',
    likes:342,
    questions:['Расскажи о своём опыте в продажах','Почему хочешь к нам?']
  },
  {
    id:2,
    company:'Сбер',
    position:'HR-специалист',
    sphere:'HR',
    format:'Офис',
    location:'Москва',
    salary:'70 000 — 90 000 ₽',
    tags:['рекрутинг','1С','hh.ru'],
    color:'#1DB954',
    cover:'uploads/sber-cover.png',
    logo:'uploads/sber-logo.png',
    likes:188,
    questions:['Как ты ищешь кандидатов?','Твой главный кейс?']
  },
  {
    id:3,
    company:'Wildberries',
    position:'Менеджер маркетплейса',
    sphere:'Ритейл',
    format:'Удалёнка',
    location:'Удалённо',
    salary:'60 000 — 100 000 ₽',
    tags:['wb','excel','аналитика'],
    color:'#CB11AB',
    cover:'uploads/wb-cover.png',
    logo:'uploads/wb-logo.png',
    likes:521,
    questions:['Опыт работы с маркетплейсами?']
  },
  {
    id:4,
    company:'Т-Банк',
    position:'Менеджер поддержки',
    sphere:'Сервис',
    format:'Гибрид',
    location:'Санкт-Петербург',
    salary:'55 000 — 75 000 ₽',
    tags:['клиентский сервис','конфликты','cx'],
    color:'#FFD600',
    cover:'uploads/tbank-cover.png',
    logo:'uploads/tbank-logo.png',
    likes:276,
    questions:['Как ты работаешь с трудным клиентом?']
  },
  {
    id:5,
    company:'VK',
    position:'Маркетолог',
    sphere:'Маркетинг',
    format:'Офис',
    location:'Москва',
    salary:'90 000 — 130 000 ₽',
    tags:['smm','таргет','аналитика'],
    color:'#0077FF',
    cover:'uploads/vk-cover.png',
    logo:'uploads/vk-logo.png',
    likes:413,
    questions:['Покажи кейс из портфолио','Какие инструменты используешь?']
  },
];

const CANDIDATES = [
  { id:1, name:'Алина Козлова', sphere:'Продажи', desc:'3 года в B2B, выполняла план на 140%', skills:['переговоры','crm','b2b'], color:'#FF6B9D', status:'new' },
  { id:2, name:'Иван Петров', sphere:'HR', desc:'Закрыл 50+ вакансий за год', skills:['рекрутинг','hh','sourcing'], color:'#6B9DFF', status:'viewed' },
  { id:3, name:'Мария Сидорова', sphere:'Маркетинг', desc:'Запускала рекламу с ROAS 8x', skills:['таргет','аналитика','контент'], color:'#9DFF6B', status:'replied' },
  { id:4, name:'Дмитрий Волков', sphere:'Сервис', desc:'NPS команды вырос с 62 до 81', skills:['cx','поддержка','обучение'], color:'#FFD06B', status:'new' },
  { id:5, name:'Екатерина Новак', sphere:'Ритейл', desc:'Управляла магазином с оборотом 15 млн/мес', skills:['управление','wb','excel'], color:'#FF9D6B', status:'new' },
];

const SPHERE_FILTERS = ['Все','Продажи','HR','Маркетинг','Сервис','Ритейл'];

// Seeker's own outgoing responses (My responses screen)
const MY_RESPONSES = [
  { id:1, company:'Авито',      color:'#1A1AFF', position:'Менеджер по продажам', date:'29 мая',  status:'replied' },
  { id:2, company:'Wildberries',color:'#FF6B35', position:'Менеджер маркетплейса',date:'27 мая',  status:'viewed' },
  { id:3, company:'VK',         color:'#0077FF', position:'Маркетолог',           date:'24 мая',  status:'sent' },
  { id:4, company:'Сбер',       color:'#1DB954', position:'HR-специалист',        date:'21 мая',  status:'sent' },
];

const RESPONSE_STATUS = {
  sent:    { label:'Отправлен',  color:'#888888', bg:'rgba(136,136,136,0.16)' },
  viewed:  { label:'Просмотрен', color:'#FFD600', bg:'rgba(255,214,0,0.14)' },
  replied: { label:'Ответили',   color:'#BFFF00', bg:'rgba(191,255,0,0.14)' },
};

// Seeker profile
const SEEKER = {
  name:'Артём Соколов',
  role:'Менеджер по продажам',
  color:'#BFFF00',
  initials:'АС',
  skills:['b2b','переговоры','crm','холодные звонки','аналитика'],
  allSkills:['воронка','презентации','excel','1С','клиентский сервис','тендеры'],
  stats:[ {k:'Просмотры', v:'1 248'}, {k:'Отклики', v:'12'}, {k:'Приглашения', v:'4'} ],
};

// Company profile + its active vacancies
const COMPANY = {
  name:'Авито',
  industry:'Классифайды · E-commerce',
  color:'#1A1AFF',
  letter:'А',
  desc:'Крупнейшая в России платформа объявлений. Ищем людей, которые двигают продукт и продажи вперёд.',
  vacancies:[
    { position:'Менеджер по продажам', views:1840, responses:42 },
    { position:'Аналитик данных',      views:920,  responses:18 },
    { position:'Дизайнер интерфейсов', views:1310, responses:27 },
  ],
};

const CHAT_SEED = [
  { from:'company', text:'Здравствуйте! Нам понравился ваш видео-отклик 👏' },
  { from:'company', text:'Удобно созвониться завтра в 15:00?' },
  { from:'me',      text:'Здравствуйте! Да, отлично, буду на связи.' },
];

Object.assign(window, {
  VACANCIES, CANDIDATES, SPHERE_FILTERS, MY_RESPONSES, RESPONSE_STATUS,
  SEEKER, COMPANY, CHAT_SEED,
});
