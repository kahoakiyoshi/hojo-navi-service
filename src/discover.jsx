import React, { useState, useEffect } from 'react';
import { MOCK_COMPANY, formatYen } from './data';
import { StatusBadge } from './ui';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';

// ====== USR-01: Landing Page ======
export const Landing = ({ onStart, isMobile, onLogin, user, onGoToMyPage }) => {
  const [url, setUrl] = useState("");
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Top nav */}
      <div style={{
        padding: isMobile ? "16px 22px" : "22px 56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--line)", background: "var(--bg-elev)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="sb-mark" style={{ width: 28, height: 28 }}>HJ</div>
          <div style={{ fontWeight: 600, fontSize: 15, fontFamily: "var(--font-display)" }}>
            HojoNavi <span style={{ color: "var(--ink-4)", fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.15em", textTransform: "uppercase", marginLeft: 4 }}>BETA</span>
          </div>
        </div>
        {isMobile ? (
          user ? (
            <button className="btn btn-ghost btn-sm" onClick={onGoToMyPage}>マイページ</button>
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={onLogin}>ログイン</button>
          )
        ) : (
          <div style={{ display: "flex", gap: 26, fontSize: 13, color: "var(--ink-2)", alignItems: "center" }}>
            <a>機能</a><a>採択事例</a><a>専門家</a><a>料金</a>
            {user ? (
              <button className="btn btn-ghost btn-sm" onClick={onGoToMyPage}>マイページ</button>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={onLogin}>ログイン</button>
            )}
          </div>
        )}
      </div>

      {/* Hero — editorial */}
      <div style={{
        padding: isMobile ? "44px 22px 36px" : "96px 56px 64px",
        position: "relative"
      }}>
        <div className="eyebrow" style={{ marginBottom: 24 }}>
          中小企業庁 監修ロジック · 補助金インテリジェンス
        </div>
        <h1 className="display" style={{
          fontSize: isMobile ? 36 : 68,
          lineHeight: 1.18,
          margin: "0 0 28px",
          letterSpacing: "-0.02em",
          fontWeight: 600,
          maxWidth: 900
        }}>
          会社URLを入れるだけで、<br />
          使える補助金と、<br />
          <span style={{ fontStyle: "italic", color: "var(--ink-3)" }}>次に来る制度</span>がわかる。
        </h1>
        <p style={{
          fontSize: isMobile ? 14 : 16,
          color: "var(--ink-2)",
          lineHeight: 1.85,
          margin: "0 0 36px",
          maxWidth: 560
        }}>
          AIが業種・規模・事業内容を抽出し、約 2,400 件の補助金マスタからマッチング。<br />
          公募開始の <em style={{ fontFamily: "var(--font-display)", fontStyle: "italic", borderBottom: "1px solid currentColor" }}>前</em> に通知が届くから、申請準備に十分な時間が取れます。
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); onStart(url || "https://sample-works.co.jp"); }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: 0,
            maxWidth: 640,
            border: "1px solid var(--line-strong)",
            background: "var(--bg-elev)"
          }}
        >
          <div className="row" style={{ padding: "0 18px", gap: 12, borderRight: isMobile ? 0 : "1px solid var(--line)", borderBottom: isMobile ? "1px solid var(--line)" : 0 }}>
            <span className="eyebrow" style={{ flexShrink: 0 }}>URL</span>
            <input
              className="input"
              style={{ border: 0, padding: "16px 0", background: "transparent" }}
              placeholder="https://your-company.co.jp"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{
            padding: "16px 26px",
            borderRadius: 0,
            fontSize: 14
          }}>
            無料で診断する →
          </button>
        </form>
        <div className="row" style={{ marginTop: 16, gap: 26, color: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <span>会員登録不要</span>
          <span>所要 3 分</span>
          <span>株式会社CrownStrategy JV 監修</span>
        </div>
      </div>

      {/* Numerical masthead */}
      {!isMobile && (
        <div style={{
          padding: "32px 56px",
          borderTop: "1px solid var(--line-ink)",
          borderBottom: "1px solid var(--line-ink)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0
        }}>
          {[
            { n: "2,418", l: "登録補助金マスタ", s: "件" },
            { n: "¥1.5", l: "国の年間予算規模", s: "兆円 / 年" },
            { n: "287", l: "監修者の採択実績", s: "件" },
            { n: "< 10", l: "中小企業の活用率", s: "% 推計" },
          ].map((s, i) => (
            <div key={i} style={{ paddingLeft: i ? 28 : 0, borderLeft: i ? "1px solid var(--line)" : 0 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{s.l}</div>
              <div className="num" style={{ fontSize: 42, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)" }}>
                {s.n}
              </div>
              <div className="muted-2" style={{ fontSize: 11, marginTop: 8, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
                {s.s}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4 pillars — editorial */}
      <div style={{ padding: isMobile ? "32px 22px" : "72px 56px 56px" }}>
        <div className="between" style={{ marginBottom: 32, alignItems: "flex-end" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>4本柱 — Four Pillars</div>
            <h2 className="display" style={{ fontSize: isMobile ? 24 : 32, margin: 0, fontWeight: 600 }}>
              既存サービスでは届かない、<br />4つの価値。
            </h2>
          </div>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gap: 0,
          borderTop: "1px solid var(--line-ink)",
          borderBottom: "1px solid var(--line)"
        }}>
          {[
            { idx: "01", t: "発見コスト削減", d: "会社URL1つで業種・規模・事業内容を抽出。約 2,400 件の補助金から自動マッチング。" },
            { idx: "02", t: "時間先回り", d: "パブコメ・予算動向から「これから来る」制度を予測し、開始日見込みを通知。" },
            { idx: "03", t: "判断支援", d: "採択スコア・採択率・類似採択事例・落選事例を根拠付きで提示。" },
            { idx: "04", t: "専門家連携", d: "秋吉氏監修の専門家による初回 30 分無料相談。書類準備からサポート。" },
          ].map((p, i) => (
            <div key={i} style={{
              padding: "28px 24px 28px 0",
              paddingLeft: i ? 28 : 0,
              borderLeft: i ? "1px solid var(--line)" : 0
            }}>
              <div className="num" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.1em", marginBottom: 12 }}>
                — {p.idx}
              </div>
              <div className="display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{p.t}</div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.75 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview block — typographic */}
      {!isMobile && (
        <div style={{ padding: "16px 56px 80px" }}>
          <div className="between" style={{ marginBottom: 22, alignItems: "flex-end" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>サンプル診断結果</div>
              <h2 className="display" style={{ fontSize: 26, margin: 0, fontWeight: 600 }}>
                <em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>株式会社サンプルワークス</em> の場合
              </h2>
            </div>
            <span className="eyebrow">SaaS · 12 名 · 東京都</span>
          </div>
          <div style={{ borderTop: "1px solid var(--line-ink)" }}>
            {[
              { s: 92, n: "IT導入補助金 2026", a: "経済産業省", st: "open" },
              { s: 88, n: "新事業進出補助金 第1回", a: "経済産業省", st: "pre" },
              { s: 86, n: "ものづくり補助金 第19次", a: "中小企業庁", st: "open" },
            ].map((r, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto auto",
                gap: 28,
                padding: "22px 0",
                borderBottom: "1px solid var(--line)",
                alignItems: "center"
              }}>
                <div className="num" style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>{r.s}</div>
                <div>
                  <div className="serif" style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{r.n}</div>
                  <div className="muted-2 num" style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>{r.a}</div>
                </div>
                <StatusBadge status={r.st} />
                <span className="muted" style={{ fontSize: 12 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: isMobile ? "22px" : "28px 56px",
        background: "var(--bg-elev)",
        borderTop: "1px solid var(--line-ink)",
        fontSize: 10, color: "var(--ink-4)",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em"
      }}>
        © 2026 HojoNavi · 株式会社CrownStrategy · 本サービスは情報提供を目的とし、補助金の採択を保証するものではありません
      </div>
    </div>
  );
};

// ====== USR-02: URL Analysis ======
export const Analyze = ({ url, onDone, isMobile }) => {
  const [phase, setPhase] = useState("analyzing"); // analyzing | preview
  const [progress, setProgress] = useState(0);
  const [editing, setEditing] = useState(false);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    let progressInterval;
    let isMounted = true;

    // Start progress animation
    progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          // Stay at 90% until backend returns
          return 90;
        }
        return p + 1 + Math.random() * 4;
      });
    }, 80);

    // Call local Express server or Vercel Serverless Function
    const apiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3001/api/analyze'
      : '/api/analyze';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    })
      .then(res => res.json())
      .then((result) => {
        if (!isMounted) return;
        console.log("Gemini URL analysis result:", result);
        if (result && result.success && result.data) {
          setCompanyData(result.data);
        } else {
          console.warn("Backend failed or returned no success, using empty company data.");
          setCompanyData({ name: "", url, industry: "", employeeCount: null, prefecture: "", revenueLabel: "", established: "", businessSummary: "", capital: null });
        }
        
        // Complete the progress animation quickly
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          if (isMounted) setPhase("preview");
        }, 500);
      })
      .catch((error) => {
        console.error("Error invoking analyze API:", error);
        if (!isMounted) return;
        setCompanyData({ name: "", url, industry: "", employeeCount: null, prefecture: "", revenueLabel: "", established: "", businessSummary: "", capital: null });
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          if (isMounted) setPhase("preview");
        }, 500);
      });

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
    };
  }, [url]);

  const steps = [
    { t: "URL接続", k: 15 },
    { t: "HTML解析", k: 35 },
    { t: "業種・規模をAI抽出", k: 65 },
    { t: "事業内容を要約", k: 90 },
    { t: "完了", k: 100 },
  ];

  if (phase === "analyzing") {
    return (
      <div style={{ padding: isMobile ? "44px 22px" : "88px 56px", minHeight: 600 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Step 01 / 解析中 — Analyzing
          </div>
          <h1 className="display" style={{
            fontSize: isMobile ? 28 : 38,
            margin: "0 0 14px",
            fontWeight: 600,
            letterSpacing: "-0.015em",
            lineHeight: 1.25
          }}>
            会社情報を解析しています
          </h1>
          <div className="num muted" style={{ fontSize: 13, marginBottom: 40, letterSpacing: "0.02em" }}>{url}</div>

          {/* Progress display */}
          <div style={{ borderTop: "1px solid var(--line-ink)", paddingTop: 28 }}>
            <div className="between" style={{ marginBottom: 22, alignItems: "baseline" }}>
              <div className="num" style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.9 }}>
                {String(Math.round(progress)).padStart(2, "0")}<span style={{ fontSize: 18, color: "var(--ink-4)", marginLeft: 4 }}>%</span>
              </div>
              <div className="thinking-dots"><span /><span /><span /></div>
            </div>
            <div className="scorebar" style={{ marginBottom: 36 }}>
              <i style={{ width: `${progress}%`, transition: "width 200ms" }} />
            </div>

            <div>
              {steps.map((s, i) => {
                const done = progress >= s.k;
                const active = !done && progress >= (steps[i - 1]?.k || 0);
                return (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr auto",
                    gap: 16,
                    padding: "14px 0",
                    borderBottom: "1px solid var(--line)",
                    opacity: done || active ? 1 : 0.35,
                    transition: "opacity 200ms"
                  }}>
                    <span className="num muted-2" style={{ fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 14, color: done || active ? "var(--ink)" : "var(--ink-4)" }}>{s.t}</span>
                    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: done ? "var(--emerald)" : "var(--ink-4)" }}>
                      {done ? "DONE" : active ? "···" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 28, padding: "14px 18px", borderLeft: "2px solid var(--ink)", background: "var(--bg-inset)" }}>
            <div className="muted sm" style={{ lineHeight: 1.7 }}>
              <strong style={{ color: "var(--ink)" }}>個人情報は送信していません。</strong> 会社の公開Webサイトから法人情報のみを抽出しています。
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview phase
  const c = companyData || MOCK_COMPANY;

  const updateField = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFinish = () => {
    // Copy the final analyzed company data back to the global MOCK_COMPANY object
    // so other screens can read the updated company details.
    Object.assign(MOCK_COMPANY, c);
    onDone(c);
  };

  return (
    <div style={{ padding: isMobile ? "32px 22px" : "56px 56px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          Step 01 / 解析結果プレビュー
        </div>
        <h1 className="display" style={{
          fontSize: isMobile ? 24 : 34,
          margin: "0 0 12px",
          fontWeight: 600,
          letterSpacing: "-0.015em",
          lineHeight: 1.25
        }}>
          こちらの内容で診断を進めますか？
        </h1>
        <p className="muted md" style={{ marginBottom: 32, lineHeight: 1.75, maxWidth: 540 }}>
          AI が抽出した会社情報です。誤りがあれば修正してください。
        </p>

        <div style={{ borderTop: "1px solid var(--line-ink)", paddingTop: 22 }}>
          <div className="between" style={{ marginBottom: 22 }}>
            <div>
              <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
                {editing ? (
                  <input className="input" style={{ fontSize: 22, fontWeight: 600 }} value={c.name} onChange={e => updateField("name", e.target.value)} />
                ) : c.name}
              </div>
              <div className="num muted" style={{ fontSize: 12, letterSpacing: "0.02em" }}>{c.url}</div>
            </div>
            {/* <button className="btn btn-ghost btn-sm" onClick={() => setEditing(!editing)}>
              {editing ? "完了" : "修正する"}
            </button> */}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 0,
            borderTop: "1px solid var(--line)"
          }}>
            {[
              { l: "業種", k: "industry", v: c.industry },
              { l: "従業員数", k: "employeeCount", v: typeof c.employeeCount === "number" ? `${c.employeeCount} 名` : c.employeeCount, isNum: true },
              { l: "所在地", k: "prefecture", v: c.prefecture },
              { l: "売上規模", k: "revenueLabel", v: c.revenueLabel },
              { l: "設立", k: "established", v: c.established },
              { l: "資本金", k: "capital", v: typeof c.capital === "number" ? formatYen(c.capital) : c.capital, isCapital: true },
            ].map((f, i) => (
              <div key={i} style={{
                padding: "18px 0 18px 0",
                paddingRight: i % 2 === 0 ? 24 : 0,
                paddingLeft: i % 2 === 1 ? 24 : 0,
                borderBottom: "1px solid var(--line)",
                borderLeft: i % 2 === 1 && !isMobile ? "1px solid var(--line)" : 0
              }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  AI 抽出 / {f.l}
                </div>
                {editing ? (
                  <input 
                    className="input" 
                    value={f.isNum || f.isCapital ? c[f.k] : f.v} 
                    onChange={e => {
                      const val = f.isNum || f.isCapital ? Number(e.target.value) || e.target.value : e.target.value;
                      updateField(f.k, val);
                    }} 
                  />
                ) : (
                  <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{f.v}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: "22px 0", borderBottom: "1px solid var(--line)" }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>AI 抽出 / 事業内容サマリ</div>
            {editing
              ? <textarea className="input" value={c.businessSummary} onChange={e => updateField("businessSummary", e.target.value)} rows={4} />
              : <p className="serif" style={{ fontSize: 16, lineHeight: 1.85, color: "var(--ink)", margin: 0, fontWeight: 500 }}>{c.businessSummary}</p>}
          </div>
        </div>

        <div className="row" style={{ marginTop: 32, gap: 12, justifyContent: "flex-end" }}>
          {/* <button className="btn btn-ghost">手動で入力し直す</button> */}
          <button className="btn btn-primary btn-lg" onClick={handleFinish}>
            この内容で診断する →
          </button>
        </div>
      </div>
    </div>
  );
};

// ====== USR-03: 4-step diagnose ======
export const Diagnose = ({ company, onDone, isMobile }) => {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState("1000-3000");
  const [purpose, setPurpose] = useState("dx");
  const [timing, setTiming] = useState("3m");
  const [preexisting, setPreexisting] = useState(false);

  const next = () => step < 3 ? setStep(step + 1) : onDone({ budget, purpose, timing, preexisting });
  const prev = () => step > 0 ? setStep(step - 1) : null;

  return (
    <div style={{ padding: isMobile ? "32px 22px 100px" : "56px 56px", minHeight: 600 }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div className="between" style={{ marginBottom: 16 }}>
          <div className="eyebrow">Step {String(step + 1).padStart(2, "0")} / 04</div>
          <button className="btn-link tiny" onClick={() => onDone()}>スキップ</button>
        </div>

        <div className="steps-bar">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={i < step ? "done" : i === step ? "now" : ""} />
          ))}
        </div>

        {step === 0 && (
          <div className="fade-in">
            <h2 className="display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 10px", letterSpacing: "-0.015em" }}>
              補助対象として検討中の事業は？
            </h2>
            <p className="muted sm" style={{ marginBottom: 28 }}>該当する取組をすべて選択してください</p>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {[
                { id: "dx", t: "ITツール導入・DX推進", d: "業務システム・クラウドサービス・自動化ツール等" },
                { id: "equip", t: "設備投資・生産性向上", d: "機械設備・3Dプリンタ・自動化ライン等" },
                { id: "marketing", t: "販路開拓・マーケティング", d: "Web広告・展示会・チラシ・ECサイト等" },
                { id: "new", t: "新事業・新分野展開", d: "新サービス開発・市場進出・業態転換" },
                { id: "hr", t: "雇用・人材育成", d: "正社員化・育休支援・研修制度等" },
                { id: "green", t: "省エネ・脱炭素", d: "省エネ機器・再エネ導入" },
              ].map(o => (
                <div key={o.id} onClick={() => setPurpose(o.id)} style={{
                  padding: "16px 0",
                  borderBottom: "1px solid var(--line)",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 16,
                  alignItems: "center",
                  cursor: "pointer",
                  color: purpose === o.id ? "var(--ink)" : "var(--ink-2)"
                }}>
                  <div style={{
                    width: 16, height: 16,
                    border: "1.5px solid " + (purpose === o.id ? "var(--ink)" : "var(--line-strong)"),
                    background: purpose === o.id ? "var(--ink)" : "transparent",
                    display: "grid", placeItems: "center"
                  }}>
                    {purpose === o.id && <span style={{ width: 6, height: 6, background: "var(--bg-elev)" }} />}
                  </div>
                  <div>
                    <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{o.t}</div>
                    <div className="muted sm" style={{ marginTop: 2 }}>{o.d}</div>
                  </div>
                  <span className="muted" style={{ fontSize: 14, opacity: purpose === o.id ? 1 : 0 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <h2 className="display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 10px", letterSpacing: "-0.015em" }}>
              投資・経費の想定規模は？
            </h2>
            <p className="muted sm" style={{ marginBottom: 28 }}>補助金の対象上限と照合します</p>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {[
                { id: "-100", l: "100 万円未満", h: "持続化補助金などの小規模向け" },
                { id: "100-1000", l: "100 〜 1,000 万円", h: "IT 導入補助金・地域 DX など" },
                { id: "1000-3000", l: "1,000 〜 3,000 万円", h: "ものづくり補助金など中規模" },
                { id: "3000+", l: "3,000 万円以上", h: "事業再構築・新事業進出など大型" },
              ].map(o => (
                <div key={o.id} onClick={() => setBudget(o.id)} style={{
                  padding: "20px 0",
                  borderBottom: "1px solid var(--line)",
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center", cursor: "pointer"
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: "1.5px solid " + (budget === o.id ? "var(--ink)" : "var(--line-strong)"),
                    display: "grid", placeItems: "center",
                  }}>
                    {budget === o.id && <span style={{ width: 8, height: 8, background: "var(--ink)", borderRadius: "50%" }} />}
                  </div>
                  <div>
                    <div className="serif num" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{o.l}</div>
                    <div className="muted sm" style={{ marginTop: 2 }}>{o.h}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 className="display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 10px", letterSpacing: "-0.015em" }}>
              実施したい時期は？
            </h2>
            <p className="muted sm" style={{ marginBottom: 28 }}>「公募前アラート」の通知タイミングを最適化します</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid var(--line-ink)" }}>
              {[
                { id: "1m", l: "1 ヶ月以内", h: "公募中のみ表示" },
                { id: "3m", l: "3 ヶ月以内", h: "公募前 + 公募中" },
                { id: "6m", l: "6 ヶ月以内", h: "公募前まで含む" },
                { id: "1y", l: "1 年以内", h: "予算動向まで含む" },
              ].map((o, i) => (
                <div key={o.id} onClick={() => setTiming(o.id)} style={{
                  padding: "24px",
                  borderBottom: "1px solid var(--line)",
                  borderLeft: i % 2 === 1 ? "1px solid var(--line)" : 0,
                  cursor: "pointer",
                  background: timing === o.id ? "var(--bg-inset)" : "transparent",
                }}>
                  <div className="serif num" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
                    {timing === o.id && "→ "}{o.l}
                  </div>
                  <div className="muted sm">{o.h}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <label className="row" style={{ gap: 12, cursor: "pointer" }} onClick={() => setPreexisting(!preexisting)}>
                <div style={{
                  width: 16, height: 16,
                  border: "1.5px solid " + (preexisting ? "var(--ink)" : "var(--line-strong)"),
                  background: preexisting ? "var(--ink)" : "transparent",
                  display: "grid", placeItems: "center"
                }}>
                  {preexisting && <span style={{ width: 8, height: 8, background: "var(--bg-elev)" }} />}
                </div>
                <span className="sm">過去 5 年以内に補助金採択歴がある（再申請時の優遇／制限 of 判定に使用）</span>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <h2 className="display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 10px", letterSpacing: "-0.015em" }}>
              この条件で診断します
            </h2>
            <p className="muted sm" style={{ marginBottom: 28 }}>10 秒ほどで結果が表示されます</p>
            <div style={{ borderTop: "1px solid var(--line-ink)" }}>
              {[
                { l: "会社", v: company?.name || "未設定" },
                { l: "業種・規模", v: `${company?.industry || "未設定"} · ${company?.employeeCount != null ? company.employeeCount + " 名" : "未設定"} · ${company?.prefecture || "未設定"}` },
                { 
                  l: "検討事業", 
                  v: {
                    dx: "ITツール導入・DX推進",
                    equip: "設備投資・生産性向上",
                    marketing: "販路開拓・マーケティング",
                    new: "新事業・新分野展開",
                    hr: "雇用・人材育成",
                    green: "省エネ・脱炭素"
                  }[purpose] || "未選択"
                },
                { 
                  l: "投資規模", 
                  v: {
                    "-100": "100 万円未満",
                    "100-1000": "100 〜 1,000 万円",
                    "1000-3000": "1,000 〜 3,000 万円",
                    "3000+": "3,000 万円以上"
                  }[budget] || "未選択"
                },
                { 
                  l: "実施時期", 
                  v: {
                    "1m": "1 ヶ月以内",
                    "3m": "3 ヶ月以内（公募前含む）",
                    "6m": "6 ヶ月以内",
                    "1y": "1 年以内"
                  }[timing] || "未選択"
                },
                { l: "採択歴", v: preexisting ? "あり" : "なし" },
              ].map((r, i) => (
                <div key={i} className="between" style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className="eyebrow">{r.l}</span>
                  <span className="serif" style={{ fontSize: 15, fontWeight: 600 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="row" style={{ marginTop: 36, gap: 12, justifyContent: "space-between" }}>
          <button className="btn btn-ghost" onClick={prev} disabled={step === 0} style={{ visibility: step === 0 ? "hidden" : "visible" }}>
            ← 戻る
          </button>
          <button className="btn btn-primary btn-lg" onClick={next}>
            {step === 3 ? "診断を実行" : "次へ"} →
          </button>
        </div>
      </div>
    </div>
  );
};
