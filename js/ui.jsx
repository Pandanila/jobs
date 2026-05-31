const { useState, useEffect, useRef, useCallback } = React;

// ======================= ICONS =======================
const PATHS = {
  heart:   <path d="M12 20.5S3.5 14.8 3.5 8.9A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 8.5 2.3c0 5.9-8.5 11.6-8.5 11.6Z" />,
  reply:   <g><path d="M9 14 4 9l5-5" /><path d="M4 9h9a7 7 0 0 1 7 7v3" /></g>,
  star:    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />,
  check:   <path d="M4 12.5 9.5 18 20 6.5" />,
  cross:   <g><path d="M6 6l12 12" /><path d="M18 6 6 18" /></g>,
  mail:    <g><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></g>,
  camera:  <g><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1L9 4h6l1.5 2h1A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5Z" /><circle cx="12" cy="12.5" r="3.2" /></g>,
  play:    <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  home:    <g><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v10h12V10" /></g>,
  list:    <g><path d="M8 7h12M8 12h12M8 17h12" /><circle cx="4" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="17" r="1.2" fill="currentColor" stroke="none"/></g>,
  user:    <g><circle cx="12" cy="8" r="4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></g>,
  plus:    <g><path d="M12 5v14M5 12h14" /></g>,
  contacts:<g><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="10" r="2.4"/><path d="M8 17a4 4 0 0 1 8 0"/></g>,
  back:    <path d="M15 5l-7 7 7 7" />,
  send:    <path d="M4.5 12 20 4.5 14.5 20l-3.2-6.3L4.5 12Z" />,
  pin:     <g><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></g>,
  upload:  <g><path d="M12 16V5"/><path d="m7 9 5-4 5 4"/><path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"/></g>,
  flip:    <g><path d="M3 7h13l-3-3M21 17H8l3 3"/></g>,
  spark:   <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z" />,
};

function Icon({ name, size=24, fill=false, stroke=2, style }) {
  const node = PATHS[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style}>
      {fill ? React.cloneElement(node, { stroke: 'none' }) : node}
    </svg>
  );
}

// ======================= GRADIENT PLACEHOLDER =======================
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return `rgb(${r},${g},${b})`;
}
function gradientFor(color, seed=0) {
  const a = 30 + seed * 47;
  return `
    radial-gradient(120% 90% at 78% 12%, ${shade(color, 55)} 0%, transparent 52%),
    radial-gradient(110% 110% at 12% 92%, ${shade(color, -10)} 0%, transparent 60%),
    linear-gradient(${a}deg, ${shade(color, -55)} 0%, ${color} 48%, ${shade(color, -35)} 100%)`;
}

// A 9:16 video-stand-in with grain + soft "person" silhouette
function VideoPlaceholder({ color, seed=0, children, style, label, src }) {
  return (
    <div style={{
      position:'absolute', inset:0,
      background: src ? `url(${src}) center / cover no-repeat` : gradientFor(color, seed),
      overflow:'hidden', ...style,
    }}>
      {!src && (
        <div style={{
          position:'absolute', left:'50%', bottom:'-6%', transform:'translateX(-50%)',
          width:'76%', aspectRatio:'1/1.35',
          background:`radial-gradient(50% 32% at 50% 22%, ${shade(color,70)} 0%, transparent 60%),
                      radial-gradient(60% 50% at 50% 90%, ${shade(color,30)} 0%, transparent 60%)`,
          filter:'blur(6px)', opacity:0.85,
        }} />
      )}

      {src && (
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.02) 42%, rgba(0,0,0,0.16) 100%)',
        }} />
      )}

      <div style={{
        position:'absolute', inset:0, opacity:0.10, mixBlendMode:'overlay',
        backgroundImage:'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1.1px)',
        backgroundSize:'4px 4px',
      }} />

      {label && (
        <div style={{
          position:'absolute', top:150, left:16, fontSize:11, fontWeight:700,
          letterSpacing:'0.12em', textTransform:'uppercase',
          color:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center', gap:6,
          textShadow:'0 1px 6px rgba(0,0,0,0.7)',
        }}>
          <span style={{width:7,height:7,borderRadius:99,background:'#FF3B30',display:'inline-block',
            boxShadow:'0 0 8px #FF3B30'}} /> видео
        </div>
      )}

      {children}
    </div>
  );
}

