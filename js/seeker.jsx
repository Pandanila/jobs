// ============================================================
//  SEEKER (соискатель) screens
// ============================================================

// ---- Right-side action button (TikTok style) ----
function FeedAction({ icon, label, active, accentRing, fill, onClick, glow }) {
  return (
    <button onClick={onClick} style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:5,
      color: active ? 'var(--accent)' : '#fff',
    }}>
      <div className={glow ? 'glow' : ''} style={{
        width:52, height:52, borderRadius:'50%',
        background: accentRing ? 'var(--accent)' : 'rgba(0,0,0,0.38)',
        border: accentRing ? 'none' : '1px solid rgba(255,255,255,0.18)',
        backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: accentRing ? '#0A0A0A' : (active ? 'var(--accent)':'#fff'),
        transition:'transform 140ms',
      }}>
        <Icon name={icon} size={25} fill={fill} stroke={2.2} />
      </div>
      <span style={{fontSize:11.5, fontWeight:700, whiteSpace:'nowrap', color:'#fff', textShadow:'0 1px 7px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.7)'}}>{label}</span>
    </button>
  );
}

// ---- 1. Vacancy feed ----
function VacancyFeed({ onRespond }) {
  const [filter, setFilter] = useState('Все');
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const list = filter === 'Все' ? VACANCIES : VACANCIES.filter(v => v.sphere === filter);
  const scroller = useRef(null);
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = 0; }, [filter]);

  return (
    <div style={{position:'absolute', inset:0}}>
      {/* feed */}
      <div ref={scroller} style={{
        position:'absolute', inset:0, overflowY:'auto',
        scrollSnapType:'y mandatory', WebkitOverflowScrolling:'touch',
      }}>
        {list.map((v, i) => {
          const isLiked = liked[v.id];
          return (
            <div key={v.id} style={{
              height:'100%', width:'100%', position:'relative',
              scrollSnapAlign:'start', scrollSnapStop:'always',
            }}>
              <VideoPlaceholder color={v.color} seed={i*0.21} src={v.cover} label />
              {/* gradient scrim bottom */}
              <div style={{position:'absolute', inset:0,
                background:'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 38%, transparent 62%)'}} />

              {/* right actions */}
              <div style={{position:'absolute', right:14, bottom:138, display:'flex',
                flexDirection:'column', gap:20, alignItems:'center'}}>
                <FeedAction icon="heart" fill={isLiked} active={isLiked}
                  label={(v.likes + (isLiked?1:0))}
                  onClick={()=>setLiked(s=>({...s,[v.id]:!s[v.id]}))} />
                <FeedAction icon="reply" label="Откликнуться" accentRing glow
                  onClick={()=>onRespond(v)} />
                <FeedAction icon="star" fill={saved[v.id]} active={saved[v.id]}
                  label="Сохранить" onClick={()=>setSaved(s=>({...s,[v.id]:!s[v.id]}))} />
              </div>

              {/* bottom info */}
              <div style={{position:'absolute', left:18, right:84, bottom:30}}>
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
                  <LogoCircle color={v.color} letter={v.company[0]} size={38} />
                  <span style={{fontSize:15, fontWeight:700}}>{v.company}</span>
                </div>
                <h2 className="u" style={{margin:'0 0 9px', fontSize:27, fontWeight:700,
                  lineHeight:1.04, letterSpacing:'-0.02em', textShadow:'0 2px 12px rgba(0,0,0,0.5)'}}>
                  {v.position}</h2>
                <div style={{fontSize:13.5, color:'rgba(255,255,255,0.85)', marginBottom:6,
                  display:'flex', alignItems:'center', gap:7}}>
                  <Icon name="pin" size={15} /> {v.location} · {v.format}
                </div>
                <div style={{fontSize:15, fontWeight:800, marginBottom:13}} className="accent">{v.salary}</div>
                <div style={{display:'flex', gap:7, flexWrap:'wrap'}}>
                  {v.tags.map(t => (
                    <span key={t} style={{fontSize:12.5, fontWeight:600, color:'#fff',
                      background:'rgba(255,255,255,0.14)', backdropFilter:'blur(4px)',
                      border:'1px solid rgba(255,255,255,0.16)', padding:'5px 10px', borderRadius:999}}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* top: title + filter chips */}
      <div style={{
        position:'absolute',
        top:0,
        left:0,
        right:0,
        paddingTop:54,
        zIndex:20,
        background:'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.70) 56%, rgba(0,0,0,0.20) 100%)',
        backdropFilter:'blur(10px)',
        WebkitBackdropFilter:'blur(10px)',
        borderBottom:'1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          padding:'4px 18px 10px',
          display:'flex',
          alignItems:'baseline',
          justifyContent:'space-between'
        }}>
          <span className="u" style={{
            fontSize:21,
            fontWeight:800,
            letterSpacing:'-0.03em',
            textShadow:'0 2px 10px rgba(0,0,0,0.9)'
          }}>
            JOBS
          </span>
      
          <span style={{
            fontSize:12.5,
            fontWeight:700,
            color:'rgba(255,255,255,0.82)',
            textShadow:'0 2px 8px rgba(0,0,0,0.9)'
          }}>
            Лента вакансий
          </span>
        </div>
      
        <div style={{
          display:'flex',
          gap:8,
          overflowX:'auto',
          padding:'0 18px 12px'
        }}>
          {SPHERE_FILTERS.map(f => (
            <Chip
              key={f}
              active={f===filter}
              onClick={()=>setFilter(f)}
              style={{
                background: f===filter ? 'var(--accent)' : 'rgba(0,0,0,0.48)',
                color: f===filter ? '#0A0A0A' : '#fff',
                border: f===filter
                  ? '1px solid var(--accent)'
                  : '1px solid rgba(255,255,255,0.32)',
                backdropFilter:'blur(10px)',
                WebkitBackdropFilter:'blur(10px)',
                boxShadow: f===filter
                  ? '0 0 18px rgba(191,255,0,0.32)'
                  : '0 4px 14px rgba(0,0,0,0.35)',
              }}
            >
              {f}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- 2. Record response ----
function RecordResponse({ vacancy, onClose, onSent }) {
  const [phase, setPhase] = useState('idle'); // idle | recording | preview
  const [t, setT] = useState(0);
  const timer = useRef(null);
  const MAX = 60;

  useEffect(()=>()=>clearInterval(timer.current), []);

  const start = () => {
    setPhase('recording'); setT(0);
    timer.current = setInterval(()=>{
      setT(prev => {
        if (prev >= 3) { // simulate end after 3s
          clearInterval(timer.current);
          setPhase('preview');
          return prev;
        }
        return prev + 0.05;
      });
    }, 50);
  };
  // smooth visual fill over 60s scale, but jump-finish at 3s
  const pct = Math.min(t / MAX, 1);
  const remaining = Math.max(0, Math.ceil(MAX - t));
  const R = 78, C = 2 * Math.PI * R;

  return (
    <div className="anim-up" style={{position:'absolute', inset:0, background:'var(--bg)',
      display:'flex', flexDirection:'column', zIndex:60}}>
      <StatusBar />
      {/* header */}
      <div style={{paddingTop:62, padding:'62px 18px 0', display:'flex', alignItems:'center', gap:12}}>
        <button onClick={onClose} style={{width:40,height:40,borderRadius:12,
          background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center',
          border:'1px solid var(--border)'}}>
          <Icon name="back" size={22} />
        </button>
        <div>
          <div style={{fontSize:12.5, color:'var(--muted)', fontWeight:600}}>Отклик на вакансию</div>
          <div style={{fontSize:16, fontWeight:800}} className="u">{vacancy.position}</div>
        </div>
      </div>

      {/* questions */}
      <div style={{padding:'18px 18px 0'}}>
        <div style={{fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase',
          letterSpacing:'0.1em', marginBottom:10}}>Вопросы от {vacancy.company}</div>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {vacancy.questions.map((q,i)=>(
            <div key={i} style={{background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:14, padding:'13px 15px', display:'flex', gap:11, alignItems:'flex-start'}}>
              <span style={{width:22,height:22,borderRadius:'50%', flexShrink:0, background:'var(--accent)',
                color:'#0A0A0A', fontSize:12.5, fontWeight:800, display:'flex', alignItems:'center',
                justifyContent:'center'}}>{i+1}</span>
              <span style={{fontSize:14.5, lineHeight:1.4}}>{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* recorder / preview */}
      <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:22, padding:'10px 18px 34px'}}>

        {phase === 'preview' ? (
          <>
            <div style={{width:188, aspectRatio:'9/16', borderRadius:22, position:'relative',
              overflow:'hidden', border:'1px solid var(--border)'}}>
              <VideoPlaceholder color={vacancy.color} seed={0.5}>
                <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center',
                  justifyContent:'center'}}>
                  <div style={{width:54,height:54,borderRadius:'50%', background:'rgba(0,0,0,0.45)',
                    backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#fff'}}>
                    <Icon name="play" size={26} fill style={{marginLeft:3}} />
                  </div>
                </div>
                <div style={{position:'absolute', bottom:10, left:0, right:0, textAlign:'center',
                  fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.85)'}}>0:58 · готово</div>
              </VideoPlaceholder>
            </div>
            <div style={{display:'flex', gap:12, width:'100%', maxWidth:340}}>
              <button onClick={()=>{setPhase('idle'); setT(0);}} style={{flex:1, padding:'15px',
                borderRadius:16, fontWeight:700, fontSize:15, color:'#fff',
                background:'transparent', border:'1.5px solid #333'}}>Переснять</button>
              <CTA onClick={onSent} style={{flex:1, padding:'15px'}}>Отправить</CTA>
            </div>
          </>
        ) : (
          <>
            <div style={{position:'relative', width:200, height:200, display:'flex',
              alignItems:'center', justifyContent:'center'}}>
              {/* progress ring */}
              <svg width="200" height="200" style={{position:'absolute', transform:'rotate(-90deg)'}}>
                <circle cx="100" cy="100" r={R} stroke="#1E1E1E" strokeWidth="6" fill="none" />
                {phase==='recording' && (
                  <circle cx="100" cy="100" r={R} stroke="var(--accent)" strokeWidth="6" fill="none"
                    strokeLinecap="round" strokeDasharray={C}
                    strokeDashoffset={C * (1 - pct)} style={{transition:'stroke-dashoffset 60ms linear'}} />
                )}
              </svg>
              <button onClick={phase==='idle'?start:undefined} style={{
                width:128, height:128, borderRadius:'50%',
                background: phase==='recording' ? 'var(--red)' : '#fff',
                display:'flex', alignItems:'center', justifyContent:'center',
                color: phase==='recording' ? '#fff' : '#0A0A0A',
                boxShadow: phase==='recording'
                  ? '0 0 50px -6px rgba(255,59,48,0.7)'
                  : '0 0 40px -8px rgba(255,255,255,0.4)',
                transition:'all 240ms',
              }}>
                {phase==='recording'
                  ? <span style={{fontFamily:"'Unbounded',sans-serif", fontWeight:800, fontSize:30}}>{remaining}</span>
                  : <Icon name="camera" size={46} />}
              </button>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:15.5, fontWeight:700}}>
                {phase==='recording' ? 'Идёт запись…' : 'Запишите видео-ответ'}</div>
              <div style={{fontSize:13, color:'var(--muted)', marginTop:4}}>
                {phase==='recording' ? 'Нажми, чтобы остановить раньше' : 'До 60 секунд · вертикальное видео'}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---- 3. My responses ----
function MyResponses() {
  return (
    <div className="anim-in" style={{position:'absolute', inset:0, overflowY:'auto', paddingTop:64}}>
      <div style={{padding:'8px 20px 16px'}}>
        <h1 className="u" style={{margin:0, fontSize:26, fontWeight:800, letterSpacing:'-0.03em'}}>Мои отклики</h1>
        <p style={{margin:'6px 0 0', fontSize:14, color:'var(--muted)'}}>{MY_RESPONSES.length} активных откликов</p>
      </div>
      <div style={{padding:'0 16px 24px', display:'flex', flexDirection:'column', gap:11}}>
        {MY_RESPONSES.map(r => {
          const st = RESPONSE_STATUS[r.status];
          return (
            <div key={r.id} style={{background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:18, padding:'14px', display:'flex', alignItems:'center', gap:13}}>
              <LogoCircle color={r.color} letter={r.company[0]} size={48} />
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:15.5, fontWeight:700, whiteSpace:'nowrap', overflow:'hidden',
                  textOverflow:'ellipsis'}}>{r.position}</div>
                <div style={{fontSize:13, color:'var(--muted)', marginTop:2}}>{r.company} · {r.date}</div>
              </div>
              <span style={{fontSize:12, fontWeight:700, color:st.color, background:st.bg,
                padding:'6px 11px', borderRadius:999, whiteSpace:'nowrap'}}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- 4. Seeker profile ----
function SeekerProfile({ onExit }) {
  const [active, setActive] = useState(SEEKER.skills);
  const toggle = (s) => setActive(a => a.includes(s) ? a.filter(x=>x!==s) : [...a, s]);
  const all = [...SEEKER.skills, ...SEEKER.allSkills];

  return (
    <div className="anim-in" style={{position:'absolute', inset:0, overflowY:'auto', paddingTop:64, paddingBottom:24}}>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 20px 0'}}>
        <Avatar accent initials={SEEKER.initials} size={92} />
        <h1 className="u" style={{margin:'16px 0 4px', fontSize:23, fontWeight:800}}>{SEEKER.name}</h1>
        <div style={{fontSize:14.5, color:'var(--muted)', fontWeight:600}}>{SEEKER.role}</div>
      </div>

      {/* video profile */}
      <div style={{padding:'20px 20px 0'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <span style={{fontSize:13, fontWeight:700, color:'var(--muted)', textTransform:'uppercase',
            letterSpacing:'0.08em'}}>Видео-профиль</span>
          <button style={{fontSize:13, fontWeight:700, color:'var(--accent)', display:'flex',
            alignItems:'center', gap:5}}><Icon name="flip" size={16}/> Перезаписать</button>
        </div>
        <div style={{width:'100%', aspectRatio:'9/16', maxHeight:300, borderRadius:20, overflow:'hidden',
          position:'relative', border:'1px solid var(--border)'}}>
          <VideoPlaceholder color="#BFFF00" seed={0.2}>
            <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{width:58,height:58,borderRadius:'50%', background:'rgba(0,0,0,0.4)',
                backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon name="play" size={28} fill style={{marginLeft:3, color:'#fff'}} />
              </div>
            </div>
          </VideoPlaceholder>
        </div>
      </div>

      {/* stats */}
      <div style={{display:'flex', padding:'18px 20px 0', gap:10}}>
        {SEEKER.stats.map(s => (
          <div key={s.k} style={{flex:1, background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:16, padding:'13px 8px', textAlign:'center'}}>
            <div className="u" style={{fontSize:21, fontWeight:800}}>{s.v}</div>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:3}}>{s.k}</div>
          </div>
        ))}
      </div>

      {/* skills */}
      <div style={{padding:'20px 20px 0'}}>
        <div style={{fontSize:13, fontWeight:700, color:'var(--muted)', textTransform:'uppercase',
          letterSpacing:'0.08em', marginBottom:12}}>Навыки <span style={{textTransform:'none',
          fontWeight:500}}>· нажми, чтобы добавить</span></div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {all.map(s => (
            <Chip key={s} active={active.includes(s)} onClick={()=>toggle(s)}>
              {active.includes(s) && '✓ '}#{s}
            </Chip>
          ))}
        </div>
      </div>

      <div style={{padding:'24px 20px 0'}}>
        <button onClick={onExit} style={{width:'100%', padding:'15px', borderRadius:16,
          fontWeight:700, fontSize:15, color:'var(--muted)', background:'var(--surface)',
          border:'1px solid var(--border)'}}>Сменить роль</button>
      </div>
    </div>
  );
}

// ---- Seeker app shell ----
function SeekerApp({ onExit }) {
  const [tab, setTab] = useState('feed');
  const [recording, setRecording] = useState(null); // vacancy
  const [toast, setToast] = useState(false);

  const tabs = [
    { key:'feed', label:'Лента', icon:'home' },
    { key:'responses', label:'Отклики', icon:'list' },
    { key:'profile', label:'Профиль', icon:'user', fillable:true },
  ];
  const dark = tab === 'feed';

  return (
    <div className="screen" style={{background:'var(--bg)'}}>
      {!recording && <StatusBar tint={dark ? '#fff' : '#fff'} />}
      <div className="content">
        {tab==='feed' && <VacancyFeed onRespond={v=>setRecording(v)} />}
        {tab==='responses' && <MyResponses />}
        {tab==='profile' && <SeekerProfile onExit={onExit} />}
        {recording && (
          <RecordResponse vacancy={recording} onClose={()=>setRecording(null)}
            onSent={()=>{ setRecording(null); setToast(true); setTab('responses');
              setTimeout(()=>setToast(false), 2600); }} />
        )}
      </div>
      {!recording && <TabBar tabs={tabs} active={tab} onChange={setTab} />}

      {toast && (
        <div style={{position:'absolute', bottom:90, left:'50%', transform:'translateX(-50%)',
          background:'var(--accent)', color:'#0A0A0A', fontWeight:800, fontSize:14,
          padding:'12px 20px', borderRadius:999, zIndex:80, whiteSpace:'nowrap',
          boxShadow:'0 12px 30px -8px rgba(191,255,0,0.6)', display:'flex', alignItems:'center', gap:8}}>
          <Icon name="check" size={18} stroke={3}/> Отклик отправлен!
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SeekerApp });
