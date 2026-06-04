import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { SUBSIDIES, MOCK_ALERTS } from '../data';

// Helper to check if Firebase is configured with real credentials
const isFirebaseMock = () => {
  return !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "mock-api-key";
};

// 1. Subsidies
export const fetchSubsidies = async () => {
  if (isFirebaseMock()) {
    return SUBSIDIES;
  }
  try {
    const q = query(collection(db, 'subsidies'));
    const querySnapshot = await getDocs(q);
    const subsidies = [];
    querySnapshot.forEach((doc) => {
      subsidies.push({ id: doc.id, ...doc.data() });
    });
    return subsidies.length > 0 ? subsidies : SUBSIDIES;
  } catch (error) {
    console.warn("Failed to fetch subsidies from Firestore, falling back to mock data:", error);
    return SUBSIDIES;
  }
};

export const searchSubsidies = async (companyData) => {
  const { employeeCount, industry, prefecture } = companyData;
  const apiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001/api/search-subsidies'
    : '/api/search-subsidies';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ employeeCount, industry, prefecture })
    });
    const result = await response.json();
    if (result && result.success && result.subsidies) {
      return result.subsidies;
    }
  } catch (error) {
    console.error("Failed to query searchSubsidies API, falling back to client-side filter:", error);
  }

  // Fallback match scoring logic directly in frontend for offline robustness
  const allSubsidies = await fetchSubsidies();
  const matched = allSubsidies.map(sub => {
    let score = 60;
    const matchReasons = [];
    const ind = (industry || "").toLowerCase();
    const cat = (sub.category || "").toLowerCase();
    const tags = (sub.tags || []).map(t => t.toLowerCase());
    const name = (sub.name || "").toLowerCase();

    let isITCompany = ind.includes("ソフトウェア") || ind.includes("saas") || ind.includes("it") || ind.includes("情報") || ind.includes("web");
    let isManufacturing = ind.includes("製造") || ind.includes("メーカー") || ind.includes("機械");

    if (isITCompany) {
      if (cat.includes("dx") || cat.includes("it") || tags.includes("dx") || tags.includes("it") || name.includes("it") || name.includes("デジタル")) {
        score += 25;
        matchReasons.push(`業種「${industry}」に最適なIT・DX支援制度`);
      } else {
        score += 10;
        matchReasons.push("新分野展開枠として該当");
      }
    } else if (isManufacturing) {
      if (cat.includes("設備") || cat.includes("ものづくり") || tags.includes("設備投資")) {
        score += 25;
        matchReasons.push(`製造業「${industry}」の設備投資計画に合致`);
      } else {
        score += 10;
        matchReasons.push("一般設備投資枠として対象");
      }
    } else {
      score += 5;
      matchReasons.push(`幅広い業種（${industry}ai含む）が対象`);
    }

    const emp = Number(employeeCount) || 10;
    if (sub.id === "jizoku-15") {
      if (emp <= 5) {
        score += 15;
        matchReasons.push(`従業員規模 ${emp}名：小規模事業者要件（5名以下）に完全合致`);
      } else if (emp <= 20) {
        score += 8;
        matchReasons.push(`従業員規模 ${emp}名：小規模事業者要件（20名以下枠）に合致`);
      } else {
        score -= 40;
        matchReasons.push(`従業員規模 ${emp}名：小規模事業者枠（20名）超過の可能性`);
      }
    } else {
      if (emp <= 300) {
        score += 5;
        matchReasons.push(`従業員規模 ${emp}名：中小企業要件に適合`);
      }
    }

    const pref = (prefecture || "").trim();
    const subTagsJoined = tags.join(" ");
    const isTokyoSub = name.includes("東京都") || name.includes("東京") || subTagsJoined.includes("東京都") || subTagsJoined.includes("東京") || (sub.agency && sub.agency.includes("東京都"));

    if (isTokyoSub) {
      if (pref.includes("東京都") || pref.includes("東京")) {
        score += 15;
        matchReasons.push(`本店所在地が東京都内であるため対象`);
      } else {
        score = 10;
        matchReasons.push(`対象地域（東京都）外のため申請不可の可能性が高い`);
      }
    } else {
      score += 5;
      matchReasons.push("全国公募のため地域制限なし");
    }

    score = Math.max(10, Math.min(99, score));
    return { ...sub, score, matchReasons };
  });

  return matched.sort((a, b) => b.score - a.score);
};


// 2. Watchlist / Bookmarks
export const getWatchlist = async (userId) => {
  if (isFirebaseMock() || !userId) {
    return SUBSIDIES.slice(0, 5);
  }
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().watchlist) {
      const watchlistIds = docSnap.data().watchlist;
      const allSubsidies = await fetchSubsidies();
      return allSubsidies.filter(s => watchlistIds.includes(s.id));
    }
    return [];
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return SUBSIDIES.slice(0, 5);
  }
};

export const toggleWatchlist = async (userId, subsidyId) => {
  if (isFirebaseMock() || !userId) return true;
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    let watchlist = [];
    if (docSnap.exists() && docSnap.data().watchlist) {
      watchlist = docSnap.data().watchlist;
    }
    
    if (watchlist.includes(subsidyId)) {
      watchlist = watchlist.filter(id => id !== subsidyId);
    } else {
      watchlist.push(subsidyId);
    }
    
    await setDoc(docRef, { watchlist }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating watchlist:", error);
    return false;
  }
};

// 3. Alerts
export const getAlerts = async (companyId) => {
  if (isFirebaseMock() || !companyId) {
    return MOCK_ALERTS;
  }
  try {
    const q = query(
      collection(db, 'alerts'), 
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const alerts = [];
    querySnapshot.forEach((doc) => {
      alerts.push({ id: doc.id, ...doc.data() });
    });
    return alerts.length > 0 ? alerts : MOCK_ALERTS;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return MOCK_ALERTS;
  }
};

export const markAlertAsRead = async (alertId) => {
  if (isFirebaseMock()) return true;
  try {
    const docRef = doc(db, 'alerts', alertId);
    await updateDoc(docRef, { read: true });
    return true;
  } catch (error) {
    console.error("Error marking alert as read:", error);
    return false;
  }
};

// 4. Booking Slot Consultation
export const createConsultation = async (userId, expertId, subsidyId, slot, note) => {
  if (isFirebaseMock()) return true;
  try {
    await addDoc(collection(db, 'consultations'), {
      userId,
      expertId,
      subsidyId,
      slot,
      note,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    return true;
  } catch (error) {
    console.error("Error creating consultation:", error);
    return false;
  }
};
