import React, { useState, useEffect } from 'react';
import { MOCK_EXPERTS } from './data';
import { fetchSubsidies } from './services/db';
import { Paywall } from './components/Paywall';

export const Expert = ({ isMobile, isPremium, onUpgrade }) => {
  const [picked, setPicked] = useState(MOCK_EXPERTS[0]?.id || "");
  const [phase, setPhase] = useState("pick"); // pick | chat
  const exp = MOCK_EXPERTS.find(e => e.id === picked) || {};
  const [subsidiesList, setSubsidiesList] = useState([]);

  useEffect(() => {
    fetchSubsidies().then(setSubsidiesList);
  }, []);

  if (!isPremium) {
    return <Paywall onUpgrade={onUpgrade} isMobile={isMobile} />;
  }

  return (
    <div style={{ padding: isMobile ? "24px 22px 80px" : "36px 56px 60px" }}>
      <div className="between" style={{ marginBottom: 22, alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Expert Consultation</div>
          <h1 className="display" style={{ fontSize: isMobile ? 26 : 36, margin: 0, fontWeight: 600, letterSpacing: "-0.015em" }}>
            専門家相談
          </h1>
          <div className="muted sm" style={{ marginTop: 8 }}>
            株式会社CrownStrategy JV 監修ネットワーク · <strong style={{ color: "var(--emerald)" }}>初回 30 分 無料</strong>
          </div>
        </div>
        <div className="cv-toggle" style={{ display: isMobile ? "none" : "inline-flex" }}>
          <button className={phase === "pick" ? "on" : ""} onClick={() => setPhase("pick")}>Book</button>
          <button className={phase === "chat" ? "on" : ""} onClick={() => setPhase("chat")}>Active</button>
        </div>
      </div>

      {MOCK_EXPERTS.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-3)" }}>
          現在、相談可能な専門家が登録されていません。
        </div>
      ) : phase === "pick" ? (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 36 }}>
          <div style={{ borderTop: "1px solid var(--line-ink)" }}>
            {MOCK_EXPERTS.map((e, i) => (
              <div key={e.id} style={{
                padding: "24px 0",
                borderBottom: "1px solid var(--line)",
                cursor: "pointer",
                background: picked === e.id ? "var(--bg-inset)" : "transparent",
                paddingLeft: picked === e.id ? 16 : 0,
                transition: "padding 120ms, background 120ms",
              }} onClick={() => setPicked(e.id)}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "flex-start" }}>
                  <div className="num muted-2" style={{ fontSize: 11, paddingTop: 4, minWidth: 28 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="between" style={{ marginBottom: 8 }}>
                      <div>
                        <div className="serif" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em" }}>{e.name}</div>
                        <div className="eyebrow" style={{ marginTop: 6 }}>{e.role}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="num" style={{ fontSize: 16, fontWeight: 600, color: "var(--amber)" }}>★ {e.rating}</div>
                        <div className="num muted-2" style={{ fontSize: 11, marginTop: 2 }}>{e.cases} 件対応</div>
                      </div>
                    </div>
                    <div style={{ color: "var(--ink-2)", lineHeight: 1.75, fontSize: 13, marginTop: 12, maxWidth: 540 }}>{e.profile}</div>
                    <div className="row" style={{ gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                      <span className="eyebrow">空き</span>
                      {e.avail.map(a => (
                        <span key={a} className="num" style={{ fontSize: 11, color: "var(--ink-2)" }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside style={{ alignSelf: "flex-start" }}>
            <div className="eyebrow" style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line-ink)" }}>相談予約フォーム</div>
            <div className="col" style={{ gap: 18 }}>
              <div>
                <div className="label">担当者</div>
                <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{exp.name}</div>
                <div className="muted-2 tiny">{exp.role}</div>
              </div>
              <div>
                <div className="label">対象の補助金（任意）</div>
                <select className="input">
                  <option>未選択</option>
                  {subsidiesList.slice(0, 5).map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <div className="label">希望日時</div>
                <select className="input">
                  {exp.avail.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <div className="label">相談内容</div>
                <textarea className="input" rows={4} placeholder="どんな補助金を検討中で、何に困っているか..." />
              </div>
              <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
                <div className="between">
                  <span className="eyebrow">相談料金</span>
                  <span>
                     <span className="num" style={{ fontSize: 22, fontWeight: 600, color: "var(--emerald)" }}>¥0</span>
                     <span className="muted-2 tiny" style={{ marginLeft: 6 }}>初回 30 分</span>
                  </span>
                </div>
              </div>
              <button className="btn btn-primary btn-lg btn-block" onClick={() => setPhase("chat")}>この内容で予約する →</button>
            </div>
          </aside>
        </div>
      ) : (
        <ExpertChat exp={exp} />
      )}
    </div>
  );
};

export const ExpertChat = ({ exp }) => {
  const isWithB = exp.id === "e4";
  const welcomeText1 = isWithB 
    ? "お問い合わせありがとうございます。with-B行政書士法人 補助金ナビ 担当者です。"
    : "お問い合わせありがとうございます。IT 導入補助金 2026 の件、貴社のご状況を確認させていただきました。";

  const welcomeText2 = isWithB
    ? "当法人は全国の事業者様へ、ものづくり補助金やIT導入補助金などの申請サポートを完全成功報酬ベースで伴走支援しております。まずはこちらの窓口より、お気軽にお問い合わせや申請要件のご相談を行っていただけます。ご希望の補助金や検討フェーズについて教えてください。"
    : `売上規模・従業員数の要件は問題なく、特に「クラウド型業務システム導入」は補助対象に明示されているのでマッチします。3 点気になる箇所がありますので、お時間ある時にご確認ください:

01 — GBizID プライムを未取得の場合、申請 2 週間前までに取得が必要です
02 — 賃金引上計画が必須なので、就業規則の整備状況をご共有いただけますか
03 — IT ベンダーの登録番号が必要です — 候補ベンダーはお決まりですか？`;

  return (
    <div style={{ minHeight: 520, display: "grid", gridTemplateRows: "auto 1fr auto", border: "1px solid var(--line)" }}>
      <div className="between" style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)" }}>
        <div>
          <div className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{exp.name}</div>
          <div className="muted-2 tiny" style={{ marginTop: 2 }}>{exp.role} · 通常 2 時間以内に返信</div>
        </div>
        <span className="badge badge-open">進行中</span>
      </div>
      <div style={{ padding: 28, overflowY: "auto", display: "flex", flexDirection: "column", gap: 22 }}>
        <ChatBubble side="them" name={exp.name} text={welcomeText1} time="14:02" />
        <ChatBubble side="them" name={exp.name} text={welcomeText2} time="14:05" />
        <ChatBubble side="me" text="ありがとうございます！GBizID は取得済です。ベンダーは 2 社で迷っています、比較資料をお送りしてもよろしいでしょうか？" time="14:18" />
        <ChatBubble side="them" name={exp.name} text="はい、ぜひお送りください。私の方で「補助対象事業者」かどうかと、過去の採択補助率も含めて確認します。" time="14:22" />
      <div className="row" style={{ alignSelf: "center", gap: 8 }}>
        <div className="thinking-dots"><span /><span /><span /></div>
        <span className="muted tiny">{exp.name} さんが入力中…</span>
      </div>
    </div>
    <div style={{ padding: 16, borderTop: "1px solid var(--line)" }}>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn btn-ghost btn-sm">添付</button>
        <input className="input" placeholder="メッセージを入力..." style={{ flex: 1, minWidth: 0 }} />
        <button className="btn btn-primary" style={{ flexShrink: 0 }}>送信 →</button>
      </div>
    </div>
  </div>
  );
};

export const ChatBubble = ({ side, name, text, time }) => (
  <div className="fade-in" style={{
    display: "flex", flexDirection: "column",
    alignItems: side === "me" ? "flex-end" : "flex-start",
    gap: 6
  }}>
    <div className="row" style={{ gap: 10 }}>
      {side === "them" ? (
        <span className="eyebrow">{name}</span>
      ) : (
        <span className="eyebrow eyebrow-ink">あなた</span>
      )}
      <span className="num muted-2" style={{ fontSize: 10 }}>{time}</span>
    </div>
    <div className="serif" style={{
      maxWidth: 520,
      padding: side === "me" ? "12px 16px" : 0,
      background: side === "me" ? "var(--ink)" : "transparent",
      color: side === "me" ? "var(--bg-elev)" : "var(--ink)",
      fontSize: 15, lineHeight: 1.75,
      whiteSpace: "pre-line",
      fontWeight: 500,
      borderLeft: side === "them" ? "2px solid var(--ink)" : 0,
      paddingLeft: side === "them" ? 14 : undefined
    }}>{text}</div>
  </div>
);
