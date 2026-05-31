// ============================================================
//  ROOT — role select + router
// ============================================================

function RoleSelect({ onPick }) {
  return (
    <div className="screen" style={{background:'var(--bg)'}}>
      <StatusBar />
      {/* ambient lime glow */}
      <div style={{position:'absolute', top:'-12%', left:'50%', transform:'translateX(-50%)',
        width:340, height:340, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(191,255,0,0.22), transparent 65%)', filter:'blur(10px)'}} />

      <div className="content" style={{display:'flex', flexDirection:'column', justifyContent:'space-between',
        padding:'92px 26px 28px'}}>
        <div>
          <div className="u accent" style={{fontSize:13, fontWeight:700, letterSpacing:'0.22em',
            textTransform:'uppercase', marginBottom:18}}>видео-рекрутинг</div>
          <h1 className="u" style={{margin:0, fontSize:56, fontWeight:800, lineHeight:0.9,
            letterSpacing:'-0.045em'}}>JOBS</h1>
          <p style={{margin:'20px 0 0', fontSize:17, lineHeight:1.5, color:'rgba(255,255,255,0.8)',
            maxWidth:300, textWrap:'pretty'}}>
            Работу находят за минуту. Соискатели снимают видео-профили, компании
            публикуют видео-вакансии — отбор идёт через ленту, как в TikTok.</p>
        </div>

        <div>
          <div style={{fontSize:13, fontWeight:700, color:'var(--muted)', textTransform:'uppercase',
            letterSpacing:'0.1em', marginBottom:14}}>Выбери роль</div>
          <div style={{display:'flex', flexDirection:'column', gap:13}}>
            <RoleButton accent title="Я ищу работу" sub="Соискатель — лента вакансий и видео-отклики"
              onClick={()=>onPick('seeker')} icon="user" />
            <RoleButton title="Я ищу сотрудников" sub="Компания — лента откликов и вакансии"
              onClick={()=>onPick('company')} icon="contacts" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleButton({ accent, title, sub, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      width:'100%', textAlign:'left', padding:'20px 22px', borderRadius:22,
      background: accent ? 'var(--accent)' : 'var(--surface)',
      color: accent ? '#0A0A0A' : '#fff',
      border: accent ? 'none' : '1px solid var(--border)',
      display:'flex', alignItems:'center', gap:16, transition:'transform 130ms',
      boxShadow: accent ? '0 16px 40px -12px rgba(191,255,0,0.55)' : 'none',
    }}
    onPointerDown={e=>e.currentTarget.style.transform='scale(0.98)'}
    onPointerUp={e=>e.currentTarget.style.transform='scale(1)'}
    onPointerLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      <div style={{width:50, height:50, borderRadius:15, flexShrink:0,
        background: accent ? 'rgba(10,10,10,0.12)' : 'rgba(191,255,0,0.12)',
        color: accent ? '#0A0A0A' : 'var(--accent)',
        display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Icon name={icon} size={26} stroke={2.2}/>
      </div>
      <div style={{flex:1}}>
        <div className="u" style={{fontSize:18, fontWeight:700, letterSpacing:'-0.02em'}}>{title}</div>
        <div style={{fontSize:12.5, marginTop:3, opacity: accent ? 0.7 : 1,
          color: accent ? '#0A0A0A' : 'var(--muted)'}}>{sub}</div>
      </div>
      <span style={{fontSize:22, opacity:0.6}}>→</span>
    </button>
  );
}

function App() {
  const [role, setRole] = useState(null); // null | 'seeker' | 'company'
  return (
    <div className="stage">
      <div className="stage-copy">
        <div className="wordmark">Найм<br/>через <b>видео.</b></div>
        <p>Это кликабельный pitch-прототип приложения <b style={{color:'#fff'}}>JOBS</b> — сервиса
          онлайн-рекрутинга, где вакансии и кандидаты живут в вертикальной видео-ленте.</p>
        <p>Выбери роль в приложении справа: <b style={{color:'#fff'}}>соискатель</b> листает
          вакансии и записывает видео-отклики; <b style={{color:'#fff'}}>компания</b> свайпает
          кандидатов и собирает шортлист.</p>
        <span className="tag"><span style={{width:7,height:7,borderRadius:99,
          background:'var(--accent)',display:'inline-block'}}/> Демо · моковые данные</span>
      </div>

      <div className="phone">
        {role === null && <RoleSelect onPick={setRole} />}
        {role === 'seeker' && <SeekerApp onExit={()=>setRole(null)} />}
        {role === 'company' && <CompanyApp onExit={()=>setRole(null)} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
