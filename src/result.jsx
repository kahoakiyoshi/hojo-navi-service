import React, { useState, useEffect } from 'react';
import { formatYen } from './data';
import { StatusBadge, ScoreRing, Ico, Placeholder } from './ui';
import { fetchSubsidies, fetchSubsidyDetail } from './services/db';

// ====== USR-04: Diagnose Result ======
export const Result = ({ company, subsidiesList: passedSubsidies, isSearching, onOpenDetail, onSwitchMode, searchMode, isMobile, watchlist = [], onToggleWatchlist }) => {
  const [sort, setSort] = useState("score");
  const [filterStatus, setFilterStatus] = useState("all");
  const [localSubsidies, setLocalSubsidies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
  if (selectedCategories.length > 0) {
    items = items.filter(s => selectedCategories.includes(s.category));
  }
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
                  {["DX・IT", "設備投資", "販路開拓", "事業転換", "雇用・人材", "脱炭素・省エネ", "地域"].map(c => {
                    const isChecked = selectedCategories.includes(c);
                    return (
                      <label key={c} className="row" style={{
                        gap: 8, fontSize: 13, cursor: "pointer",
                        padding: "7px 0",
                        borderBottom: "1px solid var(--line)",
                      }}>
                        <input 
                          type="checkbox" 
                          style={{ accentColor: "var(--ink)" }} 
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedCategories(selectedCategories.filter(x => x !== c));
                            } else {
                              setSelectedCategories([...selectedCategories, c]);
                            }
                          }}
                        />
                        <span style={{ flex: 1 }}>{c}</span>
                      </label>
                    );
                  })}
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
                <SubsidyCard key={s.id} s={s} onClick={() => onOpenDetail(s.id)} delay={i * 30} isSaved={watchlist.includes(s.id)} onToggleWatchlist={onToggleWatchlist} isMobile={isMobile} />
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

export const SubsidyCard = ({ s, onClick, delay = 0, isSaved, onToggleWatchlist, isMobile }) => (
  <div className="fade-in" style={{
    cursor: "pointer",
    animationDelay: `${delay}ms`,
    padding: isMobile ? "16px 0" : "22px 4px",
    borderTop: "1px solid var(--line)",
    transition: "background 120ms",
    position: "relative"
  }}
    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-inset)"}
    onMouseLeave={e => e.currentTarget.style.background = ""}
    onClick={onClick}>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "auto 1fr auto" : "76px 1fr 220px auto", gap: isMobile ? 14 : 20, alignItems: "start" }}>
      <div className="num" style={{ fontSize: isMobile ? 32 : 44, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--ink)" }}>
        {s.score}
        <div className="eyebrow" style={{ marginTop: 6, fontSize: isMobile ? 9 : 10 }}>Score</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <StatusBadge status={s.status} />
          <span className="eyebrow">{s.category}</span>
        </div>
        <div className="serif" style={{ fontSize: isMobile ? 17 : 19, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{s.name}</div>
        <div className="muted-2" style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>{s.agency}</div>
        <div style={{ color: "var(--ink-2)", lineHeight: 1.7, fontSize: 13, maxWidth: 560 }}>{s.summary}</div>
        {isMobile && (
          <div className="col" style={{ gap: 8, marginTop: 14 }}>
            <SpecRow label="補助上限" value={formatYen(s.maxAmount)} />
            <SpecRow
              label={s.status === "pre" ? "公募開始まで" : "申請締切まで"}
              value={s.status === "pre" ? `${s.preOpenInDays} 日` : s.daysLeft > 0 ? `${s.daysLeft} 日` : "終了"}
              urgent={s.daysLeft != null && s.daysLeft <= 21}
            />
          </div>
        )}
      </div>
      {!isMobile && (
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
      )}
      <div className="col" style={{ gap: 10, alignItems: "flex-end" }}>
        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); onToggleWatchlist && onToggleWatchlist(s.id); }} style={{ padding: "4px 8px" }}>
          <Ico name={isSaved ? "bookmarkF" : "bookmark"} size={11} />{!isMobile && (isSaved ? "保存済" : "保存")}
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

