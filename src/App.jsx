import React, { useState, useEffect } from 'react';
import './styles.css';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio } from './tweaks-panel';
import { MobileStatus, BotNav } from './ui';
import { Landing, Analyze, Diagnose } from './discover';
import { Result, SubsidyDetail } from './result';
import { MyPage } from './mypage';
import { Watchlist } from './watchlist';
import { Alerts } from './alerts';
import { Expert } from './expert';
import { Auth } from './auth';
import { AIChatPage } from './aichat';
import { Admin } from './admin';

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
import { searchSubsidies } from './services/db';
import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';

const PATH_TO_SCREEN = {
  "/": "USR-01",
  "/analyze": "USR-02",
  "/diagnose": "USR-03",
  "/search": "USR-04",
  "/mypage": "USR-07",
  "/alerts": "USR-09",
  "/watchlist": "USR-10",
  "/expert": "USR-11",
  "/aichat": "AI-CHAT",
  "/login": "AUTH-01",
  "/register": "AUTH-02",
  "/admin": "ADM-01"
};

const routeMap = {
  "USR-01": "/",
  "USR-02": "/analyze",
  "USR-03": "/diagnose",
  "USR-04": "/search",
  "USR-05": "/subsidy",
  "USR-07": "/mypage",
  "USR-08": "/mypage",
  "USR-09": "/alerts",
  "USR-10": "/watchlist",
  "USR-11": "/expert",
  "AI-CHAT": "/aichat",
  "AUTH-01": "/login",
  "AUTH-02": "/register",
  "ADM-01": "/admin"
};

