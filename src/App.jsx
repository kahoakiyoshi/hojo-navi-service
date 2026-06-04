import React, { useState, useEffect } from 'react';
import './styles.css';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio } from './tweaks-panel';
import { MobileStatus, BotNav } from './ui';
import { Landing, Analyze, Diagnose } from './screens-1-discover';
import { Result, SubsidyDetail } from './screens-2-result';
import { MyPage } from './screens-3-mypage';
import { Watchlist } from './screens-3-watchlist';
import { Alerts } from './screens-3-alerts';
import { Expert } from './screens-3-expert';
import { Auth } from './screens-3-auth';
import { AIChatPage } from './screens-3-aichat';
import { Admin } from './screens-3-admin';

const SCREENS = [
  { id: "USR-01", label: "ランディング", group: "ユーザー: 発見", comp: "Landing" },
  // { id: "USR-02", label: "URL解析", group: "ユーザー: 発見", comp: "Analyze" },
  // { id: "USR-03", label: "4ステップ診断", group: "ユーザー: 発見", comp: "Diagnose" },
  // { id: "USR-04", label: "診断結果", group: "ユーザー: 発見", comp: "Result" },
  // { id: "USR-05", label: "補助金詳細", group: "ユーザー: 探索", comp: "SubsidyDetail" },
  { id: "USR-07", label: "マイページ", group: "ユーザー: アカウント", comp: "MyPage" },
  { id: "USR-09", label: "アラート", group: "ユーザー: アカウント", comp: "Alerts" },
  { id: "USR-10", label: "ウォッチリスト", group: "ユーザー: アカウント", comp: "Watchlist" },
  { id: "USR-11", label: "専門家相談", group: "ユーザー: アカウント", comp: "Expert" },
  { id: "AI-CHAT", label: "AIアシスタント", group: "AI機能", comp: "AIChatPage" },
  { id: "AUTH-01", label: "ログイン", group: "認証", comp: "AuthLogin" },
  { id: "AUTH-02", label: "新規登録", group: "認証", comp: "AuthReg" },
  { id: "ADM-01", label: "管理ダッシュ", group: "管理側", comp: "Admin" },
];

const DEFAULT_TWEAKS = {
  "theme": "light",
  "density": "comfortable",
  "device": "desktop",
  "searchMode": "filter",
  "cardStyle": "scoreRing"
};

