// =========================
// Main App shell — sidebar nav + responsive frame + Tweaks
// =========================

const SCREENS = [
  { id: "USR-01", label: "ランディング", group: "ユーザー: 発見", comp: "Landing" },
  { id: "USR-02", label: "URL解析", group: "ユーザー: 発見", comp: "Analyze" },
  { id: "USR-03", label: "4ステップ診断", group: "ユーザー: 発見", comp: "Diagnose" },
  { id: "USR-04", label: "診断結果", group: "ユーザー: 発見", comp: "Result" },
  { id: "USR-05", label: "補助金詳細", group: "ユーザー: 探索", comp: "SubsidyDetail" },
  { id: "USR-07", label: "マイページ", group: "ユーザー: アカウント", comp: "MyPage" },
  { id: "USR-09", label: "アラート", group: "ユーザー: アカウント", comp: "Alerts" },
  { id: "USR-10", label: "ウォッチリスト", group: "ユーザー: アカウント", comp: "Watchlist" },
  { id: "USR-11", label: "専門家相談", group: "ユーザー: アカウント", comp: "Expert" },
  { id: "AI-CHAT", label: "AIアシスタント", group: "AI機能", comp: "AIChatPage" },
  { id: "AUTH-01", label: "ログイン", group: "認証", comp: "AuthLogin" },
  { id: "AUTH-02", label: "新規登録", group: "認証", comp: "AuthReg" },
  { id: "ADM-01", label: "管理ダッシュ", group: "管理側", comp: "Admin" },
];

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "comfortable",
  "device": "desktop",
  "searchMode": "filter",
  "cardStyle": "scoreRing"
}/*EDITMODE-END*/;

