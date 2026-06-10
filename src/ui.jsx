import React from 'react';

// ------- Icons (minimal stroke set, hand-crafted) -------
export const Ico = ({ name, size = 16, className = "" }) => {
  const sw = 1.7;
  const map = {
    search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
    bell:   <><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8z" /><path d="M10 21a2 2 0 004 0" /></>,
    user:   <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>,
    home:   <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
    chart:  <><path d="M4 19V5" /><path d="M9 19V9" /><path d="M14 19v-6" /><path d="M19 19V3" /></>,
    spark:  <><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2" /></>,
    chat:   <><path d="M4 5h16v11H8l-4 4z" /></>,
    star:   <><path d="M12 3l2.7 6.1 6.6.6-5 4.6 1.5 6.5L12 17.5 6.2 20.8l1.5-6.5-5-4.6 6.6-.6z" /></>,
    starF:  <><path d="M12 3l2.7 6.1 6.6.6-5 4.6 1.5 6.5L12 17.5 6.2 20.8l1.5-6.5-5-4.6 6.6-.6z" fill="currentColor" /></>,
    bookmark: <><path d="M6 3h12v18l-6-4-6 4z" /></>,
    bookmarkF: <><path d="M6 3h12v18l-6-4-6 4z" fill="currentColor" /></>,
    arrow:  <><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></>,
    arrowL: <><path d="M19 12H5" /><path d="M11 5l-7 7 7 7" /></>,
    check:  <><path d="M5 12l4 4 10-10" /></>,
    x:      <><path d="M5 5l14 14" /><path d="M19 5L5 19" /></>,
    plus:   <><path d="M12 5v14M5 12h14" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 010-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 014 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 010 4h-.1a1.6 1.6 0 00-1.5 1z" /></>,
    sparkle: <><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M19 14l.6 1.6L21 16l-1.4.4L19 18l-.6-1.6L17 16l1.4-.4z" /></>,
    clock:  <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    cal:    <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    file:   <><path d="M14 3H6v18h12V8z" /><path d="M14 3v5h4" /></>,
    yen:    <><path d="M7 4l5 8 5-8" /><path d="M5 14h14M5 18h14M12 12v9" /></>,
    line:   <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M7 11h2M11 9v4M11 9l3 4V9M15 9h2v4h-2zM15 11h2" strokeWidth="1.4" /></>,
    mail:   <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
    chevR:  <><path d="M9 5l7 7-7 7" /></>,
    chevD:  <><path d="M5 9l7 7 7-7" /></>,
    filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
    grid:   <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    list:   <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="0.8" fill="currentColor" /><circle cx="4" cy="12" r="0.8" fill="currentColor" /><circle cx="4" cy="18" r="0.8" fill="currentColor" /></>,
    info:   <><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></>,
    warn:   <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></>,
    bolt:   <><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></>,
    company:<><rect x="4" y="4" width="16" height="17" /><path d="M4 9h16M9 13h2M13 13h2M9 17h2M13 17h2" /></>,
    google: <><path d="M21 12.2c0-.7-.1-1.3-.2-2H12v3.8h5.1c-.2 1.2-.9 2.2-1.9 2.9v2.4h3c1.8-1.6 2.8-4 2.8-7.1z" fill="#4285F4" stroke="none" /><path d="M12 21c2.5 0 4.7-.8 6.2-2.3l-3-2.4c-.8.6-1.9.9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H3.6v2.5C5.1 18.9 8.3 21 12 21z" fill="#34A853" stroke="none" /><path d="M6.7 13.3c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.2H3.6C2.6 8.6 2 10.2 2 12s.6 3.4 1.6 4.8z" fill="#FBBC04" stroke="none" /><path d="M12 6.4c1.4 0 2.6.5 3.6 1.4l2.7-2.7C16.7 3.5 14.5 2.6 12 2.6 8.3 2.6 5.1 4.7 3.6 7.7l3.1 2.5C7.4 8 9.5 6.4 12 6.4z" fill="#EA4335" stroke="none" /></>,
    log:    <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></>,
    refresh:<><path d="M3 12a9 9 0 0115-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 01-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
    arrowU: <><path d="M12 19V5M5 12l7-7 7 7" /></>,
    arrowD: <><path d="M12 5v14M5 12l7 7 7-7" /></>,
    minus:  <><path d="M5 12h14" /></>,
    folder: <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></>,
    download: <><path d="M12 3v14M5 12l7 7 7-7M5 21h14" /></>,
    upload: <><path d="M12 19V5M5 12l7-7 7 7" /></>,
    light:  <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></>,
    dark:   <><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></>,
    desk:   <><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M9 20h6M12 16v4" /></>,
    phone:  <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>,
    speech: <><path d="M3 5h18v12H8l-4 4z" /><path d="M8 10h6M8 13h4" /></>,
    chip:   <><rect x="6" y="6" width="12" height="12" rx="1" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
    pdf:    <><path d="M6 3h9l5 5v13H6z" /><path d="M14 3v5h5" /><path d="M9 14h1.5a1.5 1.5 0 010 3H9zM14 14h2v3M14 14v3" strokeWidth="1.2" /></>,
    eye:    <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 6.1A11 11 0 0112 6c6 0 10 7 10 7a17 17 0 01-3.4 4.4M6.6 6.6A17 17 0 002 13s4 7 10 7c1.7 0 3.2-.4 4.4-1" /><path d="M9.9 9.9a3 3 0 004.2 4.2" /></>,
    send:   <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></>,
    handoff:<><path d="M8 12h12M8 12l4-4M8 12l4 4" /><path d="M4 4v16" /></>,
    sliders:<><path d="M4 6h12M4 12h7M4 18h16" /><circle cx="18" cy="6" r="2" /><circle cx="14" cy="12" r="2" /></>,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {map[name] || null}
    </svg>
  );
};

