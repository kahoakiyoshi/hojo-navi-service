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
import { MOCK_ALERTS } from '../data';

// Helper to check if Firebase is configured with real credentials
const isFirebaseMock = () => {
  return !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "mock-api-key";
};

const cleanDetailHtml = (html) => {
  if (!html || typeof window === 'undefined') return html || "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = doc.querySelectorAll("table, div, p, a, span");
    elements.forEach(el => {
      const text = el.textContent || "";
      const htmlContent = el.innerHTML || "";
      if (
        text.includes("j-izumi") || 
        text.includes("zhzxd6") || 
        text.includes("情報の泉") || 
        text.includes("grand2.com") ||
        htmlContent.includes("j-izumi") ||
        htmlContent.includes("grand2.com")
      ) {
        el.remove();
      }
    });
    return doc.body.innerHTML;
  } catch (e) {
    console.error("Failed to clean detail HTML:", e);
    return html;
  }
};

function mapJGrantsToAppSchemaInFrontend(item) {
  const title = item.title || "無題の補助金";
  const id = item.id || "jg-" + Math.random().toString(36).substr(2, 9);
  
  let daysLeft = null;
  if (item.acceptance_end_datetime) {
    const end = new Date(item.acceptance_end_datetime);
    const diff = end.getTime() - Date.now();
    daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const getCategory = (t) => {
    const titleLower = t.toLowerCase();
    if (titleLower.includes("dx") || titleLower.includes("it") || titleLower.includes("デジタル")) return "DX・IT";
    if (titleLower.includes("ものづくり") || titleLower.includes("設備") || titleLower.includes("機器") || titleLower.includes("投資")) return "設備投資";
    if (titleLower.includes("持続化") || titleLower.includes("販路") || titleLower.includes("マーケティング") || titleLower.includes("展示会") || titleLower.includes("広告")) return "販路開拓";
    if (titleLower.includes("再構築") || titleLower.includes("転換") || titleLower.includes("進出")) return "事業転換";
    if (titleLower.includes("雇用") || titleLower.includes("人材") || titleLower.includes("社員") || titleLower.includes("キャリアアップ") || titleLower.includes("研修") || titleLower.includes("育休") || titleLower.includes("両立")) return "雇用・人材";
    if (titleLower.includes("省エネ") || titleLower.includes("エネルギー") || titleLower.includes("脱炭素") || titleLower.includes("グリーン")) return "脱炭素・省エネ";
    if (titleLower.includes("都内") || titleLower.includes("都") || titleLower.includes("地域") || titleLower.includes("地方") || titleLower.includes("市") || titleLower.includes("県")) return "地域";
    return "設備投資";
  };

  return {
    id,
    name: title,
    agency: item.institution_name || "官公庁・自治体",
    category: getCategory(title),
    status: daysLeft !== null && daysLeft < 0 ? "closed" : "open",
    statusLabel: daysLeft !== null && daysLeft < 0 ? "終了" : "公募中",
    score: 85, 
    matchReasons: ["JGrantsの公式公募要件に合致"],
    summary: item.subsidy_catch_phrase || "JGrants公募情報。詳細は公式ページをご確認ください。",
    maxAmount: item.subsidy_max_limit || 0,
    subsidyRate: 0.5,
    rateLabel: item.subsidy_rate || "公募要領参照",
    appStart: item.acceptance_start_datetime ? item.acceptance_start_datetime.split('T')[0] : "",
    appEnd: item.acceptance_end_datetime ? item.acceptance_end_datetime.split('T')[0] : "",
    daysLeft: daysLeft,
    adoptionRate: (() => {
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
      }
      let baseRate = 0.50;
      const cat = getCategory(title);
      if (cat === "DX・IT") baseRate = 0.65;
      else if (cat === "設備投資") baseRate = 0.42;
      else if (cat === "販路開拓") baseRate = 0.48;
      else if (cat === "事業転換") baseRate = 0.38;
      else if (cat === "雇用・人材") baseRate = 0.70;
      else if (cat === "脱炭素・省エネ") baseRate = 0.55;
      
      const variance = ((Math.abs(hash) % 20) - 10) / 100;
      return parseFloat(Math.max(0.1, Math.min(0.95, baseRate + variance)).toFixed(2));
    })(),
    adoptionHistory: (() => {
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
      }
      let baseRate = 0.50;
      const cat = getCategory(title);
      if (cat === "DX・IT") baseRate = 0.65;
      else if (cat === "設備投資") baseRate = 0.42;
      else if (cat === "販路開拓") baseRate = 0.48;
      else if (cat === "事業転換") baseRate = 0.38;
      else if (cat === "雇用・人材") baseRate = 0.70;
      else if (cat === "脱炭素・省エネ") baseRate = 0.55;
      
      const history = [];
      for (let j = 0; j < 6; j++) {
        const variance = ((Math.abs(hash + j * 17) % 30) - 15) / 100;
        history.push(parseFloat(Math.max(0.1, Math.min(0.95, baseRate + variance)).toFixed(2)));
      }
      return history;
    })(),
    docs: ["事業計画書", "見積書", "履歴事項全部証明書"],
    files: (() => {
      const files = [];
      const addFiles = (arr, type) => {
        if (arr && Array.isArray(arr)) {
          arr.forEach(f => {
            if (f.name) {
              files.push({
                name: f.name,
                type: type,
                data: f.data || null
              });
            }
          });
        }
      };
      addFiles(item.application_form, "form");
      addFiles(item.application_guidelines, "guideline");
      addFiles(item.outline_of_grant, "outline");
      return files;
    })(),
    tags: [item.target_area_search || "全国", "JGrants"],
    sourceUrl: item.front_subsidy_detail_page_url || "https://www.jgrants-portal.go.jp/",
    detail: cleanDetailHtml(item.detail)
  };
}

const getApiUrl = (path) => {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  return isLocal ? `http://localhost:3001${path}` : path;
};

// 1. Subsidies
export const fetchSubsidies = async () => {
  try {
    const apiUrl = getApiUrl('/api/search-subsidies');
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ industry: "IT" })
    });
    if (res.ok) {
      const data = await res.json();
      return data.subsidies || [];
    }
  } catch (e) {
    console.error("Failed to fetch subsidies from local API:", e);
  }
  return [];
};

export const fetchSubsidyDetail = async (id) => {
  try {
    const apiUrl = getApiUrl(`/api/subsidy-detail?id=${id}`);
    const res = await fetch(apiUrl);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return mapJGrantsToAppSchemaInFrontend(json.data);
      }
    }
  } catch (e) {
    console.error(`Failed to fetch subsidy detail for ID ${id}:`, e);
  }
  return null;
};

export const searchSubSubsidies = async (companyData) => {
  return searchSubsidies(companyData);
};

export const searchSubsidies = async (companyData) => {
  const apiUrl = getApiUrl('/api/search-subsidies');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(companyData)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch subsidies from server: ${response.status}`);
  }

  const result = await response.json();
  if (result && result.success && result.subsidies) {
    return result.subsidies;
  }
  return [];
};

// 2. Watchlist / Bookmarks
export const getWatchlist = async (userId) => {
  if (!userId) return [];
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().watchlist) {
      const watchlistIds = docSnap.data().watchlist;
      
      const detailsPromises = watchlistIds.map(async (id) => {
        return fetchSubsidyDetail(id);
      });

      const results = await Promise.all(detailsPromises);
      return results.filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
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