const App = () => {
  const [screen, setScreen] = useState("USR-01");
  const [subsidyId, setSubsidyId] = useState("it-2026");
  const [authMode, setAuthMode] = useState("login");
  const [t, setTweak] = window.useTweaks(DEFAULT_TWEAKS);

  const isMobile = t.device === "mobile";

  useEffect(() => {
    document.body.className =
      `theme-${t.theme} density-${t.density}`;
  }, [t.theme, t.density]);

  // Demo URL for the landing → analyze flow
  const [analyzeUrl, setAnalyzeUrl] = useState("https://sample-works.co.jp");

  // Render
  const renderScreen = () => {
    const goto = (id) => setScreen(id);
    const openDetail = (id) => {
      setSubsidyId(id || "it-2026");
      setScreen("USR-05");
    };
    switch (screen) {
      case "USR-01":
        return <Landing isMobile={isMobile} onStart={(u) => { setAnalyzeUrl(u); setScreen("USR-02"); }} />;
      case "USR-02":
        return <Analyze isMobile={isMobile} url={analyzeUrl} onDone={() => setScreen("USR-03")} />;
      case "USR-03":
        return <Diagnose isMobile={isMobile} onDone={() => setScreen("USR-04")} />;
      case "USR-04":
        return <Result isMobile={isMobile} onOpenDetail={openDetail} searchMode={t.searchMode} onSwitchMode={(m) => setTweak({ searchMode: m })} />;
      case "USR-05":
        return <SubsidyDetail isMobile={isMobile} subsidyId={subsidyId} onBack={() => setScreen("USR-04")} onConsult={() => setScreen("USR-11")} />;
      case "USR-07":
        return <MyPage isMobile={isMobile} onOpenDetail={openDetail} onNav={goto} />;
      case "USR-09":
        return <Alerts isMobile={isMobile} onOpenDetail={openDetail} />;
      case "USR-10":
        return <Watchlist isMobile={isMobile} onOpenDetail={openDetail} />;
      case "USR-11":
        return <Expert isMobile={isMobile} />;
      case "AI-CHAT":
        return <AIChatPage isMobile={isMobile} />;
      case "AUTH-01":
        return <Auth isMobile={isMobile} mode="login" onSwitch={(m) => setScreen(m === "register" ? "AUTH-02" : "AUTH-01")} onDone={() => setScreen("USR-07")} />;
      case "AUTH-02":
        return <Auth isMobile={isMobile} mode="register" onSwitch={(m) => setScreen(m === "register" ? "AUTH-02" : "AUTH-01")} onDone={() => setScreen("USR-07")} />;
      case "ADM-01":
        return <Admin />;
      default:
        return <div style={{ padding: 60 }}>Screen {screen} not found</div>;
    }
  };

  const cur = SCREENS.find(s => s.id === screen);
  const groups = [...new Set(SCREENS.map(s => s.group))];

  // For some screens the mobile frame doesn't make sense
  const desktopOnly = screen === "ADM-01";
  const showAsDesktop = isMobile && desktopOnly ? false : isMobile;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-mark">泉</div>
          <div className="sb-name">
            補助金の泉
            <small>補助金インテリジェンスAI</small>
          </div>
        </div>
        <hr className="divider" style={{ margin: "10px 14px" }} />
        {groups.map(g => (
          <div key={g}>
            <div className="sb-section">{g}</div>
            {SCREENS.filter(s => s.group === g).map(s => (
              <div key={s.id}
                className={`sb-item ${screen === s.id ? "active" : ""}`}
                onClick={() => setScreen(s.id)}>
                <span style={{ flex: 1 }}>{s.label}</span>
                <span className="sb-id">{s.id}</span>
              </div>
            ))}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: 14, borderTop: "1px solid var(--line)", fontSize: 11, color: "var(--ink-4)", fontFamily: "var(--font-mono)", lineHeight: 1.6 }}>
          v0.4 · 5/27 hi-fi prototype<br />
          秋吉×岡田 JV
        </div>
      </aside>

      <main className="canvas">
        <div className="cv-topbar">
          <span className="cv-crumbs">
            補助金の泉 / <strong>{cur?.label}</strong>
          </span>
          <span className="num muted-2" style={{ fontSize: 10, letterSpacing: "0.08em" }}>{cur?.id}</span>
          <span className="cv-spacer" />
          <div className="cv-toggle">
            <button className={!isMobile ? "on" : ""} onClick={() => setTweak({ device: "desktop" })}>
              Desktop
            </button>
            <button className={isMobile ? "on" : ""} onClick={() => setTweak({ device: "mobile" })} disabled={desktopOnly} style={desktopOnly ? { opacity: 0.4, cursor: "not-allowed" } : {}}>
              Mobile
            </button>
          </div>
        </div>

        <div className="cv-stage">
          {showAsDesktop ? (
            <div className="frame frame-mobile">
              <div className="frame-inner" style={{ borderRadius: 28 }}>
                <MobileStatus dark={t.theme === "dark"} />
                {renderScreen()}
                {!["USR-01", "USR-02", "USR-03", "AUTH-01", "AUTH-02"].includes(screen) && (
                  <BotNav active={screen} onChange={setScreen} />
                )}
              </div>
            </div>
          ) : (
            <div className="frame frame-desktop">
              <div className="frame-inner">
                {renderScreen()}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Tweaks panel (host-driven) */}
      <TweaksMount t={t} setTweak={setTweak} />
    </div>
  );
};

// ====== Tweaks Panel — uses host protocol ======
const TweaksMount = ({ t, setTweak }) => {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="ビジュアル">
        <TweakRadio label="テーマ" value={t.theme} onChange={v => setTweak({ theme: v })}
          options={[
            { value: "light", label: "Light" },
            { value: "cream", label: "Cream" },
            { value: "dark", label: "Dark" },
          ]} />
        <TweakRadio label="情報密度" value={t.density} onChange={v => setTweak({ density: v })}
          options={[
            { value: "comfortable", label: "標準" },
            { value: "compact", label: "詰め" },
          ]} />
      </TweakSection>
      <TweakSection label="プレビュー">
        <TweakRadio label="デバイス" value={t.device} onChange={v => setTweak({ device: v })}
          options={[
            { value: "desktop", label: "PC" },
            { value: "mobile", label: "スマホ" },
          ]} />
      </TweakSection>
      <TweakSection label="検索UI">
        <TweakRadio label="診断結果の探索" value={t.searchMode} onChange={v => setTweak({ searchMode: v })}
          options={[
            { value: "filter", label: "フィルタ" },
            { value: "chat", label: "AIチャット" },
          ]} />
      </TweakSection>
    </TweaksPanel>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
