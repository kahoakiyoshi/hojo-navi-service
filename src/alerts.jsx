import React, { useState } from 'react';
import { MOCK_ALERTS } from './data';
import { StatusBadge, ChannelIco } from './ui';

export const Alerts = ({ onOpenDetail, isMobile }) => {
  const [tab, setTab] = useState("all");
  let items = MOCK_ALERTS;
  if (tab !== "all") items = items.filter(a => a.type === tab);

  return (
    <div style={{ padding: isMobile ? "24px 22px 80px" : "36px 56px 60px" }}>
      <div className="between" style={{ marginBottom: 22, alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Alerts · Inbox</div>
          <h1 className="display" style={{ fontSize: isMobile ? 26 : 36, margin: 0, fontWeight: 600, letterSpacing: "-0.015em" }}>
            アラート
          </h1>
          <div className="muted sm" style={{ marginTop: 8 }}>
            公募前 · 締切間近 · 新規マッチの通知一覧
          </div>
        </div>
        <button className="btn btn-ghost btn-sm">通知設定</button>
      </div>

      <div className="row" style={{ gap: 0, marginBottom: 28, borderBottom: "1px solid var(--line-ink)" }}>
        {[
          { id: "all", l: "すべて", n: MOCK_ALERTS.length },
          { id: "pre_open", l: "公募前", n: MOCK_ALERTS.filter(a => a.type === "pre_open").length },
          { id: "deadline_near", l: "締切間近", n: MOCK_ALERTS.filter(a => a.type === "deadline_near").length },
          { id: "condition_match", l: "新規マッチ", n: MOCK_ALERTS.filter(a => a.type === "condition_match").length },
        ].map(tt => (
          <button key={tt.id} onClick={() => setTab(tt.id)} style={{
            padding: "12px 22px 14px",
            color: tab === tt.id ? "var(--ink)" : "var(--ink-3)",
            borderBottom: "2px solid " + (tab === tt.id ? "var(--ink)" : "transparent"),
            marginBottom: -1,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: tab === tt.id ? 600 : 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            {tt.l}
            <span className="num muted-2" style={{ fontSize: 10 }}>({String(tt.n).padStart(2, "0")})</span>
          </button>
        ))}
      </div>

      <div>
        {items.map((a, i) => {
          const typeColor =
            a.type === "pre_open" ? "var(--amber)" :
              a.type === "deadline_near" ? "var(--crimson)" : "var(--ink)";
          return (
            <div key={a.id} style={{
              padding: "20px 0",
              borderBottom: "1px solid var(--line)",
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "60px 1fr 200px 24px",
              gap: 24, alignItems: "start",
              borderTop: i === 0 ? "1px solid var(--line)" : 0
            }} onClick={() => onOpenDetail(a.subsidyId)}>
              <div className="num muted-2" style={{ fontSize: 11, letterSpacing: "0.04em" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                  <span className="eyebrow" style={{ color: typeColor, fontWeight: 600 }}>{a.typeLabel}</span>
                  <ChannelIco channel={a.channel} />
                  {!a.read && <span className="num" style={{ fontSize: 9, color: "var(--amber)", letterSpacing: "0.1em" }}>NEW</span>}
                </div>
                <div className="serif" style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{a.subsidyName}</div>
                <div className="muted sm" style={{ lineHeight: 1.7, maxWidth: 560 }}>{a.body}</div>
              </div>
              <div className="num muted-2" style={{ fontSize: 11, textAlign: "right" }}>
                {a.receivedAt}
              </div>
              <div className="muted" style={{ fontSize: 14, textAlign: "right" }}>→</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "28px 0 0", marginTop: 28, borderTop: "1px solid var(--line-ink)" }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>通知設定 — Notification Preferences</div>
        <div>
          {[
            { l: "公募前アラート", d: "パブコメ・予算動向から開始予測", on: true },
            { l: "締切間近アラート", d: "ウォッチ補助金の 14 / 7 / 3 日前", on: true },
            { l: "新規マッチアラート", d: "条件にマッチする新補助金", on: false },
          ].map((s, i) => (
            <div key={i} className="between" style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <div>
                <div className="serif" style={{ fontSize: 15, fontWeight: 600 }}>{s.l}</div>
                <div className="muted sm" style={{ marginTop: 2 }}>{s.d}</div>
              </div>
              <div style={{
                width: 38, height: 22,
                background: s.on ? "var(--ink)" : "var(--line-strong)",
                position: "relative", cursor: "pointer", transition: "background 200ms"
              }}>
                <div style={{
                  position: "absolute", top: 2, left: s.on ? 18 : 2,
                  width: 18, height: 18, background: "var(--bg-elev)",
                  transition: "left 200ms"
                }} />
              </div>
            </div>
          ))}
        </div>
        <div className="row" style={{ gap: 12, marginTop: 18 }}>
          <span className="eyebrow">配信先</span>
          <ChannelIco channel="line" />
          <ChannelIco channel="email" />
          <button className="btn-link tiny">変更</button>
        </div>
      </div>
    </div>
  );
};
