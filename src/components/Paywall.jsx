import React, { useState } from 'react';
import { DEFAULT_PLAN } from '../services/membership';

export const Paywall = ({ onUpgrade, isMobile }) => {
  const [loading, setLoading] = useState(false);
  const plan = DEFAULT_PLAN;

  const handleUpgrade = async () => {
    setLoading(true);
    // Simulate API call and redirect to stripe
    await new Promise(resolve => setTimeout(resolve, 1500));
    await onUpgrade();
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{
      maxWidth: 680,
      margin: isMobile ? "20px auto 80px" : "40px auto 60px",
      padding: isMobile ? "28px 20px" : "48px 40px",
      background: "var(--bg-elev)",
      border: "1px solid var(--line-strong)",
      textAlign: "center",
      boxShadow: "var(--shadow-lg)"
    }}>
      <div className="sb-mark" style={{ width: 42, height: 42, fontSize: 18, margin: "0 auto 24px" }}>HJ</div>
      
      <div className="eyebrow eyebrow-amber" style={{ marginBottom: 12, fontSize: 11 }}>
        プレミアム機能 · Premium Feature
      </div>
      
      <h2 className="display" style={{
        fontSize: isMobile ? 24 : 32,
        fontWeight: 600,
        margin: "0 0 16px",
        letterSpacing: "-0.015em",
        lineHeight: 1.3
      }}>
        {plan.name}へのアップグレードが必要です
      </h2>
      
      <p style={{
        color: "var(--ink-3)",
        fontSize: 14,
        lineHeight: 1.8,
        maxWidth: 520,
        margin: "0 auto 32px"
      }}>
        この機能（AIアシスタント相談、専門家との個別相談予約など）は、有料プランのご契約が必要です。公募情報の早期予測通知や、採択率を高めるアドバイスをご活用ください。
      </p>

      {/* Plan Card */}
      <div style={{
        background: "var(--bg-inset)",
        border: "1px solid var(--line)",
        padding: "24px 20px",
        marginBottom: 36,
        textAlign: "left"
      }}>
        <div className="between" style={{ marginBottom: 18, borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
          <span className="serif bold" style={{ fontSize: 18 }}>{plan.name}</span>
          <span>
            <strong className="num" style={{ fontSize: 24, fontWeight: 700 }}>
              ¥{plan.price.toLocaleString()}
            </strong>
            <span className="muted sm"> / 月（税込）</span>
          </span>
        </div>
        
        <div className="col" style={{ gap: 10 }}>
          {plan.features.map((f, i) => (
            <div key={i} className="row" style={{ alignItems: "flex-start", gap: 10 }}>
              <span className="num" style={{ color: "var(--amber)", fontWeight: "bold" }}>✓</span>
              <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="btn btn-primary btn-lg" 
        style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}
        onClick={handleUpgrade}
        disabled={loading}
      >
        {loading ? (
          <span className="row" style={{ justifyContent: "center", gap: 8 }}>
            <span className="spin" style={{ width: 14, height: 14, border: "2px solid var(--bg-elev)", borderTopColor: "transparent", borderRadius: "50%" }} />
            Stripe 決済画面へリダイレクト中...
          </span>
        ) : (
          `Stripe で購読する (¥${plan.price.toLocaleString()}/月) →`
        )}
      </button>

      <div className="muted sm" style={{ marginTop: 16 }}>
        Stripeの安全な決済システムを利用しています。いつでも解約可能です。
      </div>
    </div>
  );
};
