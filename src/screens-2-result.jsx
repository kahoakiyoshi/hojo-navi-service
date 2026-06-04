import React, { useState, useEffect } from 'react';
import { formatYen } from './data';
import { StatusBadge, ScoreRing, Ico, Placeholder } from './ui';
import { fetchSubsidies } from './services/db';

// ====== USR-04: Diagnose Result ======
export const Result = ({ company, subsidiesList: passedSubsidies, isSearching, onOpenDetail, onSwitchMode, searchMode, isMobile, watchlist = [], onToggleWatchlist }) => {
  const [sort, setSort] = useState("score");
  const [filterStatus, setFilterStatus] = useState("all");
  const [localSubsidies, setLocalSubsidies] = useState([]);

  useEffect(() => {
    if (!passedSubsidies || passedSubsidies.length === 0) {
      fetchSubsidies().then(setLocalSubsidies);
    }
  }, [passedSubsidies]);

  if (isSearching) {
    return (
      <div style={{ padding: "100px 56px", textAlign: "center", minHeight: 400, color: "var(--ink)" }}>
        <div className="thinking-dots" style={{ display: "inline-flex", gap: 6, marginBottom: 20 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "currentColor", animation: "thinking 1.4s infinite both" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "currentColor", animation: "thinking 1.4s infinite both 0.2s" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "currentColor", animation: "thinking 1.4s infinite both 0.4s" }} />
        </div>
        <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>適合する補助金を抽出しています...</div>
      </div>
    );
  }

  const subsidiesList = (passedSubsidies && passedSubsidies.length > 0) ? passedSubsidies : localSubsidies;

  let items = [...subsidiesList];
  if (filterStatus !== "all") items = items.filter(s => s.status === filterStatus);
  if (sort === "score") items.sort((a, b) => b.score - a.score);
  if (sort === "deadline") items.sort((a, b) => (a.daysLeft ?? 9999) - (b.daysLeft ?? 9999));
  if (sort === "amount") items.sort((a, b) => b.maxAmount - a.maxAmount);

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Editorial masthead */}
      <div style={{
        padding: isMobile ? "24px 22px" : "40px 56px 28px",
        borderBottom: "1px solid var(--line-ink)",
      }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>診断結果 · {new Date().toLocaleDateString("ja-JP")} 14:32 JST</div>
        <div className="between" style={{ gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
          <h1 className="display" style={{
            margin: 0,
            fontSize: isMobile ? 28 : 42,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            <span className="num" style={{ fontWeight: 600 }}>{subsidiesList.length}</span> 件の補助金が<br />
            貴社の条件に<em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>マッチ</em>しました
          </h1>
          {!isMobile && (
            <div className="cv-toggle">
              <button className={searchMode === "filter" ? "on" : ""} onClick={() => onSwitchMode("filter")}>
                Filter
              </button>
              <button className={searchMode === "chat" ? "on" : ""} onClick={() => onSwitchMode("chat")}>
                AI Chat
              </button>
            </div>
          )}
        </div>
        <div className="muted" style={{ marginTop: 14, fontSize: 13 }}>
          {company?.name || "株式会社サンプルワークス"} · {company?.industry || "ソフトウェア業"} · {company?.employeeCount || 12}名 · {company?.prefecture || "東京都"} ·{" "}
          <button className="btn-link" style={{ fontSize: 13 }}>条件を変更</button>
        </div>
      </div>

      {searchMode === "chat" && !isMobile ? (
        <AIChatSearch onOpenDetail={onOpenDetail} />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
          gap: isMobile ? 0 : 36,
          padding: isMobile ? "16px 22px 80px" : "36px 56px 64px",
        }}>
          {/* Filters (desktop) */}
          {!isMobile && (
            <aside>
              <div style={{ position: "sticky", top: 18 }}>
                <div className="eyebrow" style={{ marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--line)" }}>絞り込み — Filters</div>

                <div className="eyebrow" style={{ marginBottom: 8, fontSize: 9 }}>状態</div>
                <div className="col" style={{ gap: 0, marginBottom: 24 }}>
                  {[
                    { id: "all", l: "すべて", n: subsidiesList.length },
                    { id: "open", l: "公募中", n: subsidiesList.filter(s => s.status === "open").length },
                    { id: "pre", l: "公募前", n: subsidiesList.filter(s => s.status === "pre").length },
                    { id: "closed", l: "終了", n: 0 },
                  ].map(f => (
                    <button key={f.id} className="between" onClick={() => setFilterStatus(f.id)}
                      style={{
                        padding: "8px 0",
                        color: filterStatus === f.id ? "var(--ink)" : "var(--ink-3)",
                        fontWeight: filterStatus === f.id ? 600 : 400,
                        fontSize: 13, width: "100%",
                        borderBottom: "1px solid var(--line)"
                      }}>
                      <span>
                        {filterStatus === f.id && <span style={{ marginRight: 6 }}>—</span>}
                        {f.l}
                      </span>
                      <span className="num muted-2" style={{ fontSize: 11 }}>{String(f.n).padStart(2, "0")}</span>
                    </button>
                  ))}
                </div>

                <div className="eyebrow" style={{ marginBottom: 8, fontSize: 9 }}>カテゴリ</div>
                <div className="col" style={{ gap: 0, marginBottom: 24 }}>
                  {["DX・IT", "設備投資", "販路開拓", "事業転換", "雇用・人材", "脱炭素・省エネ", "地域"].map(c => (
                    <label key={c} className="row" style={{
                      gap: 8, fontSize: 13, cursor: "pointer",
                      padding: "7px 0",
                      borderBottom: "1px solid var(--line)",
                    }}>
                      <input type="checkbox" style={{ accentColor: "var(--ink)" }} />
                      <span style={{ flex: 1 }}>{c}</span>
                    </label>
                  ))}
                </div>

                <div className="eyebrow" style={{ marginBottom: 8, fontSize: 9 }}>並び替え</div>
                <select className="input" value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "8px 10px", fontSize: 12 }}>
                  <option value="score">スコア順</option>
                  <option value="deadline">締切順</option>
                  <option value="amount">補助額順</option>
                </select>
              </div>
            </aside>
          )}

          <div>
            {/* Mobile sort/filter pills */}
            {isMobile && (
              <div className="row" style={{ gap: 8, marginBottom: 14, overflowX: "auto" }}>
                {[
                  { id: "all", l: "すべて" },
                  { id: "open", l: "公募中" },
                  { id: "pre", l: "公募前" },
                ].map(f => (
                  <button key={f.id} className="badge" style={{
                    padding: "6px 12px",
                    color: filterStatus === f.id ? "var(--bg-elev)" : "var(--ink-3)",
                    background: filterStatus === f.id ? "var(--ink)" : "transparent",
                    borderColor: filterStatus === f.id ? "var(--ink)" : "var(--line-strong)",
                  }} onClick={() => setFilterStatus(f.id)}>{f.l}</button>
                ))}
              </div>
            )}

            <div style={{ borderBottom: "1px solid var(--line)" }}>
              {items.map((s, i) => (
                <SubsidyCard key={s.id} s={s} onClick={() => onOpenDetail(s.id)} delay={i * 30} isSaved={watchlist.includes(s.id)} onToggleWatchlist={onToggleWatchlist} />
              ))}
            </div>

            {/* Footer prompt — editorial */}
            <div style={{
              padding: "28px 4px",
              borderTop: "1px solid var(--line-ink)",
              marginTop: 0,
              display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center"
            }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>判断に迷ったら</div>
                <div className="serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 6 }}>
                  株式会社CrownStrategy JV の専門家ネットワーク
                </div>
                <div className="muted sm" style={{ lineHeight: 1.65 }}>
                  中小企業診断士・行政書士・社労士による <strong style={{ color: "var(--ink)" }}>初回 30 分無料相談</strong>。書類の準備状況から伴走支援します。
                </div>
              </div>
              <button className="btn btn-primary">相談する →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SubsidyCard = ({ s, onClick, delay = 0, isSaved, onToggleWatchlist }) => (
  <div className="fade-in" style={{
    cursor: "pointer",
    animationDelay: `${delay}ms`,
    padding: "22px 4px",
    borderTop: "1px solid var(--line)",
    transition: "background 120ms",
    position: "relative"
  }}
    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-inset)"}
    onMouseLeave={e => e.currentTarget.style.background = ""}
    onClick={onClick}>
    <div style={{ display: "grid", gridTemplateColumns: "76px 1fr 220px auto", gap: 20, alignItems: "start" }}>
      <div className="num" style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--ink)" }}>
        {s.score}
        <div className="eyebrow" style={{ marginTop: 6 }}>Score</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <StatusBadge status={s.status} />
          <span className="eyebrow">{s.category}</span>
        </div>
        <div className="serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{s.name}</div>
        <div className="muted-2" style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>{s.agency}</div>
        <div style={{ color: "var(--ink-2)", lineHeight: 1.7, fontSize: 13, maxWidth: 560 }}>{s.summary}</div>
      </div>
      <div className="col" style={{ gap: 12 }}>
        <SpecRow label="補助上限" value={formatYen(s.maxAmount)} />
        <SpecRow label="補助率" value={s.rateLabel} />
        {s.adoptionRate != null && (
          <SpecRow label="採択率" value={`${Math.round(s.adoptionRate * 100)}%`} />
        )}
        <SpecRow
          label={s.status === "pre" ? "公募開始まで" : "申請締切まで"}
          value={s.status === "pre" ? `${s.preOpenInDays} 日` : s.daysLeft > 0 ? `${s.daysLeft} 日` : "終了"}
          urgent={s.daysLeft != null && s.daysLeft <= 21}
        />
      </div>
      <div className="col" style={{ gap: 10, alignItems: "flex-end" }}>
        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); onToggleWatchlist && onToggleWatchlist(s.id); }} style={{ padding: "4px 8px" }}>
          <Ico name={isSaved ? "bookmarkF" : "bookmark"} size={11} />{isSaved ? "保存済" : "保存"}
        </button>
        <span className="muted" style={{ fontSize: 16, marginTop: 8 }}>→</span>
      </div>
    </div>
  </div>
);

