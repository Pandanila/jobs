// ============================================================
//  COMPANY (компания) screens
// ============================================================

// ---- Swipeable candidate card (horizontal drag to decide) ----
function SwipeCard({ cand, seed, onDecide, onWrite }) {
  const [dx, setDx] = useState(0);
  const [flying, setFlying] = useState(null); // 'yes' | 'no'
  const drag = useRef({ active:false, startX:0, startY:0, locked:null });

  const down = (e) => {
    drag.current = { active:true, startX:e.clientX, startY:e.clientY, locked:null };
  };
  const move = (e) => {
    const d = drag.current; if (!d.active) return;
    const ddx = e.clientX - d.startX, ddy = e.clientY - d.startY;
    if (d.locked === null) {
      if (Math.abs(ddx) > 8 || Math.abs(ddy) > 8) d.locked = Math.abs(ddx) > Math.abs(ddy) ? 'x' : 'y';
    }
    if (d.locked === 'x') { e.preventDefault?.(); setDx(ddx); }
  };
  const up = () => {
    const d = drag.current; d.active = false;
    if (Math.abs(dx) > 100) decide(dx > 0 ? 'yes' : 'no');
    else setDx(0);
  };
  const decide = (verdict) => {
    setFlying(verdict);
    setTimeout(()=>onDecide(cand, verdict), 320);
  };

  const flyX = flying === 'yes' ? 700 : flying === 'no' ? -700 : dx;
  const rot = flyX / 22;
  const yesOp = Math.max(0, Math.min(1, dx/100));
  const noOp = Math.max(0, Math.min(1, -dx/100));

  return (
    <div style={{height:'100%', width:'100%', position:'relative',
      scrollSnapAlign:'start', scrollSnapStop:'always'}}>
      <div
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={{position:'absolute', inset:0, touchAction:'pan-y',
          transform:`translateX(${flyX}px) rotate(${rot}deg)`,
          opacity: flying ? 0 : 1,
          transition: drag.current.active && !flying ? 'none' : 'transform 320ms cubic-bezier(.2,.7,.2,1), opacity 320ms'}}>
        <VideoPlaceholder color={cand.color} seed={seed} label />
        <div style={{position:'absolute', inset:0,
          background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 64%)'}} />

        {/* decision stamps */}
        <div style={{position:'absolute', top:90, left:22, transform:'rotate(-14deg)', opacity:yesOp,
          border:'3px solid var(--accent)', color:'var(--accent)', borderRadius:12, padding:'5px 16px',
          fontFamily:"'Unbounded',sans-serif", fontWeight:800, fontSize:24, letterSpacing:'0.04em'}}>ДА</div>
        <div style={{position:'absolute', top:90, right:22, transform:'rotate(14deg)', opacity:noOp,
          border:'3px solid #FF3B30', color:'#FF3B30', borderRadius:12, padding:'5px 14px',
          fontFamily:"'Unbounded',sans-serif", fontWeight:800, fontSize:24, letterSpacing:'0.04em'}}>НЕТ</div>

        {/* info */}
        <div style={{position:'absolute', left:18, right:84, bottom:30}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.14)',
            border:'1px solid rgba(255,255,255,0.18)', padding:'5px 12px', borderRadius:999, marginBottom:12,
            fontSize:12.5, fontWeight:700}}>
            <span style={{width:7,height:7,borderRadius:99,background:'var(--accent)'}} /> {cand.sphere}
          </div>
          <h2 className="u" style={{margin:'0 0 9px', fontSize:27, fontWeight:700, lineHeight:1.05,
            letterSpacing:'-0.02em', textShadow:'0 2px 12px rgba(0,0,0,0.5)'}}>{cand.name}</h2>
          <p style={{margin:'0 0 13px', fontSize:14.5, lineHeight:1.45, color:'rgba(255,255,255,0.9)'}}>{cand.desc}</p>
          <div style={{display:'flex', gap:7, flexWrap:'wrap'}}>
            {cand.skills.map(s => (
              <span key={s} style={{fontSize:12.5, fontWeight:600, background:'rgba(255,255,255,0.14)',
                border:'1px solid rgba(255,255,255,0.16)', padding:'5px 10px', borderRadius:999}}>#{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* right actions (outside the dragged layer) */}
      <div style={{position:'absolute', right:14, bottom:150, display:'flex', flexDirection:'column',
        gap:18, alignItems:'center', zIndex:5}}>
        <FeedAction icon="check" label="Подходит" accentRing onClick={()=>decide('yes')} />
        <FeedAction icon="cross" label="Не подходит"
          onClick={()=>decide('no')} />
        <FeedAction icon="mail" label="Написать" onClick={()=>onWrite(cand)} />
      </div>
    </div>
  );
}

// ---- 5. Candidate feed ----
function CandidateFeed({ onShortlist, onWrite }) {
  const [tab, setTab] = useState('vac');
  const [done, setDone] = useState([]); // decided ids
  const list = CANDIDATES.filter(c => !done.includes(c.id));
  const scroller = useRef(null);

  const decide = (cand, verdict) => {
    if (verdict === 'yes') onShortlist(cand);
    setDone(d => [...d, cand.id]);
  };

  return (
    <div style={{position:'absolute', inset:0}}>
      <div ref={scroller} style={{position:'absolute', inset:0, overflowY:'auto',
        scrollSnapType:'y mandatory', WebkitOverflowScrolling:'touch'}}>
        {list.length === 0 ? (
          <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:14, padding:40, textAlign:'center'}}>
            <div style={{width:70,height:70,borderRadius:'50%', background:'rgba(191,255,0,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center'}}>
              <Icon name="check" size={34} stroke={2.4} style={{color:'var(--accent)'}} />
            </div>
            <h2 className="u" style={{margin:0, fontSize:21, fontWeight:800}}>Все отклики просмотрены</h2>
            <p style={{margin:0, fontSize:14, color:'var(--muted)'}}>Подходящие кандидаты — во вкладке «Контакты»</p>
          </div>
        ) : list.map((c,i)=>(
          <SwipeCard key={c.id} cand={c} seed={i*0.27} onDecide={decide} onWrite={onWrite} />
        ))}
      </div>

      {/* top tabs */}
      <div style={{position:'absolute', top:0, left:0, right:0, paddingTop:54,
        background:'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)'}}>
        <div style={{padding:'6px 18px 0', display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <span className="u" style={{fontSize:21, fontWeight:800, letterSpacing:'-0.03em'}}>JOBS</span>
          <span style={{fontSize:12.5, fontWeight:700, color:'rgba(255,255,255,0.7)'}}>{list.length} откликов</span>
        </div>
        <div style={{display:'flex', gap:8, padding:'12px 18px 12px'}}>
          <Chip active={tab==='vac'} onClick={()=>setTab('vac')}>Отклики на вакансии</Chip>
          <Chip active={tab==='all'} onClick={()=>setTab('all')}>Все кандидаты</Chip>
        </div>
      </div>
    </div>
  );
}

// ---- 6. Create vacancy ----
function CreateVacancy({ onPublished }) {
  const [step, setStep] = useState(1);
  const [position, setPosition] = useState('');
  const [sphere, setSphere] = useState('Продажи');
  const [format, setFormat] = useState('Офис');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [success, setSuccess] = useState(false);

  const inputStyle = {
    width:'100%', padding:'14px 15px', borderRadius:14, background:'var(--surface)',
    border:'1px solid var(--border)', color:'#fff', fontSize:15, fontFamily:'inherit', outline:'none',
  };
  const labelStyle = { fontSize:12.5, fontWeight:700, color:'var(--muted)', marginBottom:8, display:'block',
    textTransform:'uppercase', letterSpacing:'0.06em' };

  return (
    <div className="anim-in" style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', paddingTop:60}}>
      {/* progress */}
      <div style={{padding:'8px 20px 0'}}>
        <h1 className="u" style={{margin:'0 0 14px', fontSize:24, fontWeight:800, letterSpacing:'-0.03em'}}>Новая вакансия</h1>
        <div style={{display:'flex', gap:8, marginBottom:4}}>
          {[1,2].map(s=>(
            <div key={s} style={{flex:1, height:5, borderRadius:99,
              background: s<=step ? 'var(--accent)' : 'var(--border)', transition:'background 280ms'}} />
          ))}
        </div>
        <div style={{fontSize:12.5, color:'var(--muted)', fontWeight:600}}>Шаг {step} из 2 · {step===1?'Описание':'Видео'}</div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'18px 20px 20px'}}>
        {step===1 ? (
          <div style={{display:'flex', flexDirection:'column', gap:18}}>
            <div>
              <label style={labelStyle}>Должность</label>
              <input style={inputStyle} placeholder="Напр. Менеджер по продажам"
                value={position} onChange={e=>setPosition(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Сфера</label>
              <div style={{position:'relative'}}>
                <select value={sphere} onChange={e=>setSphere(e.target.value)}
                  style={{...inputStyle, appearance:'none', paddingRight:40}}>
                  {['Продажи','HR','Маркетинг','Сервис','Ритейл','IT'].map(o=><option key={o}>{o}</option>)}
                </select>
                <span style={{position:'absolute', right:16, top:'50%', transform:'translateY(-50%)',
                  pointerEvents:'none', color:'var(--muted)'}}>▾</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Формат</label>
              <div style={{display:'flex', gap:8}}>
                {['Офис','Удалёнка','Гибрид'].map(f=>(
                  <Chip key={f} active={format===f} onClick={()=>setFormat(f)} style={{flex:1, textAlign:'center', display:'block'}}>{f}</Chip>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Зарплата, ₽</label>
              <div style={{display:'flex', gap:10, alignItems:'center'}}>
                <input style={inputStyle} placeholder="от" value={from} onChange={e=>setFrom(e.target.value)} inputMode="numeric" />
                <span style={{color:'var(--muted)'}}>—</span>
                <input style={inputStyle} placeholder="до" value={to} onChange={e=>setTo(e.target.value)} inputMode="numeric" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Вопросы кандидату</label>
              <div style={{display:'flex', flexDirection:'column', gap:9}}>
                {questions.map((q,i)=>(
                  <input key={i} style={inputStyle} placeholder={`Вопрос ${i+1}`} value={q}
                    onChange={e=>setQuestions(qs=>qs.map((x,j)=>j===i?e.target.value:x))} />
                ))}
                {questions.length < 3 && (
                  <button onClick={()=>setQuestions(qs=>[...qs,''])} style={{alignSelf:'flex-start',
                    fontSize:13.5, fontWeight:700, color:'var(--accent)', display:'flex', alignItems:'center',
                    gap:5, padding:'4px 0', whiteSpace:'nowrap'}}><Icon name="plus" size={17} stroke={2.6}/> Добавить вопрос</button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            <div style={{width:'100%', aspectRatio:'9/13', borderRadius:20, border:'2px dashed #2f2f2f',
              background:'var(--surface)', display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:14, color:'var(--muted)', cursor:'pointer'}}>
              <div style={{width:62,height:62,borderRadius:'50%', background:'rgba(191,255,0,0.12)',
                display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)'}}>
                <Icon name="upload" size={30}/>
              </div>
              <div style={{fontSize:15.5, fontWeight:700, color:'#fff'}}>Загрузить видео о вакансии</div>
              <div style={{fontSize:13, maxWidth:230, textAlign:'center'}}>Вертикальное видео до 60 секунд. Расскажите о команде и задачах.</div>
            </div>
            <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14,
              padding:'14px', display:'flex', alignItems:'center', gap:12}}>
              <LogoCircle color={COMPANY.color} letter={COMPANY.letter} size={40} />
              <div>
                <div style={{fontSize:15, fontWeight:700}}>{position || 'Должность'}</div>
                <div style={{fontSize:13, color:'var(--muted)'}}>{sphere} · {format}{from&&to?` · ${from}–${to} ₽`:''}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{padding:'4px 20px 22px', display:'flex', gap:12}}>
        {step===2 && (
          <button onClick={()=>setStep(1)} style={{padding:'17px 22px', borderRadius:18, fontWeight:700,
            fontSize:15, color:'#fff', background:'var(--surface)', border:'1px solid var(--border)'}}>Назад</button>
        )}
        <CTA onClick={()=> step===1 ? setStep(2) : setSuccess(true)} disabled={step===1 && !position}>
          {step===1 ? 'Далее →' : 'Опубликовать'}
        </CTA>
      </div>

      {success && (
        <div style={{position:'absolute', inset:0, background:'rgba(5,5,5,0.82)', backdropFilter:'blur(8px)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18,
          zIndex:90, padding:30}}>
          <div style={{width:108, height:108, borderRadius:'50%', background:'var(--accent)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#0A0A0A',
            boxShadow:'0 0 60px -10px rgba(191,255,0,0.8)',
            animation:'spinIn 460ms cubic-bezier(.2,1.4,.4,1)'}}>
            <Icon name="check" size={56} stroke={3.2}/>
          </div>
          <h2 className="u" style={{margin:0, fontSize:24, fontWeight:800, textAlign:'center'}}>Вакансия опубликована!</h2>
          <p style={{margin:0, fontSize:14.5, color:'var(--muted)', textAlign:'center', maxWidth:260}}>
            Соискатели уже видят её в ленте. Отклики появятся здесь.</p>
          <div style={{width:'100%', maxWidth:300, marginTop:6}}>
            <CTA onClick={onPublished}>К откликам</CTA>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Mini chat ----
function MiniChat({ cand, onBack }) {
  const [msgs, setMsgs] = useState(CHAT_SEED);
  const [text, setText] = useState('');
  const end = useRef(null);
  useEffect(()=>{ if(end.current) end.current.scrollTop = end.current.scrollHeight; }, [msgs]);
  const send = () => { if(!text.trim()) return; setMsgs(m=>[...m,{from:'me',text:text.trim()}]); setText(''); };

  return (
    <div className="anim-up" style={{position:'absolute', inset:0, background:'var(--bg)', display:'flex',
      flexDirection:'column', zIndex:70, paddingTop:52}}>
      <div style={{padding:'10px 14px', display:'flex', alignItems:'center', gap:12,
        borderBottom:'1px solid var(--border)'}}>
        <button onClick={onBack} style={{width:40,height:40,borderRadius:12, background:'var(--surface)',
          display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--border)'}}>
          <Icon name="back" size={22}/>
        </button>
        <Avatar color={cand.color} initials={cand.name.split(' ').map(w=>w[0]).join('')} size={40} />
        <div>
          <div style={{fontSize:15.5, fontWeight:700, whiteSpace:'nowrap'}}>{cand.name}</div>
          <div style={{fontSize:12.5, color:'var(--accent)', fontWeight:600}}>● онлайн</div>
        </div>
      </div>

      <div ref={end} style={{flex:1, overflowY:'auto', padding:'18px 16px', display:'flex',
        flexDirection:'column', gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{alignSelf: m.from==='me'?'flex-end':'flex-start', maxWidth:'78%',
            background: m.from==='me'?'var(--accent)':'var(--surface)',
            color: m.from==='me'?'#0A0A0A':'#fff', padding:'11px 15px',
            borderRadius: m.from==='me'?'18px 18px 5px 18px':'18px 18px 18px 5px',
            fontSize:14.5, lineHeight:1.4, fontWeight: m.from==='me'?600:500,
            border: m.from==='me'?'none':'1px solid var(--border)'}}>{m.text}</div>
        ))}
      </div>

      <div style={{padding:'10px 14px 22px', display:'flex', gap:10, borderTop:'1px solid var(--border)'}}>
        <input value={text} onChange={e=>setText(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') send(); }}
          placeholder="Сообщение…" style={{flex:1, padding:'13px 16px', borderRadius:999,
            background:'var(--surface)', border:'1px solid var(--border)', color:'#fff', fontSize:14.5,
            fontFamily:'inherit', outline:'none'}} />
        <button onClick={send} style={{width:48,height:48,borderRadius:'50%', background:'var(--accent)',
          color:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
          <Icon name="send" size={22} fill/>
        </button>
      </div>
    </div>
  );
}

// ---- 7. Contacts ----
function Contacts({ shortlist, openChat }) {
  return (
    <div className="anim-in" style={{position:'absolute', inset:0, overflowY:'auto', paddingTop:64}}>
      <div style={{padding:'8px 20px 16px'}}>
        <h1 className="u" style={{margin:0, fontSize:26, fontWeight:800, letterSpacing:'-0.03em'}}>Контакты</h1>
        <p style={{margin:'6px 0 0', fontSize:14, color:'var(--muted)'}}>Шортлист · {shortlist.length} кандидатов</p>
      </div>
      {shortlist.length === 0 ? (
        <div style={{padding:'40px 30px', textAlign:'center', color:'var(--muted)'}}>
          <div style={{width:64,height:64,borderRadius:'50%', background:'var(--surface)', margin:'0 auto 16px',
            display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Icon name="check" size={30} style={{color:'var(--muted)'}}/>
          </div>
          <div style={{fontSize:15, fontWeight:700, color:'#fff', marginBottom:6}}>Пока пусто</div>
          <div style={{fontSize:13.5, lineHeight:1.5}}>Свайпни кандидата вправо или нажми ✓ в ленте откликов — он появится здесь.</div>
        </div>
      ) : (
        <div style={{padding:'0 16px 24px', display:'flex', flexDirection:'column', gap:11}}>
          {shortlist.map(c=>(
            <div key={c.id} style={{background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:18, padding:'13px', display:'flex', alignItems:'center', gap:13}}>
              <Avatar color={c.color} initials={c.name.split(' ').map(w=>w[0]).join('')} size={48}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:15.5, fontWeight:700}}>{c.name}</div>
                <div style={{fontSize:13, color:'var(--muted)'}}>{c.sphere}</div>
              </div>
              <button onClick={()=>openChat(c)} style={{padding:'10px 16px', borderRadius:12,
                background:'var(--accent)', color:'#0A0A0A', fontWeight:700, fontSize:13.5,
                display:'flex', alignItems:'center', gap:6}}>
                <Icon name="mail" size={17}/> Написать</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- 8. Company profile ----
function CompanyProfile({ onExit }) {
  return (
    <div className="anim-in" style={{position:'absolute', inset:0, overflowY:'auto', paddingTop:64, paddingBottom:24}}>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 20px 0'}}>
        <LogoCircle color={COMPANY.color} letter={COMPANY.letter} size={86} />
        <h1 className="u" style={{margin:'16px 0 4px', fontSize:23, fontWeight:800}}>{COMPANY.name}</h1>
        <div style={{fontSize:14, color:'var(--muted)', fontWeight:600}}>{COMPANY.industry}</div>
      </div>

      <div style={{padding:'20px 20px 0'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <span style={{fontSize:13, fontWeight:700, color:'var(--muted)', textTransform:'uppercase',
            letterSpacing:'0.08em'}}>Видео о компании</span>
          <button style={{fontSize:13, fontWeight:700, color:'var(--accent)', display:'flex',
            alignItems:'center', gap:5}}><Icon name="flip" size={16}/> Обновить</button>
        </div>
        <div style={{width:'100%', aspectRatio:'16/10', borderRadius:18, overflow:'hidden',
          position:'relative', border:'1px solid var(--border)'}}>
          <VideoPlaceholder color={COMPANY.color} seed={0.4}>
            <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{width:56,height:56,borderRadius:'50%', background:'rgba(0,0,0,0.4)',
                backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon name="play" size={26} fill style={{marginLeft:3, color:'#fff'}}/>
              </div>
            </div>
          </VideoPlaceholder>
        </div>
        <p style={{fontSize:14.5, lineHeight:1.55, color:'rgba(255,255,255,0.82)', margin:'14px 0 0',
          textWrap:'pretty'}}>{COMPANY.desc}</p>
      </div>

      <div style={{padding:'22px 20px 0'}}>
        <div style={{fontSize:13, fontWeight:700, color:'var(--muted)', textTransform:'uppercase',
          letterSpacing:'0.08em', marginBottom:12}}>Активные вакансии</div>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {COMPANY.vacancies.map((v,i)=>(
            <div key={i} style={{background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:16, padding:'14px 15px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div style={{fontSize:15, fontWeight:700}}>{v.position}</div>
              <div style={{display:'flex', gap:16, fontSize:12.5}}>
                <span style={{color:'var(--muted)'}}>{v.views.toLocaleString('ru')} <span style={{fontSize:11}}>просм.</span></span>
                <span className="accent" style={{fontWeight:700}}>{v.responses} <span style={{fontSize:11, fontWeight:500}}>откл.</span></span>
              </div>
            </div>
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

// ---- Company app shell ----
function CompanyApp({ onExit }) {
  const [tab, setTab] = useState('feed');
  const [shortlist, setShortlist] = useState([]);
  const [chat, setChat] = useState(null);

  const addToShortlist = (cand) => setShortlist(s => s.find(x=>x.id===cand.id) ? s : [...s, cand]);
  const writeTo = (cand) => { addToShortlist(cand); setChat(cand); };

  const tabs = [
    { key:'feed', label:'Отклики', icon:'home' },
    { key:'create', label:'Вакансия', plus:true },
    { key:'contacts', label:'Контакты', icon:'contacts' },
    { key:'profile', label:'Профиль', icon:'user', fillable:true },
  ];

  return (
    <div className="screen" style={{background:'var(--bg)'}}>
      {!chat && <StatusBar />}
      <div className="content">
        {tab==='feed' && <CandidateFeed onShortlist={addToShortlist} onWrite={writeTo} />}
        {tab==='create' && <CreateVacancy onPublished={()=>setTab('feed')} />}
        {tab==='contacts' && <Contacts shortlist={shortlist} openChat={setChat} />}
        {tab==='profile' && <CompanyProfile onExit={onExit} />}
        {chat && <MiniChat cand={chat} onBack={()=>{ setChat(null); setTab('contacts'); }} />}
      </div>
      {!chat && <TabBar tabs={tabs} active={tab} onChange={setTab} />}
    </div>
  );
}

Object.assign(window, { CompanyApp });