// ------- Status badge — flat mono caps -------
export const StatusBadge = ({ status }) => {
  if (status === "open")   return <span className="badge badge-open">公募中</span>;
  if (status === "pre")    return <span className="badge badge-pre">公募前</span>;
  if (status === "closed") return <span className="badge badge-closed">終了</span>;
  return <span className="badge badge-neutral">{status}</span>;
};

// ------- Score: editorial big-number, no ring -------
export const ScoreRing = ({ score, size = 56 }) => {
  // Editorial: large numeric, mono SCORE label, no decorative ring
  const big = size >= 60 ? 32 : size >= 42 ? 22 : 18;
  const sub = size >= 60 ? 10 : 9;
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      lineHeight: 1,
      width: size,
      flexShrink: 0
    }}>
      <div className="num" style={{
        fontSize: big,
        fontWeight: 600,
        letterSpacing: "-0.04em",
        color: "var(--ink)"
      }}>{score}</div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: sub,
        color: "var(--ink-4)",
        letterSpacing: "0.12em",
        fontWeight: 500,
        marginTop: 4,
        textTransform: "uppercase"
      }}>Score</div>
    </div>
  );
};

// ------- Channel — mono caps -------
export const ChannelIco = ({ channel }) => {
  const label = channel === "line" ? "LINE" : channel === "email" ? "Email" : "App";
  return (
    <span className="badge badge-neutral" style={{ borderColor: "var(--line-strong)" }}>{label}</span>
  );
};

// ------- Empty placeholder -------
export const Placeholder = ({ label, h = 120 }) => (
  <div style={{
    height: h,
    border: "1px dashed var(--line-strong)",
    borderRadius: "var(--r-md)",
    display: "grid", placeItems: "center",
    color: "var(--ink-4)",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    background: "repeating-linear-gradient(45deg, transparent 0 8px, var(--bg-soft) 8px 9px)"
  }}>
    [ {label} ]
  </div>
);

// ------- Avatar -------
export const Avatar = ({ initials, color = "var(--navy)", size = 40 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: "50%",
    background: color,
    color: "#fff",
    display: "grid", placeItems: "center",
    fontWeight: 600,
    fontSize: size * 0.36,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.02em",
    flexShrink: 0
  }}>{initials}</div>
);

// ------- Mobile status bar -------
export const MobileStatus = ({ time = "9:41", dark = false }) => (
  <div className="statusbar" style={{ color: dark ? "#fff" : "var(--ink)" }}>
    <span>{time}</span>
    <div className="statusbar-icons">
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <path d="M1 8h2v2H1zM5 6h2v4H5zM9 4h2v6H9zM13 2h2v8h-2z" fill="currentColor" />
      </svg>
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
        <path d="M7 3a4 4 0 014 1l-1 1a3 3 0 00-6 0l-1-1a4 4 0 013-1zM7 5a2 2 0 011.5.5l-1 1a1 1 0 00-1 0l-1-1A2 2 0 017 5z" fill="currentColor"/>
      </svg>
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
        <rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor" />
        <rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" />
        <rect x="19" y="3" width="2" height="4" rx="1" fill="currentColor" />
      </svg>
    </div>
  </div>
);

// ------- Bottom nav for mobile -------
export const BotNav = ({ active, onChange }) => {
  const items = [
    { id: "USR-07", l: "ホーム", i: "home" },
    { id: "USR-04", l: "検索", i: "search" },
    { id: "USR-10", l: "保存", i: "bookmarkF" },
    { id: "USR-09", l: "通知", i: "bell" },
    { id: "USR-11", l: "相談", i: "chat" },
  ];
  return (
    <div className="botnav">
      {items.map(it => (
        <button key={it.id} className={active === it.id ? "on" : ""} onClick={() => onChange(it.id)}>
          <span className="ico"><Ico name={it.i} size={20} /></span>
          {it.l}
        </button>
      ))}
    </div>
  );
};
