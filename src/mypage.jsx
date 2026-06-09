import React, { useState, useEffect } from 'react';
import { MOCK_COMPANY, MOCK_ALERTS, MOCK_EXPERTS } from './data';
import { StatusBadge } from './ui';
import { fetchSubsidies } from './services/db';

export const MyPage = ({ onOpenDetail, onNav, isMobile, onLogout, watchlist = [], isPremium, membershipStatus, onUpgrade }) => {
  const c = MOCK_COMPANY;
  const unread = MOCK_ALERTS.filter(a => !a.read).length;
  const [watched, setWatched] = useState([]);
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);

  useEffect(() => {
    fetchSubsidies().then(list => setWatched(list.filter(s => watchlist.includes(s.id)).slice(0, 4)));
  }, [watchlist]);

  const handleUpgradeClick = async () => {
    setLoadingUpgrade(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    await onUpgrade();
    setLoadingUpgrade(false);
  };

  return (
    <div style={{ background: "var(--bg)", paddingBottom: 60 }}>
      {/* Editorial masthead */}
      <div style={{
        padding: isMobile ? "24px 22px 22px" : "36px 56px 28px",
        borderBottom: "1px solid var(--line-ink)",
      }}>
        <div className="between" style={{ alignItems: "flex-start" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })} · おはようございます
            </div>
            <h1 className="display" style={{
              fontSize: isMobile ? 26 : 38,
              margin: "0 0 8px",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              lineHeight: 1.25
            }}>
              {c.name || "未設定"} <em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>様</em>
            </h1>
          </div>
          
          <div style={{ marginTop: 8 }}>
            <span className="badge" style={{
              color: isPremium ? "var(--emerald)" : "var(--amber)",
              borderColor: isPremium ? "var(--emerald)" : "var(--amber)",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: "bold"
            }}>
              {isPremium ? "プレミアム会員" : "無料プラン"}
            </span>
          </div>
        </div>
        <div className="muted sm">{c.industry || "未設定"} · {c.employeeCount != null ? `${c.employeeCount} 名` : "未設定"} · {c.prefecture || "未設定"}</div>
      </div>

      {/* Stats row */}
      <div style={{
        padding: isMobile ? "20px 22px" : "28px 56px",
        borderBottom: "1px solid var(--line)",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: 0,
      }}>
        {[
          { l: "マッチ補助金", v: "10", u: "件", to: "USR-04" },
          { l: "ウォッチ中", v: String(watchlist.length).padStart(2, "0"), u: "件", to: "USR-10" },
          { l: "未読アラート", v: String(unread).padStart(2, "0"), u: "件", to: "USR-09", hot: true },
          { l: "申請準備中", v: "01", u: "件", to: "USR-07" },
        ].map((s, i) => (
          <div key={i} onClick={() => onNav(s.to)} style={{
            cursor: "pointer",
            paddingLeft: i ? 24 : 0,
            borderLeft: i ? "1px solid var(--line)" : 0
          }}>
            <div className="eyebrow" style={{ marginBottom: 10, color: s.hot ? "var(--amber)" : undefined }}>{s.l}</div>
            <div className="num" style={{
              fontSize: isMobile ? 32 : 42,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: s.hot ? "var(--amber)" : "var(--ink)"
            }}>
              {s.v}<span style={{ fontSize: 12, color: "var(--ink-4)", marginLeft: 4, fontWeight: 500, letterSpacing: 0 }}>{s.u}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: isMobile ? "22px 22px 0" : "32px 56px 0" }}>
        {/* Important alert callout */}
        <div className="fade-in" style={{
          padding: "20px 22px",
          marginBottom: 32,
          borderLeft: "3px solid var(--amber)",
          background: "var(--bg-inset)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16, alignItems: "center"
        }}>
          <div>
            <div className="eyebrow eyebrow-amber" style={{ marginBottom: 6 }}>公募前アラート · 予測</div>
            <div className="serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
              <em style={{ fontStyle: "italic" }}>新事業進出補助金</em> が間もなく公募開始
            </div>
            <div className="muted sm" style={{ lineHeight: 1.6 }}>
              予算動向 từ <span className="num bold" style={{ color: "var(--ink)" }}>49 日後</span> の公募開始を予測。事業計画書の準備を今から始めると間に合います。
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => onOpenDetail("shinjigyo-2026")}>詳細 →</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 36 }}>
          <div>
            <div className="section-head">
              <h3>ウォッチ中の補助金</h3>
              <button className="btn-link sm" onClick={() => onNav("USR-10")}>全件 ({watchlist.length}) →</button>
            </div>
            <div>
              {watched.length === 0 ? (
                <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)", color: "var(--ink-4)", fontSize: 13 }}>
                  現在ウォッチ中の補助金はありません。
                </div>
              ) : watched.map((s, i) => (
                <div key={s.id} style={{
                  padding: "16px 0",
                  borderBottom: "1px solid var(--line)",
                  display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 18, alignItems: "center",
                  cursor: "pointer"
                }} onClick={() => onOpenDetail(s.id)}>
                  <div className="num" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.score}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="serif" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{s.name}</div>
                    <div className="row" style={{ gap: 8 }}>
                      <StatusBadge status={s.status} />
                      <span className="muted-2 num" style={{ fontSize: 11 }}>
                        {s.status === "pre" ? `${s.preOpenInDays} 日後` : s.daysLeft > 0 ? `あと ${s.daysLeft} 日` : "終了"}
                      </span>
                    </div>
                  </div>
                  <span className="muted">→</span>
                </div>
              ))}
            </div>

            <div className="section-head" style={{ marginTop: 36 }}>
              <h3>申請進捗</h3>
            </div>
            <div style={{ padding: "20px 0", borderBottom: "1px solid var(--line)" }}>
              <div className="between" style={{ marginBottom: 18 }}>
                <div>
                  <div className="serif" style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>IT導入補助金 2026</div>
                  <div className="muted sm">準備中 · 締切まで <span className="num">38 日</span></div>
                </div>
                <span className="badge badge-pre">準備中</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginBottom: 14 }}>
                {[
                  { l: "GBizID", done: true },
                  { l: "計画書", done: true },
                  { l: "見積書", done: true },
                  { l: "申請入力", done: false, now: true },
                  { l: "結果通知", done: false },
                ].map((p, i) => (
                  <div key={i}>
                    <div style={{
                      height: 2,
                      background: p.done ? "var(--ink)" : p.now ? "var(--ink-3)" : "var(--line)",
                    }} />
                    <div className="eyebrow" style={{
                      marginTop: 8,
                      fontSize: 9.5,
                      color: p.done ? "var(--ink)" : p.now ? "var(--ink)" : "var(--ink-4)",
                      fontWeight: p.now ? 600 : 500
                    }}>
                      <span className="num muted-2" style={{ marginRight: 4 }}>0{i + 1}</span>{p.l}
                    </div>
                  </div>
                ))}
              </div>
              <div className="between" style={{ marginTop: 14 }}>
                <span className="muted sm">次のタスク — <strong style={{ color: "var(--ink)" }}>Jグランツで申請入力</strong></span>
                <button className="btn btn-ghost btn-sm">進捗を更新</button>
              </div>
            </div>
          </div>

          <aside className="col" style={{ gap: 36 }}>
            {/* Membership card */}
            <div style={{
              background: isPremium ? "var(--bg-elev)" : "var(--amber-soft)",
              border: isPremium ? "1px solid var(--line)" : "1px solid var(--amber)",
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}>
              <div className="between">
                <span className="eyebrow" style={{ color: isPremium ? "var(--emerald)" : "var(--amber-ink)", fontWeight: "bold" }}>
                  会員プラン
                </span>
                <span className="badge" style={{
                  color: isPremium ? "var(--emerald)" : "var(--amber)",
                  borderColor: isPremium ? "var(--emerald)" : "var(--amber)"
                }}>
                  {isPremium ? "プレミアム" : "無料会員"}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
                {isPremium ? (
                  "プレミアム会員の全ての機能（AIアシスタント、専門家相談等）をご利用いただけます。"
                ) : (
                  "AIアシスタント・専門家相談などの機能が制限されています。アップグレードしてすべての機能をご利用ください。"
                )}
              </div>
              {!isPremium && (
                <button
                  className="btn btn-amber btn-block"
                  style={{ fontWeight: "bold", fontSize: 13 }}
                  onClick={handleUpgradeClick}
                  disabled={loadingUpgrade}
                >
                  {loadingUpgrade ? "処理中..." : "Stripe で購読する →"}
                </button>
              )}
            </div>

            {/* Company card */}
            <div>
              <div className="section-head">
                <h3 style={{ fontSize: 14 }}>登録会社情報</h3>
                <button className="btn-link sm" onClick={() => onNav("USR-08")}>編集</button>
              </div>
              <div className="col" style={{ gap: 0 }}>
                {[
                  ["業種", c.industry || "未設定"],
                  ["従業員数", c.employeeCount != null ? `${c.employeeCount} 名` : "未設定"],
                  ["所在地", c.prefecture || "未設定"],
                  ["売上", c.revenueLabel || "未設定"],
                  ["設立", c.established || "未設定"],
                ].map(([l, v], i) => (
                  <div key={i} className="between" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                    <span className="eyebrow" style={{ fontSize: 9.5 }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 14 }} onClick={() => onNav("USR-01")}>
                最新情報で再診断
              </button>
              <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8, color: "var(--crimson)" }} onClick={onLogout}>
                ログアウト
              </button>
            </div>

            {/* Recent alerts */}
            <div>
              <div className="section-head">
                <h3 style={{ fontSize: 14 }}>最近のアラート</h3>
                <button className="btn-link sm" onClick={() => onNav("USR-09")}>全件</button>
              </div>
              <div>
                {MOCK_ALERTS.slice(0, 3).map((a, i) => (
                  <div key={a.id} style={{
                    padding: "12px 0",
                    borderBottom: "1px solid var(--line)"
                  }}>
                    <div className="row" style={{ gap: 10, marginBottom: 4 }}>
                      <span className="eyebrow" style={{
                        fontSize: 9,
                        color: a.type === "pre_open" ? "var(--amber)" :
                          a.type === "deadline_near" ? "var(--crimson)" : "var(--ink-3)"
                      }}>{a.typeLabel}</span>
                      {!a.read && <span className="num muted-2 tiny">NEW</span>}
                    </div>
                    <div className="serif sm bold" style={{ marginBottom: 2 }}>{a.subsidyName}</div>
                    <div className="muted tiny" style={{ lineHeight: 1.6 }}>{a.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