// ======================= AVATAR / LOGO =======================
function LogoCircle({ color, letter, size=44 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'30%', flexShrink:0,
      background: gradientFor(color, 0.3),
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'Unbounded',sans-serif", fontWeight:800,
      fontSize:size*0.42, color:'#fff',
      boxShadow:`0 4px 14px -4px ${color}aa`,
    }}>{letter}</div>
  );
}
function Avatar({ color, initials, size=44, accent=false }) {
  const dark = accent;
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', flexShrink:0,
      background: accent ? 'var(--accent)' : gradientFor(color, 0.6),
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'Unbounded',sans-serif", fontWeight:700,
      fontSize:size*0.38, color: dark ? '#0A0A0A' : '#fff',
      boxShadow: accent ? '0 6px 22px -6px rgba(191,255,0,0.6)' : `0 4px 14px -4px ${color}aa`,
    }}>{initials}</div>
  );
}

// ======================= STATUS BAR =======================
function StatusBar({ tint='#fff' }) {
  return (
    <div className="statusbar" style={{ color: tint }}>
      <span style={{fontVariantNumeric:'tabular-nums'}}>9:41</span>
      <div className="dots">
        <div className="bars">
          <i style={{height:5}} /><i style={{height:7}} /><i style={{height:9}} /><i style={{height:12}} />
        </div>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" style={{marginLeft:2}}>
          <path d="M8.5 3.5C10.6 3.5 12.5 4.3 14 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M5 6.6C6 5.8 7.2 5.4 8.5 5.4s2.5.4 3.5 1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="8.5" cy="9" r="1.2" fill="currentColor"/>
        </svg>
        <div style={{
          width:24,height:12,border:'1.6px solid currentColor',borderRadius:3,
          padding:1.5,display:'flex',opacity:0.95,position:'relative',
        }}>
          <div style={{flex:1,background:'currentColor',borderRadius:1}} />
          <div style={{position:'absolute',right:-3,top:3.5,width:2,height:5,
            background:'currentColor',borderRadius:1}} />
        </div>
      </div>
    </div>
  );
}

// ======================= TAB BAR =======================
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      flexShrink:0, height:74, background:'rgba(10,10,10,0.92)',
      backdropFilter:'blur(18px)', borderTop:'1px solid var(--border)',
      display:'flex', alignItems:'stretch', paddingBottom:8,
    }}>
      {tabs.map(t => {
        const on = t.key === active;
        const isPlus = t.plus;
        if (isPlus) {
          return (
            <button key={t.key} onClick={()=>onChange(t.key)} style={{
              flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:4,
            }}>
              <div style={{
                width:46,height:46,borderRadius:16,marginTop:-14,
                background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',
                color:'#0A0A0A',boxShadow:'0 8px 22px -6px rgba(191,255,0,0.7)',
              }}><Icon name="plus" size={26} stroke={2.6} /></div>
              <span style={{fontSize:10.5,fontWeight:700,color: on?'var(--accent)':'var(--muted)'}}>{t.label}</span>
            </button>
          );
        }
        return (
          <button key={t.key} onClick={()=>onChange(t.key)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:5, color: on ? 'var(--accent)' : 'var(--muted)',
            transition:'color 200ms',
          }}>
            <Icon name={t.icon} size={24} fill={on && t.fillable} stroke={on?2.4:2} />
            <span style={{fontSize:10.5,fontWeight:700}}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ======================= CHIP =======================
function Chip({ active, children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      padding:'9px 16px', borderRadius:999, fontSize:13.5, fontWeight:700,
      whiteSpace:'nowrap', flexShrink:0, transition:'all 180ms',
      background: active ? 'var(--accent)' : 'rgba(255,255,255,0.07)',
      color: active ? '#0A0A0A' : 'var(--text)',
      border:`1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      ...style,
    }}>{children}</button>
  );
}

// Accent CTA button
function CTA({ children, onClick, disabled, glow, style }) {
  return (
    <button onClick={onClick} disabled={disabled} className={glow ? 'glow' : ''} style={{
      width:'100%', padding:'17px', borderRadius:18, fontSize:16, fontWeight:800,
      fontFamily:"'Manrope',sans-serif",
      background: disabled ? '#2a2a2a' : 'var(--accent)',
      color: disabled ? '#666' : '#0A0A0A',
      transition:'transform 120ms, opacity 200ms',
      ...style,
    }}
    onPointerDown={e=>{ if(!disabled) e.currentTarget.style.transform='scale(0.97)'; }}
    onPointerUp={e=>{ e.currentTarget.style.transform='scale(1)'; }}
    onPointerLeave={e=>{ e.currentTarget.style.transform='scale(1)'; }}
    >{children}</button>
  );
}

Object.assign(window, {
  Icon, VideoPlaceholder, LogoCircle, Avatar, StatusBar, TabBar, Chip, CTA,
  gradientFor, shade,
});