export const SpecRow = ({ label, value, urgent }) => (
  <div className="between" style={{ alignItems: "baseline" }}>
    <span className="eyebrow" style={{ fontSize: 9.5 }}>{label}</span>
    <span className="num" style={{
      fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em",
      color: urgent ? "var(--crimson)" : "var(--ink)"
    }}>{value}</span>
  </div>
);

// ====== AI Chat Search variation ======
export const AIChatSearch = ({ onOpenDetail }) => {
  const [messages, setMessages] = useState([
    { r: "ai", t: "ご診断結果から、IT導入補助金2026・新事業進出補助金（公募前）・ものづくり補助金 第19次の3件が特にスコアが高くマッチしています。どちらを優先して検討されたいですか？" },
  ]);
  const [draft, setDraft] = useState("");
  const sendQ = (q) => {
    setMessages([...messages, { r: "user", t: q }]);
    setTimeout(() => {
      setMessages(m => [...m, {
        r: "ai",
        t: "「IT導入補助金 2026」は5/15に公募が始まり、締切まで残り38日です。クラウド型SaaSの導入が対象に含まれるため、貴社の予定（営業DX領域の新規プロダクト）と合致します。同じカテゴリの「東京都デジタルツール導入促進支援」と併用検討も可能ですが、IT導入補助金とは併用不可なので、補助率と上限額の比較が重要です。詳細を開きますか？",
        actions: [
          { l: "IT導入補助金の詳細", id: "it-2026" },
          { l: "東京都デジタルツールと比較", id: "tokyo-dx-2026" },
        ]
      }]);
    }, 700);
    setDraft("");
  };

  return (
    <div style={{ padding: "30px 60px 80px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
      <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", minHeight: 540 }}>
        <div className="between" style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
          <div className="row">
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "var(--navy)", color: "#fff",
              display: "grid", placeItems: "center"
            }}><Ico name="sparkle" size={14} /></div>
            <div>
              <div className="bold sm">補助金AIアシスタント</div>
              <div className="muted tiny">診断結果10件をコンテキストに保持</div>
            </div>
          </div>
          <span className="badge badge-open"><span className="dot" />接続中</span>
        </div>
        <div style={{ flex: 1, padding: 18, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((m, i) => (
            <div key={i} className="fade-in" style={{
              display: "flex",
              justifyContent: m.r === "user" ? "flex-end" : "flex-start"
            }}>
              <div style={{
                maxWidth: "78%",
                padding: "12px 16px",
                borderRadius: 14,
                background: m.r === "user" ? "var(--navy)" : "var(--bg-soft)",
                color: m.r === "user" ? "#fff" : "var(--ink)",
                fontSize: 14,
                lineHeight: 1.65
              }}>
                {m.t}
                {m.actions && (
                  <div className="row" style={{ marginTop: 12, gap: 6, flexWrap: "wrap" }}>
                    {m.actions.map(a => (
                      <button key={a.l} className="btn btn-ghost btn-sm"
                        onClick={() => onOpenDetail(a.id)}>
                        {a.l}<Ico name="arrow" size={12} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 14, borderTop: "1px solid var(--line)" }}>
          <div className="row" style={{ gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {["採択率が高い順に並べて", "申請書類が少ない補助金は？", "公募前の補助金だけ見せて"].map(q => (
              <button key={q} className="btn btn-ghost btn-sm" onClick={() => sendQ(q)} style={{ fontWeight: 400 }}>
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); if (draft.trim()) sendQ(draft); }} className="row" style={{ gap: 8 }}>
            <input className="input" placeholder="補助金について質問する..." value={draft} onChange={e => setDraft(e.target.value)} />
            <button className="btn btn-primary"><Ico name="send" size={14} /></button>
          </form>
        </div>
      </div>

      <aside className="col" style={{ gap: 14 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="bold sm" style={{ marginBottom: 10 }}>あなたへの推奨 TOP 3</div>
          {subsidiesList.slice(0, 3).map(s => (
            <div key={s.id} className="row" style={{
              gap: 10, padding: "10px 0",
              borderTop: "1px solid var(--line)",
              cursor: "pointer"
            }} onClick={() => onOpenDetail(s.id)}>
              <ScoreRing score={s.score} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sm bold" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                <StatusBadge status={s.status} />
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 16, background: "var(--amber-soft)", borderColor: "var(--amber)" }}>
          <div className="row" style={{ gap: 8, marginBottom: 6 }}>
            <Ico name="sparkle" size={14} style={{ color: "var(--amber-ink)" }} />
            <div className="bold sm" style={{ color: "var(--amber-ink)" }}>申請書ドラフト</div>
          </div>
          <div className="sm" style={{ color: "var(--amber-ink)", marginBottom: 10, lineHeight: 1.6 }}>
            選択した補助金の事業計画書ドラフトをAIで生成できます
          </div>
          <button className="btn btn-amber btn-sm btn-block">ドラフトを生成<Ico name="arrow" size={12} /></button>
        </div>
      </aside>
    </div>
  );
};

// ====== USR-05: Subsidy Detail ======
export const SubsidyDetail = ({ subsidyId, subsidiesList, onBack, onConsult, isMobile, watchlist = [], onToggleWatchlist }) => {
  const [s, setS] = useState(null);
  const [tab, setTab] = useState("overview");

  const isSaved = watchlist.includes(subsidyId);

  useEffect(() => {
    if (subsidiesList && subsidiesList.length > 0) {
      const found = subsidiesList.find(x => x.id === subsidyId);
      if (found) {
        setS(found);
        return;
      }
    }
    fetchSubsidies().then(list => {
      const found = list.find(x => x.id === subsidyId) || list[0];
      setS(found);
    });
  }, [subsidyId, subsidiesList]);

  if (!s) return <div style={{ padding: 60, color: "var(--ink-4)" }}>読み込み中...</div>;

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? "18px 22px" : "32px 56px 36px",
        borderBottom: "1px solid var(--line-ink)",
      }}>
        <button className="btn-link sm" onClick={onBack} style={{ marginBottom: 18, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ← 診断結果に戻る
        </button>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: 18, alignItems: "start" }}>
          <div>
            <div className="row" style={{ gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <StatusBadge status={s.status} />
              <span className="eyebrow">{s.category}</span>
              <span className="eyebrow">ID — {s.id.toUpperCase()}</span>
            </div>
            <h1 className="display" style={{
              fontSize: isMobile ? 26 : 38,
              lineHeight: 1.25,
              fontWeight: 600,
              margin: "0 0 12px",
              letterSpacing: "-0.015em"
            }}>{s.name}</h1>
            <div className="muted" style={{ fontSize: 13 }}>{s.agency}</div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => onToggleWatchlist && onToggleWatchlist(subsidyId)}>
              <Ico name={isSaved ? "bookmarkF" : "bookmark"} size={12} />
              {isSaved ? "保存済" : "保存"}
            </button>
            <button className="btn btn-primary" onClick={onConsult}>
              専門家に相談 →
            </button>
          </div>
        </div>
      </div>

      {/* Stat row — editorial */}
      <div style={{
        padding: isMobile ? "24px 22px" : "32px 56px",
        borderBottom: "1px solid var(--line-ink)",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)",
        gap: 0
      }}>
        {[
          { l: "Match Score", v: s.score, u: "/ 100", main: true },
          { l: "補助上限", v: formatYen(s.maxAmount), u: "" },
          { l: "補助率", v: s.rateLabel, u: "" },
          { l: "採択率", v: s.adoptionRate ? Math.round(s.adoptionRate * 100) : "—", u: s.adoptionRate ? "%" : "" },
          {
            l: s.status === "pre" ? "公募開始まで" : "申請締切まで",
            v: s.status === "pre" ? s.preOpenInDays : (s.daysLeft > 0 ? s.daysLeft : "—"),
            u: "日",
            urgent: s.daysLeft != null && s.daysLeft <= 21
          },
        ].map((m, i) => (
          <div key={i} style={{
            paddingLeft: i ? 24 : 0,
            borderLeft: i ? "1px solid var(--line)" : 0
          }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{m.l}</div>
            <div className="num" style={{
              fontSize: m.main ? 48 : 28,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: m.urgent ? "var(--crimson)" : "var(--ink)"
            }}>
              {m.v}<span style={{ fontSize: 12, color: "var(--ink-4)", marginLeft: 4, fontWeight: 500, letterSpacing: 0 }}>{m.u}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        padding: isMobile ? "0 22px" : "0 56px",
        borderBottom: "1px solid var(--line)",
      }}>
        <div className="row" style={{ gap: 0 }}>
          {[
            { id: "overview", l: "概要" },
            { id: "reasons", l: "マッチ根拠" },
            { id: "adoption", l: "採択率推移" },
            { id: "steps", l: "申請手順" },
            { id: "docs", l: "必要書類" },
          ].map((t, i) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "16px 18px 14px",
              fontSize: 12,
              fontWeight: tab === t.id ? 600 : 500,
              color: tab === t.id ? "var(--ink)" : "var(--ink-3)",
              borderBottom: "2px solid " + (tab === t.id ? "var(--ink)" : "transparent"),
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}>
              <span className="num muted-2" style={{ fontSize: 10 }}>0{i + 1}</span>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: isMobile ? "24px 22px 80px" : "40px 56px 64px" }}>
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.7fr 1fr", gap: 48 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>概要 — Overview</div>
              <p className="serif" style={{ color: "var(--ink)", lineHeight: 1.9, fontSize: 17, fontWeight: 500, marginBottom: 30, letterSpacing: "-0.005em" }}>{s.summary}</p>

              <div className="eyebrow" style={{ marginBottom: 14, marginTop: 36 }}>こんな会社におすすめ</div>
              <div className="col" style={{ gap: 0 }}>
                {[
                  "クラウド型業務システムを導入したい",
                  "ECサイトを構築・刷新したい",
                  "セキュリティ強化を計画している",
                  "従業員10〜50名規模の中小事業者",
                ].map((t, i) => (
                  <div key={i} className="row" style={{ gap: 14, padding: "14px 0", borderTop: i ? "1px solid var(--line)" : "1px solid var(--line)" }}>
                    <span className="num muted-2" style={{ fontSize: 11, minWidth: 24 }}>0{i + 1}</span>
                    <span style={{ fontSize: 14 }}>{t}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--line)" }} />
              </div>

              <div className="eyebrow" style={{ marginBottom: 14, marginTop: 36 }}>採択事例</div>
              <Placeholder label="採択事例3件 (秋吉氏監修コメント付き)" h={120} />
            </div>
            <aside className="col" style={{ gap: 32 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--line-ink)" }}>公募スケジュール</div>
                {[
                  { d: s.appStart, l: "公募開始", done: true },
                  { d: "2026-06-15", l: "中間説明会", done: true },
                  { d: s.appEnd, l: "申請締切", done: false, urgent: true },
                  { d: "2026-08-20", l: "採択発表", done: false },
                ].map((t, i) => (
                  <div key={i} className="between" style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                    <div className="row" style={{ gap: 10 }}>
                      <span style={{
                        fontSize: 11, fontFamily: "var(--font-mono)",
                        color: t.urgent ? "var(--crimson)" : t.done ? "var(--ink-4)" : "var(--ink)",
                        textDecoration: t.done ? "line-through" : "none"
                      }}>—</span>
                      <span style={{ fontSize: 13, color: t.done ? "var(--ink-3)" : "var(--ink)", fontWeight: t.urgent ? 600 : 400 }}>{t.l}</span>
                    </div>
                    <span className="num muted-2" style={{ fontSize: 11 }}>{t.d}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "var(--ink)", color: "var(--bg-elev)", padding: 22 }}>
                <div className="eyebrow" style={{ color: "var(--ink-4)", marginBottom: 12 }}>AI Drafting</div>
                <div className="serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, lineHeight: 1.35 }}>
                  事業計画書ドラフトを<br />AIで生成
                </div>
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 18, lineHeight: 1.7 }}>
                  貴社情報・補助金要件を踏まえた構成案を10秒で生成。専門家レビューを併用推奨。
                </div>
                <button className="btn" style={{ background: "var(--bg-elev)", color: "var(--ink)", padding: "10px 16px", width: "100%" }}>
                  ドラフトを生成 →
                </button>
              </div>

              <div>
                <div className="eyebrow" style={{ marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--line-ink)" }}>公式情報</div>
                <a className="row" style={{ gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className="num muted-2 tiny">PDF</span>
                  <span className="sm" style={{ flex: 1 }}>公募要領</span>
                  <span className="muted">↗</span>
                </a>
                <a className="row" style={{ gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className="num muted-2 tiny">URL</span>
                  <span className="sm" style={{ flex: 1 }}>公式ページ</span>
                  <span className="muted">↗</span>
                </a>
              </div>
            </aside>
          </div>
        )}

        {tab === "reasons" && (
          <div style={{ maxWidth: 800 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>このスコアの根拠 — Why this score</div>
            <div className="row" style={{ gap: 28, marginBottom: 36, alignItems: "baseline" }}>
              <div className="num" style={{ fontSize: 96, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.9 }}>{s.score}</div>
              <div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Match Score</div>
                <div className="muted sm">業種・規模・事業内容の 3 軸で算出。100 点満点。</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--line-ink)" }}>
              {s.matchReasons && s.matchReasons.map((reason, i) => (
                <div key={i} style={{ padding: "22px 0", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="num" style={{ fontSize: 24, fontWeight: 600, color: "var(--ink-4)" }}>
                    0{i + 1}
                  </div>
                  <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{reason}</div>
                </div>
              ))}
            </div>

            <div className="eyebrow" style={{ marginBottom: 14, marginTop: 48 }}>類似採択事例 — Similar Cases</div>
            <table className="tab">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>—</th>
                  <th>企業</th>
                  <th>申請内容</th>
                  <th style={{ textAlign: "right" }}>金額</th>
                  <th style={{ textAlign: "right" }}>結果</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { c: "株式会社 A", d: "SaaS · 8名 · 東京", a: "クラウド経費精算ツール導入", m: 380, ok: true },
                  { c: "株式会社 B", d: "受託開発 · 15名 · 大阪", a: "営業支援ツール一新", m: 280, ok: true },
                  { c: "株式会社 C", d: "Web制作 · 22名 · 福岡", a: "案件管理SaaS導入", m: 450, ok: false },
                ].map((e, i) => (
                  <tr key={i}>
                    <td className="num muted-2" style={{ fontSize: 11 }}>0{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{e.c}</div>
                      <div className="muted-2 tiny">{e.d}</div>
                    </td>
                    <td>{e.a}</td>
                    <td className="num" style={{ textAlign: "right" }}>{e.m} 万円</td>
                    <td style={{ textAlign: "right" }}>
                      {e.ok ? <span className="badge badge-open">採択</span> : <span className="badge badge-deadline">不採択</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "adoption" && (
          <div style={{ maxWidth: 800 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>採択率推移 — 過去 6 回</div>
            <div style={{ padding: "20px 0", borderTop: "1px solid var(--line-ink)", borderBottom: "1px solid var(--line-ink)" }}>
              <AdoptionChart data={s.adoptionHistory} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginTop: 24 }}>
              {[
                { l: "直近採択率", v: Math.round((s.adoptionHistory[s.adoptionHistory.length - 1] || 0) * 100), u: "%" },
                { l: "6回平均", v: Math.round((s.adoptionHistory.reduce((a, b) => a + b, 0) / s.adoptionHistory.length) * 100), u: "%" },
                { l: "申請件数(直近)", v: "14,820", u: "件" },
              ].map((m, i) => (
                <div key={i} style={{
                  paddingLeft: i ? 24 : 0,
                  borderLeft: i ? "1px solid var(--line)" : 0
                }}>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>{m.l}</div>
                  <div className="num" style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {m.v}<span style={{ fontSize: 12, color: "var(--ink-4)", marginLeft: 4, fontWeight: 500 }}>{m.u}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: "16px 18px", borderLeft: "2px solid var(--amber)", background: "var(--bg-inset)" }}>
              <div className="eyebrow eyebrow-amber" style={{ marginBottom: 6 }}>注意</div>
              <div className="sm muted" style={{ lineHeight: 1.7 }}>
                採択率は申請企業の属性と事業計画の質に大きく依存します。「絶対採択」を示すものではありません。
              </div>
            </div>
          </div>
        )}

        {tab === "steps" && (
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>申請ステップ — 6 Steps</div>
            <div style={{ borderTop: "1px solid var(--line-ink)" }}>
              {[
                { l: "GBizID プライム取得", d: "事前準備。約 2 週間。", t: "2 週間前" },
                { l: "事業計画書を作成", d: "AI ドラフト生成 → 専門家レビュー推奨", t: "2 週間前" },
                { l: "見積書を取得", d: "複数業者から相見積を取得", t: "1 週間前" },
                { l: "電子申請システムに入力", d: "Jグランツから申請", t: "申請日" },
                { l: "採択結果通知", d: "申請から約 2 ヶ月", t: "8 月下旬" },
                { l: "交付申請・実績報告", d: "採択後の実施・精算手続き", t: "事業完了後" },
              ].map((step, i) => (
                <div key={i} style={{
                  padding: "22px 0", borderBottom: "1px solid var(--line)",
                  display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 20, alignItems: "center"
                }}>
                  <div className="num" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.04em", color: "var(--ink-4)" }}>
                    0{i + 1}
                  </div>
                  <div>
                    <div className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{step.l}</div>
                    <div className="muted sm" style={{ marginTop: 4 }}>{step.d}</div>
                  </div>
                  <div className="eyebrow" style={{ whiteSpace: "nowrap" }}>{step.t}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "docs" && (
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>必要書類 — Required Documents</div>
            <div style={{ borderTop: "1px solid var(--line-ink)" }}>
              {s.docs.map((doc, i) => (
                <div key={i} style={{ padding: "18px 0", borderBottom: "1px solid var(--line)", display: "flex", justifycontent: "space-between", alignItems: "center" }}>
                  <div className="row" style={{ gap: 16 }}>
                    <span className="num muted-2" style={{ fontSize: 11 }}>0{i + 1}</span>
                    <div>
                      <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{doc}</div>
                      <div className="muted-2 tiny" style={{ marginTop: 2 }}>PDF · Word 形式可</div>
                    </div>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn btn-ghost btn-sm">AI ドラフト</button>
                    <button className="btn btn-ghost btn-sm">アップロード</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ====== Adoption Chart (mini SVG) ======
export const AdoptionChart = ({ data }) => {
  if (!data?.length) return <Placeholder label="採択率データ" h={120} />;
  const w = 600, h = 140, pad = 20;
  const max = 1, min = 0;
  const xs = (i) => pad + (w - pad * 2) * (i / (data.length - 1));
  const ys = (v) => pad + (h - pad * 2) * (1 - (v - min) / (max - min));
  const path = data.map((v, i) => `${i ? "L" : "M"}${xs(i)} ${ys(v)}`).join(" ");
  const area = path + ` L${xs(data.length - 1)} ${h - pad} L${xs(0)} ${h - pad} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((g, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={ys(g)} y2={ys(g)}
          stroke="var(--line)" strokeWidth="1" strokeDasharray={g === 0.5 ? "" : "2 4"} />
      ))}
      <path d={area} fill="var(--navy-soft)" opacity="0.6" />
      <path d={path} fill="none" stroke="var(--navy)" strokeWidth="2.5" />
      {data.map((v, i) => (
        <g key={i}>
          <circle cx={xs(i)} cy={ys(v)} r="4" fill="var(--bg-elev)" stroke="var(--navy)" strokeWidth="2" />
          <text x={xs(i)} y={ys(v) - 10} textAnchor="middle"
            fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink-2)" fontWeight="600">
            {Math.round(v * 100)}%
          </text>
          <text x={xs(i)} y={h - 4} textAnchor="middle"
            fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-4)">
            第{14 + i}回
          </text>
        </g>
      ))}
    </svg>
  );
};