const SubsidyDetailWrapper = ({ isMobile, subsidiesList, watchlist, onToggleWatchlist }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <SubsidyDetail 
      isMobile={isMobile} 
      subsidyId={id || "it-2026"} 
      subsidiesList={subsidiesList} 
      onBack={() => navigate("/search")} 
      onConsult={() => navigate("/expert")} 
      watchlist={watchlist} 
      onToggleWatchlist={onToggleWatchlist} 
    />
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);
  const [company, setCompany] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("company");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved company", e);
        }
      }
    }
    return MOCK_COMPANY;
  });
  const [matchedSubsidies, setMatchedSubsidies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user, role, isPremium, membershipStatus, watchlist, authLoading, logout, toggleWatchlist, upgradeToPremium } = useAuth();
  const [analyzeUrl, setAnalyzeUrl] = useState("https://sample-works.co.jp");

  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);

  const getScreenFromPath = (pathname) => {
    if (pathname.startsWith("/subsidy/")) return "USR-05";
    return PATH_TO_SCREEN[pathname] || "USR-01";
  };
  const screen = getScreenFromPath(location.pathname);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Router guard to secure admin and regular screens based on authentication and role
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      if (screen === "ADM-01" && role !== 'admin') {
        navigate("/mypage", { replace: true });
      } else if (!initialRedirectDone && ["USR-01", "AUTH-01", "AUTH-02"].includes(screen)) {
        navigate(role === 'admin' ? "/admin" : "/mypage", { replace: true });
        setInitialRedirectDone(true);
      }
    } else {
      if (["USR-07", "USR-09", "USR-10", "USR-11", "AI-CHAT", "ADM-01"].includes(screen)) {
        navigate("/", { replace: true });
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
    if (typeof window !== "undefined") {
      localStorage.setItem("company", JSON.stringify(updatedCompany));
    }
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
      await logout();
      navigate("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const handleToggleWatchlist = async (subsidyId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    await toggleWatchlist(subsidyId);
  };

  const goto = (id) => {
    navigate(routeMap[id] || "/");
  };

  const openDetail = (id) => {
    navigate(`/subsidy/${id || "it-2026"}`);
  };

  const isLoggedInScreen = ["USR-04", "USR-05", "USR-07", "USR-09", "USR-10", "USR-11", "AI-CHAT", "ADM-01"].includes(screen);

  return (
    <div className="app" style={{ display: "block", minHeight: "100vh" }}>
      {/* Global Mobile Sticky Header for Logged-in screens */}
      {isMobile && isLoggedInScreen && (
        <div style={{
          background: "var(--bg-elev)",
          borderBottom: "1px solid var(--line)",
          padding: "0 22px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="sb-mark" style={{ width: 24, height: 24, fontSize: 11, lineHeight: "24px" }}>HJ</div>
            <div style={{ fontWeight: 600, fontSize: 15, fontFamily: "var(--font-display)" }}>
              HojoNavi
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ padding: 0, borderRadius: "50%" }} onClick={() => navigate(role === 'admin' ? "/admin" : "/mypage")}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--navy)", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>
              {user?.name ? user.name.slice(0, 1) : "U"}
            </div>
          </button>
        </div>
      )}

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
                onClick={() => goto(item.id)}
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
        <Routes>
          <Route path="/" element={<Landing isMobile={isMobile} onStart={(u) => { setAnalyzeUrl(u); navigate("/analyze"); }} onLogin={() => navigate("/login")} user={user} onGoToMyPage={() => navigate(role === 'admin' ? "/admin" : "/mypage")} />} />
          <Route path="/analyze" element={<Analyze isMobile={isMobile} url={analyzeUrl} onDone={(updatedCompany) => { updateCompanyAndSearch(updatedCompany); navigate("/diagnose"); }} />} />
          <Route path="/diagnose" element={
            <Diagnose 
              isMobile={isMobile} 
              company={company} 
              onDone={(diagnoseData) => {
                let currentCompany = company;
                if ((currentCompany.employeeCount == null && !currentCompany.industry && !currentCompany.prefecture) && typeof window !== "undefined") {
                  const saved = localStorage.getItem("company");
                  if (saved) {
                    try {
                      currentCompany = JSON.parse(saved);
                    } catch (e) {}
                  }
                }
                const params = new URLSearchParams();
                if (currentCompany.employeeCount != null) params.set("employeeCount", currentCompany.employeeCount);
                if (currentCompany.industry) params.set("industry", currentCompany.industry);
                if (currentCompany.prefecture) params.set("prefecture", currentCompany.prefecture);
                if (currentCompany.name) params.set("name", currentCompany.name);
                if (diagnoseData) {
                  if (diagnoseData.purpose) params.set("purpose", diagnoseData.purpose);
                  if (diagnoseData.budget) params.set("budget", diagnoseData.budget);
                  if (diagnoseData.timing) params.set("timing", diagnoseData.timing);
                  params.set("preexisting", String(diagnoseData.preexisting));
                }
                navigate(`/search?${params.toString()}`);
              }} 
            />
          } />
          <Route path="/search" element={<Result isMobile={isMobile} company={company} subsidiesList={matchedSubsidies} isSearching={isSearching} onOpenDetail={openDetail} searchMode={t.searchMode} onSwitchMode={(m) => setTweak({ searchMode: m })} watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />} />
          <Route path="/subsidy/:id" element={<SubsidyDetailWrapper isMobile={isMobile} subsidiesList={matchedSubsidies} watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />} />
          <Route path="/mypage" element={<MyPage isMobile={isMobile} onOpenDetail={openDetail} onNav={goto} onLogout={handleLogout} watchlist={watchlist} isPremium={isPremium} membershipStatus={membershipStatus} onUpgrade={upgradeToPremium} />} />
          <Route path="/alerts" element={<Alerts isMobile={isMobile} onOpenDetail={openDetail} />} />
          <Route path="/watchlist" element={<Watchlist isMobile={isMobile} onOpenDetail={openDetail} watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />} />
          <Route path="/expert" element={<Expert isMobile={isMobile} isPremium={isPremium} onUpgrade={upgradeToPremium} />} />
          <Route path="/aichat" element={<AIChatPage isMobile={isMobile} isPremium={isPremium} onUpgrade={upgradeToPremium} />} />
          <Route path="/login" element={<Auth isMobile={isMobile} mode="login" onSwitch={(m) => navigate(m === "register" ? "/register" : "/login")} onDone={() => navigate("/mypage")} onBack={() => navigate("/")} />} />
          <Route path="/register" element={<Auth isMobile={isMobile} mode="register" onSwitch={(m) => navigate(m === "register" ? "/register" : "/login")} onDone={() => navigate("/mypage")} onBack={() => navigate("/")} />} />
          <Route path="/admin" element={<Admin isMobile={isMobile} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom Nav for Mobile view */}
      {isMobile && !["USR-01", "USR-02", "USR-03", "AUTH-01", "AUTH-02"].includes(screen) && (
        <div style={{ position: "sticky", bottom: 0, zIndex: 100, width: "100%" }}>
          <BotNav active={screen} onChange={goto} />
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
