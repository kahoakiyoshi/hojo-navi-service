import React, { useState } from 'react';
import { MOCK_EXPERTS } from './data';
import { useAuth } from './context/AuthContext';

export const Auth = ({ mode, onSwitch, onDone, isMobile, onBack }) => {
  const { login, register } = useAuth();
  const isLogin = mode === "login";
  const [name, setName] = useState("田中 太郎");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("メールアドレスとパスワードを入力してください。");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        onDone();
      } else {
        await register(email, password, name);
        onDone();
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setErrorMsg("メールアドレスまたはパスワードが正しくありません。");
      } else if (err.code === "auth/email-already-in-use") {
        setErrorMsg("このメールアドレスは既に登録されています。");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg("パスワードが弱すぎます。6文字以上にしてください。");
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg("無効なメールアドレス形式です。");
      } else {
        setErrorMsg(`エラーが発生しました: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: isMobile ? 700 : 760,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      background: "var(--bg)"
    }}>
      {!isMobile && (
        <div style={{
          padding: "60px 50px",
          borderRight: "1px solid var(--line-ink)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div className="row" style={{ gap: 10, marginBottom: 36 }}>
              <div className="sb-mark">HJ</div>
              <div style={{ fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 16 }}>HojoNavi</div>
            </div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              {isLogin ? "Sign In" : "New Account"}
            </div>
            <h2 className="display" style={{ fontSize: 38, lineHeight: 1.3, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>
              {isLogin ? <>ようこそ。<br />あなたの補助金、<br /><em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>待っています。</em></>
                : <>3 分で会員登録。<br /><em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>公募前アラート</em>で<br />機会を逃さない。</>}
            </h2>
            <p style={{ color: "var(--ink-3)", lineHeight: 1.85, marginTop: 28, fontSize: 14, maxWidth: 360 }}>
              {isLogin ? "登録済みのウォッチリスト・アラート・申請進捗にアクセスできます。"
                : "メール+PW で 30 秒登録 → 公募前アラート → 専門家相談予約。初回 30 分無料相談を即利用可能です。"}
            </p>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>専門家ネットワーク</div>
            <div className="col" style={{ gap: 8 }}>
              {MOCK_EXPERTS.map(e => (
                <div key={e.id} style={{ fontSize: 13 }}>
                  <span className="serif" style={{ fontWeight: 600 }}>{e.name}</span>
                  <span className="muted-2" style={{ marginLeft: 10, fontSize: 11 }}>{e.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: isMobile ? "40px 22px" : "60px 50px", display: "flex", alignItems: "center" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}>
          {onBack && (
            <div style={{ marginBottom: 16 }}>
              <button type="button" className="btn-link tiny" style={{ borderBottom: "none", display: "inline-flex", alignItems: "center", gap: 4 }} onClick={onBack}>
                ← ホームに戻る
              </button>
            </div>
          )}
          {isMobile && (
            <div className="row" style={{ gap: 10, marginBottom: 36 }}>
              <div className="sb-mark">HJ</div>
              <div style={{ fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 16 }}>HojoNavi</div>
            </div>
          )}
          <h2 className="display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.015em" }}>
            {isLogin ? "ログイン" : "新規会員登録"}
          </h2>
          <div className="muted sm" style={{ marginBottom: 20 }}>
            {isLogin ? "メールアドレスとパスワードを入力" : "30 秒で完了します"}
          </div>

          {errorMsg && (
            <div style={{
              background: "var(--crimson-soft)",
              color: "var(--crimson)",
              padding: "10px 14px",
              fontSize: 13,
              marginBottom: 20,
              borderLeft: "2px solid var(--crimson)"
            }}>
              {errorMsg}
            </div>
          )}

          <div className="col" style={{ gap: 18 }}>
            {!isLogin && (
              <div>
                <div className="label">お名前</div>
                <input className="input" placeholder="田中 太郎" value={name} onChange={e => setName(e.target.value)} disabled={loading} />
              </div>
            )}
            <div>
              <div className="label">メールアドレス</div>
              <input className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
            </div>
            <div>
              <div className="label between">
                <span>パスワード</span>
                {isLogin && <button type="button" className="btn-link tiny">忘れた方</button>}
              </div>
              <input className="input" type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
              {!isLogin && <div className="muted-2 tiny" style={{ marginTop: 6 }}>8 文字以上 · 英大小数字 + 記号</div>}
            </div>

            {!isLogin && (
              <label className="row" style={{ gap: 8, fontSize: 12, color: "var(--ink-3)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--ink)" }} disabled={loading} />
                <span><a className="btn-link" style={{ fontSize: 12 }}>利用規約</a> および <a className="btn-link" style={{ fontSize: 12 }}>プライバシーポリシー</a> に同意</span>
              </label>
            )}

            <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
              {loading ? "処理中..." : (isLogin ? "ログイン →" : "登録してはじめる →")}
            </button>

            <div className="row" style={{ gap: 10, alignItems: "center", margin: "8px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              <span className="eyebrow">OR</span>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            </div>

            <button type="button" className="btn btn-ghost btn-block" disabled style={{ padding: "12px", opacity: 0.5, cursor: "not-allowed" }}>
              Google で続ける (対応予定)
            </button>
            <button type="button" className="btn btn-ghost btn-block" disabled style={{ padding: "12px", opacity: 0.5, cursor: "not-allowed" }}>
              LINE で続ける (対応予定)
            </button>

            <div className="muted sm" style={{ textAlign: "center", marginTop: 18 }}>
              {isLogin ? "アカウントをお持ちでない方は" : "既に登録済みの方は"}
              <button type="button" className="btn-link" style={{ marginLeft: 8 }} onClick={() => onSwitch(isLogin ? "register" : "login")} disabled={loading}>
                {isLogin ? "新規登録" : "ログイン"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