import { MOCK_COMPANY } from './data';
import { searchSubsidies, toggleWatchlist } from './services/db';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  const [screen, setScreen] = useState("USR-01");
  const [subsidyId, setSubsidyId] = useState("it-2026");
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);
  const [company, setCompany] = useState(MOCK_COMPANY);
  const [matchedSubsidies, setMatchedSubsidies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [analyzeUrl, setAnalyzeUrl] = useState("https://sample-works.co.jp");

  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || 'user');
            setWatchlist(userDoc.data().watchlist || []);
          } else {
            setRole('user');
            setWatchlist([]);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setRole('user');
          setWatchlist([]);
        }
      } else {
        setRole(null);
        setWatchlist([]);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Router guard to secure admin and regular screens based on authentication and role
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      if (screen === "ADM-01" && role !== 'admin') {
        setScreen("USR-07"); // Redirect regular user away from Admin
      } else if (!initialRedirectDone && ["USR-01", "AUTH-01", "AUTH-02"].includes(screen)) {
        setScreen(role === 'admin' ? "ADM-01" : "USR-07"); // Redirect logged-in user to dashboard on initial load
        setInitialRedirectDone(true);
      }
    } else {
      if (["USR-07", "USR-09", "USR-10", "USR-11", "AI-CHAT", "ADM-01"].includes(screen)) {
        setScreen("USR-01"); // Redirect logged-out user to Landing
      }
    }
  }, [screen, role, user, authLoading, initialRedirectDone]);

  useEffect(() => {
    document.body.className = `theme-${t.theme} density-${t.density}`;
  }, [t.theme, t.density]);

  if (authLoading) {
    return (
      <div style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        color: "var(--ink-3)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div className="sb-mark" style={{ width: 42, height: 42, fontSize: 18, margin: "0 auto 16px" }}>HJ</div>
          <div className="eyebrow pulse" style={{ marginTop: 12 }}>読み込み中...</div>
        </div>
      </div>
    );
  }

  const updateCompanyAndSearch = async (updatedCompany) => {
    setCompany(updatedCompany);
    setIsSearching(true);
    try {
      const results = await searchSubsidies(updatedCompany);
      setMatchedSubsidies(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setScreen("USR-01");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const handleToggleWatchlist = async (subsidyId) => {
    if (!user) {
      setScreen("AUTH-01");
      return;
    }
    const newList = watchlist.includes(subsidyId) 
      ? watchlist.filter(id => id !== subsidyId) 
      : [...watchlist, subsidyId];
    setWatchlist(newList);
    try {
      await toggleWatchlist(user.uid, subsidyId);
    } catch(e) {
      console.error("Failed to update watchlist", e);
      // Revert if failed
      setWatchlist(watchlist);
    }
  };

  const renderScreen = () => {
    const goto = (id) => setScreen(id);
    const openDetail = (id) => {
      setSubsidyId(id || "it-2026");
      setScreen("USR-05");
    };
    switch (screen) {
      case "USR-01":
        return <Landing isMobile={isMobile} onStart={(u) => { setAnalyzeUrl(u); setScreen("USR-02"); }} onLogin={() => setScreen("AUTH-01")} user={user} onGoToMyPage={() => setScreen(role === 'admin' ? "ADM-01" : "USR-07")} />;
      case "USR-02":
        return <Analyze isMobile={isMobile} url={analyzeUrl} onDone={(updatedCompany) => { updateCompanyAndSearch(updatedCompany); setScreen("USR-03"); }} />;
      case "USR-03":
        return <Diagnose isMobile={isMobile} company={company} onDone={() => setScreen("USR-04")} />;
      case "USR-04":
        return <Result isMobile={isMobile} company={company} subsidiesList={matchedSubsidies} isSearching={isSearching} onOpenDetail={openDetail} searchMode={t.searchMode} onSwitchMode={(m) => setTweak({ searchMode: m })} watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />;
      case "USR-05":
        return <SubsidyDetail isMobile={isMobile} subsidyId={subsidyId} subsidiesList={matchedSubsidies} onBack={() => setScreen("USR-04")} onConsult={() => setScreen("USR-11")} watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />;
      case "USR-07":
        return <MyPage isMobile={isMobile} onOpenDetail={openDetail} onNav={goto} onLogout={handleLogout} watchlist={watchlist} />;
      case "USR-09":
        return <Alerts isMobile={isMobile} onOpenDetail={openDetail} />;
      case "USR-10":
        return <Watchlist isMobile={isMobile} onOpenDetail={openDetail} watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />;
      case "USR-11":
        return <Expert isMobile={isMobile} />;
      case "AI-CHAT":
        return <AIChatPage isMobile={isMobile} />;
      case "AUTH-01":
        return <Auth isMobile={isMobile} mode="login" onSwitch={(m) => setScreen(m === "register" ? "AUTH-02" : "AUTH-01")} onDone={() => setScreen("USR-07")} onBack={() => setScreen("USR-01")} />;
      case "AUTH-02":
        return <Auth isMobile={isMobile} mode="register" onSwitch={(m) => setScreen(m === "register" ? "AUTH-02" : "AUTH-01")} onDone={() => setScreen("USR-07")} onBack={() => setScreen("USR-01")} />;
      case "ADM-01":
        return <Admin />;
      default:
        return <div style={{ padding: 60 }}>Screen {screen} not found</div>;
    }
  };

  const isLoggedInScreen = ["USR-04", "USR-05", "USR-07", "USR-09", "USR-10", "USR-11", "AI-CHAT", "ADM-01"].includes(screen);

  return (
    <div className="app" style={{ display: "block", minHeight: "100vh" }}>
      {/* Global Desktop Navigation Header for Logged-in screens */}
      {!isMobile && isLoggedInScreen && (
        <div style={{
          background: "var(--bg-elev)",
          borderBottom: "1px solid var(--line)",
          padding: "0 56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="sb-mark" style={{ width: 28, height: 28 }}>HJ</div>
            <div style={{ fontWeight: 600, fontSize: 15, fontFamily: "var(--font-display)" }}>
              HojoNavi
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 8, height: "100%" }}>
            {[
              { id: "USR-07", label: "マイページ" },
              { id: "USR-04", label: "補助金検索" },
              { id: "USR-10", label: "ウォッチリスト" },
              { id: "USR-09", label: "アラート" },
              { id: "USR-11", label: "専門家相談" },
              { id: "AI-CHAT", label: "AIアシスタント" },
              role === 'admin' && { id: "ADM-01", label: "管理者画面" }
            ].filter(Boolean).map(item => (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                style={{
                  padding: "0 16px",
                  height: "100%",
                  fontSize: "13px",
                  fontWeight: screen === item.id ? 600 : 500,
                  color: screen === item.id ? "var(--ink)" : "var(--ink-3)",
                  borderBottom: screen === item.id ? "2px solid var(--ink)" : "2px solid transparent",
                  transition: "all 150ms",
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              style={{
                padding: "0 16px",
                height: "100%",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--ink)",
                borderBottom: "2px solid transparent",
                transition: "all 150ms",
                background: "none",
                border: "none",
                cursor: "pointer",
                opacity: 0.7
              }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--crimson)"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = "var(--ink)"; }}
            >
              ログアウト
            </button>
          </div>
        </div>
      )}

      {/* Main page content area */}
      <main style={{ minHeight: !isMobile && isLoggedInScreen ? "calc(100vh - 56px)" : "100vh", background: "var(--bg)" }}>
        {renderScreen()}
      </main>

      {/* Bottom Nav for Mobile view */}
      {isMobile && !["USR-01", "USR-02", "USR-03", "AUTH-01", "AUTH-02"].includes(screen) && (
        <div style={{ position: "sticky", bottom: 0, zIndex: 100, width: "100%" }}>
          <BotNav active={screen} onChange={setScreen} />
        </div>
      )}

      <TweaksMount t={t} setTweak={setTweak} />
    </div>
  );
}

const TweaksMount = ({ t, setTweak }) => {
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