// ====== JGrants Detail HTML Parser ======
const formatDetailHtml = (detailText) => {
  if (!detailText) return "<p>詳細情報はありません。</p>";
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(detailText, "text/html");
    const children = Array.from(doc.body.children);
    
    const sections = [];
    let currentSection = { type: "normal", header: "", content: [] };
    
    children.forEach(el => {
      const text = el.textContent.trim();
      if (text.startsWith("■")) {
        if (currentSection.header || currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        
        const cleanHeader = text.replace(/^■\s*/, "");
        if (cleanHeader.includes("注意事項") || cleanHeader.includes("注意")) {
          currentSection = { type: "alert", header: cleanHeader, content: [] };
        } else {
          currentSection = { type: "normal", header: cleanHeader, content: [] };
        }
      } else {
        currentSection.content.push(el.outerHTML);
      }
    });
    
    if (currentSection.header || currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    if (sections.length > 0) {
      return sections.map(sec => {
        if (sec.type === "alert") {
          return `
            <div class="alert-box">
              <div class="alert-title">${sec.header}</div>
              <div class="alert-content">${sec.content.join("")}</div>
            </div>
          `;
        } else {
          if (sec.header) {
            return `
              <div class="section-wrapper">
                <h2 class="section-title">${sec.header}</h2>
                <div class="section-content">${sec.content.join("")}</div>
              </div>
            `;
          } else {
            return `
              <div class="section-content">${sec.content.join("")}</div>
            `;
          }
        }
      }).join("");
    }
  } catch (e) {
    console.error("DOMParser error:", e);
  }
  
  return detailText;
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
      }
    }
    fetchSubsidyDetail(subsidyId).then(detail => {
      if (detail) {
        setS(detail);
      }
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
            <button className="btn btn-ghost" onClick={() => window.print()}>
              印刷する
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
        gap: isMobile ? "24px 0" : 0
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
            paddingLeft: isMobile ? (i % 2 === 1 ? 24 : 0) : (i ? 24 : 0),
            borderLeft: isMobile ? (i % 2 === 1 ? "1px solid var(--line)" : 0) : (i ? "1px solid var(--line)" : 0)
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
        <div className="row" style={{ gap: 0, overflowX: "auto", flexWrap: "nowrap", scrollbarWidth: "none", msOverflowStyle: "none" }}>
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
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="between" style={{ marginBottom: 14, alignItems: "center" }}>
              <div className="eyebrow" style={{ margin: 0 }}>概要 — Overview</div>
              <button className="btn btn-ghost btn-sm" onClick={() => {
                const printWindow = window.open("", "_blank");
                if (!printWindow) {
                  alert("ポップアップブロックを解除してください。");
                  return;
                }

                // Parse detail HTML using formatDetailHtml helper
                const formattedDetailHtml = formatDetailHtml(s.detail);

                printWindow.document.write(`
                  <html>
                    <head>
                      <title>${s.name}</title>
                      <link rel="preconnect" href="https://fonts.googleapis.com" />
                      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=Shippori+Mincho+B1:wght@500;600;700&family=Noto+Serif+JP:wght@500;600;700&display=swap" rel="stylesheet" />
                      <style>
                        body {
                          font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "MS Gothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                          padding: 40px;
                          color: #1a1a1a;
                          line-height: 1.6;
                        }
                        .header {
                          border-bottom: 2px solid #0f1c3f;
                          padding-bottom: 20px;
                          margin-bottom: 30px;
                        }
                        .agency {
                          font-size: 14px;
                          color: #666;
                          font-weight: 500;
                          text-transform: uppercase;
                          letter-spacing: 0.05em;
                        }
                        .title {
                          font-size: 28px;
                          font-weight: bold;
                          color: #0f1c3f;
                          margin: 10px 0;
                          line-height: 1.3;
                        }
                        .summary {
                          font-size: 16px;
                          font-style: italic;
                          font-family: "Shippori Mincho B1", "Noto Serif JP", serif;
                          color: #333;
                          margin-bottom: 20px;
                          line-height: 1.7;
                        }
                        .content {
                          font-size: 14px;
                        }
                        .section-wrapper {
                          margin-bottom: 24px;
                          padding-bottom: 24px;
                          border-bottom: 1px dotted #e2e8f0;
                        }
                        .section-wrapper:last-child {
                          border-bottom: none;
                        }
                        .section-title {
                          font-size: 18px;
                          font-weight: bold;
                          color: #0f1c3f;
                          border-left: 4px solid #0056b3;
                          padding-left: 10px;
                          margin-top: 0;
                          margin-bottom: 16px;
                          line-height: 1.2;
                        }
                        .section-content {
                          font-size: 14px;
                          color: #333;
                          line-height: 1.8;
                          padding-left: 14px;
                        }
                        .section-content p, .section-content div {
                          margin: 8px 0;
                        }
                        .alert-box {
                          background-color: #fff1f2 !important;
                          -webkit-print-color-adjust: exact;
                          print-color-adjust: exact;
                          border-radius: 6px;
                          padding: 20px;
                          margin-top: 30px;
                          margin-bottom: 20px;
                        }
                        .alert-title {
                          font-size: 16px;
                          font-weight: bold;
                          color: #dc2626;
                          margin-bottom: 12px;
                        }
                        .alert-content p, .alert-content div, .alert-content span, .alert-content li {
                          color: #dc2626 !important;
                          font-size: 14px;
                          line-height: 1.8;
                          margin: 8px 0;
                        }
                        h1, h2, h3, strong {
                          color: #000;
                        }
                        @media print {
                          body { padding: 0; }
                        }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <div class="agency">${s.agency || "官公庁・自治体"}</div>
                        <div class="title">${s.name}</div>
                        <div class="summary">${s.summary}</div>
                      </div>
                      <div class="content">
                        ${formattedDetailHtml}
                      </div>
                      <script>
                        window.onload = function() {
                          window.print();
                          window.onafterprint = function() {
                            window.close();
                          };
                        };
                      </script>
                    </body>
                  </html>
                `);
                printWindow.document.close();
              }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px" }}>
                <Ico name="pdf" size={12} /> 資料を作成する
              </button>
            </div>
            <p className="serif" style={{ color: "var(--ink)", lineHeight: 1.9, fontSize: 17, fontWeight: 500, marginBottom: 30, letterSpacing: "-0.005em" }}>{s.summary}</p>

            {s.detail && (
              <div style={{ marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 24, marginBottom: 30 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>公募要領詳細 — Official Details</div>
                <div 
                  className="serif jgrants-detail-html" 
                  style={{ fontSize: 14, lineHeight: 1.8, color: "var(--ink-2)", overflowX: "auto" }}
                  dangerouslySetInnerHTML={{ __html: formatDetailHtml(s.detail) }} 
                />
              </div>
            )}
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
              {(() => {
                const reasons = s.matchReasons || [];
                
                let areaScore = 80;
                let areaNote = "地域要件に適合";
                let industryScore = 85;
                let industryNote = "業種に関連する支援内容";
                let scaleScore = 90;
                let scaleNote = "従業員規模要件に適合";
                
                reasons.forEach(r => {
                  if (r.includes("対象地域") || r.includes("全国公募")) {
                    areaScore = r.includes("外の可能性") ? 40 : 100;
                    areaNote = r;
                  }
                  if (r.includes("業種") || r.includes("IT・DX・デジタル")) {
                    industryScore = r.includes("強合致") ? 98 : 90;
                    industryNote = r;
                  }
                  if (r.includes("従業員") || r.includes("制限なし")) {
                    scaleScore = r.includes("超過の可能性") ? 30 : (r.includes("適合") ? 95 : 90);
                    scaleNote = r;
                  }
                  if (r.includes("検討事業")) {
                    industryScore = 95;
                    industryNote = r;
                  }
                });

                const criteria = [
                  { l: "地域・業種適合度", v: Math.max(areaScore, industryScore), n: `${areaNote} / ${industryNote}` },
                  { l: "事業・目的適合度", v: s.score || 85, n: reasons.find(r => r.includes("検討事業")) || "事業目的要件に合致" },
                  { l: "規模・予算適合度", v: scaleScore, n: scaleNote }
                ];

                return criteria.map((r, i) => (
                  <div key={i} style={{ padding: "22px 0", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: isMobile ? "1fr auto" : "1fr auto 280px", gap: isMobile ? "12px 24px" : 24, alignItems: "center" }}>
                    <div>
                      <div className="serif" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{r.l}</div>
                      <div className="muted sm">{r.n}</div>
                    </div>
                    <div className="num" style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.04em" }}>{r.v}</div>
                    {!isMobile && (
                      <div className="scorebar"><i style={{ width: `${r.v}%` }} /></div>
                    )}
                  </div>
                ));
              })()}
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
                {(() => {
                  const savedCompanyStr = typeof window !== "undefined" ? localStorage.getItem("company") : null;
                  let companyObj = { name: "株式会社サンプルワークス", industry: "ソフトウェア業", employeeCount: 12, prefecture: "東京都" };
                  if (savedCompanyStr) {
                    try {
                      companyObj = JSON.parse(savedCompanyStr);
                    } catch (e) {
                      console.error("Failed to parse company from localStorage", e);
                    }
                  }

                  const pref = companyObj.prefecture || "東京都";
                  const ind = companyObj.industry || "ソフトウェア業";
                  const empCount = companyObj.employeeCount || 12;

                  const casesTemplates = {
                    "DX・IT": [
                      { c: "株式会社 A", d: `${ind} · ${Math.max(1, Math.round(empCount * 0.7))}名 · ${pref}`, a: "SaaS・クラウド基幹システム導入", m: Math.round(s.maxAmount * 0.6 / 10000) || 350, ok: true },
                      { c: "株式会社 B", d: `情報通信業 · ${Math.round(empCount * 1.2)}名 · 大阪府`, a: "営業管理(SCRM)・販売管理ツール一新", m: Math.round(s.maxAmount * 0.4 / 10000) || 180, ok: true },
                      { c: "株式会社 C", d: `サービス業 · ${Math.round(empCount * 1.8)}名 · 愛知県`, a: "ECサイト構築及びWeb受発注システム導入", m: Math.round(s.maxAmount * 0.8 / 10000) || 450, ok: false }
                    ],
                    "設備投資": [
                      { c: "株式会社 X", d: `製造業 · ${Math.max(1, Math.round(empCount * 0.8))}名 · ${pref}`, a: "高性能マシニングセンタ及び周辺自動化装置導入", m: Math.round(s.maxAmount * 0.7 / 10000) || 1200, ok: true },
                      { c: "株式会社 Y", d: `金属加工業 · ${Math.round(empCount * 1.3)}名 · 神奈川県`, a: "省力化溶接ロボットシステム導入", m: Math.round(s.maxAmount * 0.5 / 10000) || 800, ok: true },
                      { c: "株式会社 Z", d: `製造業 · ${Math.round(empCount * 2)}名 · 埼玉県`, a: "自動ピッキング倉庫制御システム導入", m: Math.round(s.maxAmount * 0.9 / 10000) || 1500, ok: false }
                    ],
                    "販路開拓": [
                      { c: "有限会社 M", d: `小売業 · ${Math.max(1, Math.round(empCount * 0.6))}名 · ${pref}`, a: "自社オリジナル製品のECサイト構築・多言語化", m: Math.round(s.maxAmount * 0.7 / 10000) || 150, ok: true },
                      { c: "株式会社 N", d: `食品製造業 · ${Math.round(empCount * 1.1)}名 · 京都府`, a: "海外展示会出展に伴うプロモーション・広告出稿", m: Math.round(s.maxAmount * 0.5 / 10000) || 100, ok: true },
                      { c: "株式会社 O", d: `卸売業 · ${Math.round(empCount * 1.7)}名 · 福岡県`, a: "新規ターゲット層向けブランディング及び特設サイト制作", m: Math.round(s.maxAmount * 0.8 / 10000) || 200, ok: false }
                    ],
                    "事業転換": [
                      { c: "株式会社 A", d: `飲食業 · ${Math.max(1, Math.round(empCount * 0.7))}名 · ${pref}`, a: "テイクアウト・冷凍食品製造販売への事業転換", m: Math.round(s.maxAmount * 0.6 / 10000) || 2800, ok: true },
                      { c: "株式会社 B", d: `アパレル業 · ${Math.round(empCount * 1.4)}名 · 大阪府`, a: "EC販売特化に伴うスマート物流倉庫への移行", m: Math.round(s.maxAmount * 0.8 / 10000) || 3500, ok: true },
                      { c: "株式会社 C", d: `イベント企画業 · ${Math.round(empCount * 2.2)}名 · 千葉県`, a: "オンライン配信スタジオ開設と配信サービス事業開始", m: Math.round(s.maxAmount * 0.9 / 10000) || 4500, ok: false }
                    ],
                    "雇用-人材": [
                      { c: "株式会社 X", d: `${ind} · ${Math.max(1, Math.round(empCount * 0.7))}名 · ${pref}`, a: "短時間正社員制度及び新たな人事評価システムの構築", m: Math.round(s.maxAmount * 0.5 / 10000) || 120, ok: true },
                      { c: "株式会社 Y", d: `建設業 · ${Math.round(empCount * 1.2)}名 · 兵庫県`, a: "若手技能士向け専門技術研修制度の構築と外部講師派遣", m: Math.round(s.maxAmount * 0.7 / 10000) || 150, ok: true },
                      { c: "株式会社 Z", d: `サービス業 · ${Math.round(empCount * 1.9)}名 · 静岡県`, a: "育児介護休業法に対応した両立支援制度と社内研修", m: Math.round(s.maxAmount * 0.8 / 10000) || 200, ok: false }
                    ],
                    "雇用・人材": [
                      { c: "株式会社 X", d: `${ind} · ${Math.max(1, Math.round(empCount * 0.7))}名 · ${pref}`, a: "短時間正社員制度及び新たな人事評価システムの構築", m: Math.round(s.maxAmount * 0.5 / 10000) || 120, ok: true },
                      { c: "株式会社 Y", d: `建設業 · ${Math.round(empCount * 1.2)}名 · 兵庫県`, a: "若手技能士向け専門技術研修制度の構築と外部講師派遣", m: Math.round(s.maxAmount * 0.7 / 10000) || 150, ok: true },
                      { c: "株式会社 Z", d: `サービス業 · ${Math.round(empCount * 1.9)}名 · 静岡県`, a: "育児介護休業法に対応した両立支援制度と社内研修", m: Math.round(s.maxAmount * 0.8 / 10000) || 200, ok: false }
                    ],
                    "脱炭素・省エネ": [
                      { c: "株式会社 P", d: `製造業 · ${Math.max(1, Math.round(empCount * 0.8))}名 · ${pref}`, a: "自家消費型太陽光発電設備及び蓄電池の導入", m: Math.round(s.maxAmount * 0.6 / 10000) || 1500, ok: true },
                      { c: "株式会社 Q", d: `ホテル運営 · ${Math.round(empCount * 1.5)}名 · 長野県`, a: "空調設備一新及び高効率温水ボイラーへの更新", m: Math.round(s.maxAmount * 0.7 / 10000) || 800, ok: true },
                      { c: "株式会社 R", d: `農業法人 · ${Math.round(empCount * 2)}名 · 北海道`, a: "ビニールハウス温調用バイオマスボイラー導入", m: Math.round(s.maxAmount * 0.8 / 10000) || 1200, ok: false }
                    ]
                  };

                  const cases = casesTemplates[s.category] || casesTemplates["DX・IT"];

                  return cases.map((e, i) => (
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
                  ));
                })()}
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
                { 
                  l: "申請件数(直近)", 
                  v: (() => {
                    let hash = 0;
                    const title = s.name || "";
                    for (let i = 0; i < title.length; i++) {
                      hash = title.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    const baseCount = s.category === "DX・IT" ? 12000 : (s.category === "設備投資" ? 8000 : 4000);
                    const count = baseCount + (Math.abs(hash) % 3000) - 1500;
                    return count.toLocaleString();
                  })(), 
                  u: "件" 
                },
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
                  display: "grid", gridTemplateColumns: isMobile ? "40px 1fr" : "60px 1fr auto", gap: isMobile ? 16 : 20, alignItems: "center"
                }}>
                  <div className="num" style={{ fontSize: isMobile ? 24 : 28, fontWeight: 600, letterSpacing: "-0.04em", color: "var(--ink-4)", alignSelf: isMobile ? "start" : "center", paddingTop: isMobile ? 2 : 0 }}>
                    0{i + 1}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{step.l}</div>
                    <div className="muted sm" style={{ marginTop: 4 }}>{step.d}</div>
                    {isMobile && <div className="eyebrow" style={{ marginTop: 8 }}>{step.t}</div>}
                  </div>
                  {!isMobile && <div className="eyebrow" style={{ whiteSpace: "nowrap" }}>{step.t}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "docs" && (
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>必要書類 — Required Documents</div>
            <div style={{ borderTop: "1px solid var(--line-ink)" }}>
              {(() => {
                if (s.files && s.files.length > 0) {
                  return s.files.map((file, i) => {
                    const handleDownload = () => {
                      if (!file.data) return;
                      try {
                        const base64Content = file.data.includes(",") ? file.data.split(",")[1] : file.data;
                        const byteCharacters = atob(base64Content);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let j = 0; j < byteCharacters.length; j++) {
                          byteNumbers[j] = byteCharacters.charCodeAt(j);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        let mimeType = "application/octet-stream";
                        if (file.name.endsWith(".pdf")) mimeType = "application/pdf";
                        else if (file.name.endsWith(".xlsx")) mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        else if (file.name.endsWith(".xls")) mimeType = "application/vnd.ms-excel";
                        else if (file.name.endsWith(".docx")) mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                        else if (file.name.endsWith(".doc")) mimeType = "application/msword";

                        const blob = new Blob([byteArray], { type: mimeType });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      } catch (err) {
                        console.error("Failed to download file:", err);
                        alert("ファイルのダウンロードに失敗しました。");
                      }
                    };

                    return (
                      <div key={i} style={{ 
                        padding: "18px 0", 
                        borderBottom: "1px solid var(--line)", 
                        display: "flex", 
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between", 
                        alignItems: isMobile ? "start" : "center",
                        gap: isMobile ? 14 : 0
                      }}>
                        <div className="row" style={{ gap: 16, alignItems: "flex-start" }}>
                          <span className="num muted-2" style={{ fontSize: 11, marginTop: 4 }}>0{i + 1}</span>
                          <div style={{ minWidth: 0 }}>
                            <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{file.name}</div>
                            <div className="muted-2 tiny" style={{ marginTop: 2 }}>
                              {file.type === "form" ? "申請様式 (ダウンロード可)" : file.type === "guideline" ? "公募要領 (ダウンロード可)" : "交付要綱 (ダウンロード可)"}
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ gap: 8, marginLeft: isMobile ? 0 : "auto", overflowX: "auto", maxWidth: "100%", paddingBottom: isMobile ? 4 : 0 }}>
                          {file.data && (
                            <button className="btn btn-ghost btn-sm" onClick={handleDownload} style={{ flexShrink: 0 }}>ダウンロード</button>
                          )}
                          <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>AI ドラフト</button>
                          <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>アップロード</button>
                        </div>
                      </div>
                    );
                  });
                }

                // Fallback: category list
                const cat = s.category;
                let docsList = ["事業計画書", "相見積書", "履歴事項全部証明書 (登記簿謄本)", "直近2期分の決算書", "gBizIDプライム アカウント情報"];
                
                if (cat === "DX・IT") {
                  docsList = [
                    "ITツール導入計画書 / 事業計画書",
                    "IT導入支援事業者による相見積書",
                    "履歴事項全部証明書 (法人のみ)",
                    "法人税の納税証明書 (その1またはその2)",
                    "gBizIDプライム アカウント情報 (電子申請用)"
                  ];
                } else if (cat === "設備投資") {
                  docsList = [
                    "生産性向上・技術導入事業計画書",
                    "導入対象設備のカタログ・製品仕様書",
                    "購入見積書 (相見積書を含む)",
                    "直近2期分の決算書 (B/S, P/L)",
                    "履歴事項全部証明書 (登記簿謄本)"
                  ];
                } else if (cat === "販路開拓") {
                  docsList = [
                    "販路開拓・マーケティング事業計画書",
                    "ECサイト・Web構築等の制作企画提案書",
                    "経費算出の根拠となる見積明細書",
                    "履歴事項全部証明書 (または個人事業主の確定申告書コピー)",
                    "gBizIDプライム アカウント情報"
                  ];
                } else if (cat === "事業転換") {
                  docsList = [
                    "事業再構築計画書 (または新事業進出計画書)",
                    "認定経営革新等支援機関による確認書",
                    "金融機関による確認書 (一部の大型案件のみ)",
                    "直近3期分の決算書および勘定科目内訳明細書",
                    "履歴事項全部証明書 (登記簿謄本)"
                  ];
                } else if (cat === "雇用・人材") {
                  docsList = [
                    "キャリアアップ計画書 (または研修実施計画書)",
                    "就業規則の写し (労働基準監督署の届出受領印付き)",
                    "対象労働者の雇用契約書 (または労働条件通知書)",
                    "出勤簿 (タイムカード) ＆ 賃金台帳の写し",
                    "事業所の雇用保険適用事業所設置届"
                  ];
                } else if (cat === "脱炭素・省エネ") {
                  docsList = [
                    "省エネルギー効果算定書 (エネルギー診断書)",
                    "導入する省エネ対象設備のカタログ・設計図面",
                    "設備メーカー等の見積書 ＆ 施工費明細書",
                    "直近1年間のエネルギー使用量証明書",
                    "履歴事項全部証明書"
                  ];
                }

                return docsList.map((doc, i) => (
                  <div key={i} style={{ 
                    padding: "18px 0", 
                    borderBottom: "1px solid var(--line)", 
                    display: "flex", 
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between", 
                    alignItems: isMobile ? "start" : "center",
                    gap: isMobile ? 14 : 0
                  }}>
                    <div className="row" style={{ gap: 16, alignItems: "flex-start" }}>
                      <span className="num muted-2" style={{ fontSize: 11, marginTop: 4 }}>0{i + 1}</span>
                      <div style={{ minWidth: 0 }}>
                        <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{doc}</div>
                        <div className="muted-2 tiny" style={{ marginTop: 2 }}>PDF · Word 形式 (アップロード必須)</div>
                      </div>
                    </div>
                    <div className="row" style={{ gap: 8, marginLeft: isMobile ? 0 : "auto", overflowX: "auto", maxWidth: "100%", paddingBottom: isMobile ? 4 : 0 }}>
                      <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>AI ドラフト</button>
                      <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>アップロード</button>
                    </div>
                  </div>
                ));
              })()}
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
