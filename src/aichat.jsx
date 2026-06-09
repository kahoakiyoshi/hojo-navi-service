import React, { useState, useEffect, useRef } from 'react';
import { Paywall } from './components/Paywall';

export const AIChatPage = ({ isMobile, isPremium, onUpgrade }) => {
  const [messages, setMessages] = useState([
    { r: "ai", t: "こんにちは。補助金AIアシスタントです。貴社情報を読み込み済みです。どんなことをお聞きしたいですか？" },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.parentElement?.scrollTo?.({ top: 99999, behavior: "smooth" });
  }, [messages]);

  if (!isPremium) {
    return <Paywall onUpgrade={onUpgrade} isMobile={isMobile} />;
  }

  const send = async (q) => {
    if (!q.trim()) return;
    const next = [...messages, { r: "user", t: q }];
    setMessages(next);
    setDraft("");
    setLoading(true);

    try {
      const ctx = `あなたは日本の中小企業向け補助金AIアシスタント「HojoNavi」です。
ユーザー企業情報:
- 会社名: 株式会社サンプルワークス
- 業種: ソフトウェア業 (Web/SaaS)
- 従業員: 12名 / 売上1.8億円 / 東京都渋谷区 / 2019年設立
- 事業内容: 中小企業向け業務効率化SaaS開発・販売

利用可能な補助金 (一部):
- IT導入補助金 2026 (経産省, 上限450万円, 補助率1/2-2/3, 採択率58%)
- ものづくり補助金 第19次 (上限1250万円, 1/2, 42%)
- 新事業進出補助金 (公募前, 上限9000万円, 1/2)
- 小規模事業者持続化補助金 (公募前, 上限200万円, 2/3)
- 東京都デジタルツール導入促進 (上限100万円, 1/2)
- キャリアアップ助成金 (通年, 1人80万円)

簡潔に・具体的に・断定的すぎず（「採択を保証するものではありません」のスタンスで）回答してください。150〜250字程度。`;

      if (window.claude && typeof window.claude.complete === 'function') {
        const response = await window.claude.complete({
          messages: [
            { role: "user", content: ctx + "\n\n質問: " + q }
          ]
        });
        setMessages(m => [...m, { r: "ai", t: response }]);
      } else {
        throw new Error("No claude client available");
      }
    } catch (e) {
      setMessages(m => [...m, { r: "ai", t: "（オフラインモック応答）IT導入補助金 2026 は貴社の業態に最も適合しています。クラウドSaaS導入が補助対象に明示されているためです。次の一手として、GBizIDの取得状況をご確認ください。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: isMobile ? "20px 22px 100px" : "36px 56px 60px",
      minHeight: 600
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>AI Assistant · powered by Gemini</div>
        <h1 className="display" style={{ fontSize: isMobile ? 26 : 36, margin: "0 0 8px", fontWeight: 600, letterSpacing: "-0.015em" }}>
          補助金 AI アシスタント
        </h1>
        <div className="muted sm" style={{ marginBottom: 28 }}>貴社情報を読み込み済み · 自由に質問してください</div>

        <div style={{
          borderTop: "1px solid var(--line-ink)",
          padding: "32px 0",
          minHeight: 380,
          maxHeight: 520, overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 26,
          marginBottom: 22
        }}>
          {messages.map((m, i) => (
            <div key={i} className="fade-in" style={{
              display: "flex", flexDirection: "column",
              alignItems: m.r === "user" ? "flex-end" : "flex-start",
              gap: 6
            }}>
              <div className="eyebrow">
                {m.r === "user" ? "あなた" : "AI Assistant"}
              </div>
              <div className="serif" style={{
                maxWidth: 640,
                padding: m.r === "user" ? "14px 18px" : 0,
                background: m.r === "user" ? "var(--ink)" : "transparent",
                color: m.r === "user" ? "var(--bg-elev)" : "var(--ink)",
                fontSize: 15, lineHeight: 1.85,
                fontWeight: 500,
                whiteSpace: "pre-wrap",
                borderLeft: m.r !== "user" ? "2px solid var(--ink)" : 0,
                paddingLeft: m.r !== "user" ? 16 : undefined
              }}>{m.t}</div>
            </div>
          ))}
          {loading && (
            <div style={{ borderLeft: "2px solid var(--ink)", paddingLeft: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>AI Assistant</div>
              <div className="thinking-dots"><span /><span /><span /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>例</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderTop: "1px solid var(--line)" }}>
            {[
              "我が社が一番有利な補助金は？",
              "IT 導入補助金とものづくり補助金の違いは？",
              "申請書ドラフトを作って",
            ].map(q => (
              <button key={q} onClick={() => send(q)} style={{
                padding: "10px 16px 10px 0",
                fontSize: 13,
                color: "var(--ink-2)",
                marginRight: 18,
                borderBottom: "1px solid var(--line)",
                fontWeight: 400
              }}>{q} →</button>
            ))}
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); send(draft); }} className="row" style={{ gap: 0, border: "1px solid var(--line-strong)" }}>
          <input className="input" placeholder="補助金について自由に質問..." value={draft} onChange={e => setDraft(e.target.value)} disabled={loading}
            style={{ border: 0, padding: "14px 18px", flex: 1 }} />
          <button className="btn btn-primary" disabled={loading || !draft.trim()} style={{ borderRadius: 0, padding: "14px 22px" }}>
            送信 →
          </button>
        </form>
      </div>
    </div>
  );
};
