const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

admin.initializeApp();
const db = admin.firestore();

// 1. Scheduled function to sync subsidies from jGrants API daily at 00:00 JST
exports.cronSyncJGrants = onSchedule({
  schedule: "0 0 * * *",
  timeZone: "Asia/Tokyo",
  memory: "256MiB"
}, async (event) => {
  try {
    console.log("Starting jGrants subsidy sync...");
    // Retrieve jGrants API data (standard pagination / API endpoint)
    // Spec URL: https://api.jgrants-portal.go.jp/v1/subsidies
    const response = await fetch("https://api.jgrants-portal.go.jp/v1/subsidies?limit=100");
    if (!response.ok) {
      throw new Error(`jGrants API returned status: ${response.status}`);
    }
    
    const result = await response.json();
    const subsidies = result.subsidies || [];
    
    console.log(`Fetched ${subsidies.length} subsidies from jGrants. Writing to Firestore...`);
    
    const batch = db.batch();
    subsidies.forEach((subsidy) => {
      const docRef = db.collection("subsidies").doc(String(subsidy.id || subsidy.subsidyId));
      
      // Parse rate label, max amount, schedule dates based on API response structure
      const parsedData = {
        title: subsidy.title || subsidy.name || "",
        agency: subsidy.organName || subsidy.agency || "",
        category: subsidy.category || "DX・IT",
        status: subsidy.status || "open",
        summary: subsidy.summary || subsidy.description || "",
        maxAmount: Number(subsidy.maxAmount || subsidy.amount || 0),
        rateLabel: subsidy.subsidyRate || "1/2",
        appStart: subsidy.appStart ? admin.firestore.Timestamp.fromDate(new Date(subsidy.appStart)) : null,
        appEnd: subsidy.appEnd ? admin.firestore.Timestamp.fromDate(new Date(subsidy.appEnd)) : null,
        tags: subsidy.tags || [],
        sourceUrl: subsidy.sourceUrl || subsidy.detailUrl || "",
        lastSynced: admin.firestore.FieldValue.serverTimestamp(),
        originalData: subsidy
      };
      
      batch.set(docRef, parsedData, { merge: true });
    });
    
    await batch.commit();
    console.log("jGrants subsidy sync completed successfully.");
  } catch (error) {
    console.error("Error syncing subsidies from jGrants:", error);
  }
});

// 2. Cloud Function to analyze site URL and extract metadata using Gemini API
exports.callableAnalyzeUrl = onCall({ cors: true }, async (request) => {
  const { url } = request.data;
  if (!url) {
    throw new HttpsError("invalid-argument", "The function must be called with a 'url' parameter.");
  }
  
  const createEmptyData = (urlVal = "") => ({
    name: "",
    url: urlVal,
    industry: "",
    employeeCount: null,
    prefecture: "",
    revenueLabel: "",
    established: "",
    businessSummary: "",
    capital: null
  });

  function findProfileLinks(html, baseUrl) {
    const links = [];
    const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
    let match;
    const keywords = ['about', 'company', 'profile', 'corporate', 'gaiyo', 'concept', '会社', '企業', '概要', '沿革', 'プロフィール', '情報'];
    
    while ((match = regex.exec(html)) !== null) {
      const href = match[2].trim();
      const text = match[3].replace(/<[^>]*>/g, '').trim();
      
      const combinedLower = (href + " " + text).toLowerCase();
      const matchesKeyword = keywords.some(kw => combinedLower.includes(kw));
      
      if (matchesKeyword) {
        try {
          let absoluteUrl = href;
          if (href.startsWith('//')) {
            const proto = baseUrl.startsWith('https') ? 'https:' : 'http:';
            absoluteUrl = proto + href;
          } else if (href.startsWith('/') || !href.startsWith('http')) {
            const urlObj = new URL(baseUrl);
            const relativePath = href.startsWith('/') ? href : '/' + href;
            absoluteUrl = urlObj.origin + relativePath;
          }
          
          const baseOrigin = new URL(baseUrl).origin;
          const targetOrigin = new URL(absoluteUrl).origin;
          if (baseOrigin === targetOrigin && !links.includes(absoluteUrl) && absoluteUrl !== baseUrl) {
            links.push(absoluteUrl);
          }
        } catch (err) {
          // Ignore invalid URL
        }
      }
    }
    return links.slice(0, 3);
  }

  function cleanHtml(html) {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey || geminiApiKey === "your_api_key_here") {
      console.warn("GEMINI_API_KEY is not configured or placeholder. Using empty data.");
      return { success: true, data: createEmptyData(url) };
    }

    console.log(`Fetching HTML content for URL: ${url}`);
    
    // Fetch homepage content
    let html = "";
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        timeout: 8000
      });
      if (response.ok) {
        html = await response.text();
      } else {
        console.warn(`Fetch returned status: ${response.status}. Using empty data.`);
        return { success: true, data: createEmptyData(url) };
      }
    } catch (fetchErr) {
      console.warn(`Fetch failed: ${fetchErr.message}. Using empty data.`);
      return { success: true, data: createEmptyData(url) };
    }

    // Auto-discover company profile pages
    const profileLinks = findProfileLinks(html, url);
    let additionalText = "";
    
    if (profileLinks.length > 0) {
      console.log(`Discovered company profile links:`, profileLinks);
      const fetchPromises = profileLinks.slice(0, 2).map(async (link) => {
        try {
          const subRes = await fetch(link, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            timeout: 5000
          });
          if (subRes.ok) {
            const subHtml = await subRes.text();
            return cleanHtml(subHtml);
          }
        } catch (e) {
          console.warn(`Failed to fetch sub-page ${link}:`, e.message);
        }
        return "";
      });
      
      const fetchedTexts = await Promise.all(fetchPromises);
      additionalText = fetchedTexts.filter(Boolean).join(" ");
    }

    // Combine texts
    let cleanText = (cleanHtml(html) + " " + additionalText).substring(0, 25000);

    if (!cleanText.trim()) {
      console.warn("Extracted text is empty. Using empty data.");
      return { success: true, data: createEmptyData(url) };
    }

    console.log("Calling Gemini API to analyze extracted text...");

    // call Gemini API using fetch
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    const payload = {
      contents: [{
        parts: [{
          text: `You are a corporate intelligence extractor. You MUST extract the company profile in structured JSON format from the crawled website content.
Website content:
"""
${cleanText}
"""

At a minimum, try your absolute best to locate and extract these 3 core fields:
1. "employeeCount" (Số lượng nhân viên - estimate as an integer, return null if not found)
2. "industry" (Lĩnh vực hoạt động - e.g. ソフトウェア業, 製造業, サービス業, return empty string if not found)
3. "prefecture" (Khu vực/Tỉnh thành - e.g. 東京都, 大阪府, return empty string if not found)

Format the output strictly as a single JSON object with the following fields:
{
  "name": "Company Name in Japanese (or empty string if not found)",
  "industry": "Industry Type (or empty string if not found)",
  "employeeCount": 12, (Estimate number of employees as an integer. Use null if not found)",
  "prefecture": "Prefecture and city (e.g. 東京都 渋谷区) (or empty string if not found)",
  "revenueLabel": "Estimated annual revenue (e.g. 1.8億円, 5000万円, or empty string if not found)",
  "established": "Establishment date in YYYY-MM (e.g. 2019-04) (or empty string if not found)",
  "businessSummary": "A concise 2-3 sentence description of their core business in Japanese (or empty string if not found)",
  "capital": 10000000 (Capital in Yen as number, e.g. 10000000 for 10M yen. Use null if not found)
}
Only output the JSON object without any Markdown formatting or backticks.`
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const apiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error(`Gemini API error status ${apiResponse.status}: ${errText}`);
      return { success: true, data: createEmptyData(url) };
    }

    const apiResult = await apiResponse.json();
    const responseText = apiResult.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.warn("Empty response from Gemini. Using empty data.");
      return { success: true, data: createEmptyData(url) };
    }

    try {
      const parsedData = JSON.parse(responseText.trim());
      // Ensure url is attached
      parsedData.url = url;
      console.log("Successfully extracted company profile:", parsedData);
      return { success: true, data: parsedData };
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON output. Raw response:", responseText);
      return { success: true, data: createEmptyData(url) };
    }
  } catch (error) {
    console.error("Error analyzing website URL:", error);
    return { success: true, data: createEmptyData(url) };
  }
});

// 3. AI Chat Assistant endpoint
exports.callableChat = onCall({ cors: true }, async (request) => {
  const { message, companyId } = request.data;
  
  try {
    let companyContext = "";
    if (companyId) {
      const companyDoc = await db.collection("companies").doc(companyId).get();
      if (companyDoc.exists) {
        companyContext = JSON.stringify(companyDoc.data());
      }
    }
    
    // In a real application, construct prompt and query Gemini API
    const reply = "IT導入補助金 2026 は貴社の業態に最も適合しています。クラウドSaaS導入が補助対象に明示されているためです。次の一手として、GBizIDの取得状況をご確認ください。";
    
    return { reply };
  } catch (error) {
    console.error("Error in AI Chat:", error);
    throw new HttpsError("internal", "Failed to communicate with AI model.");
  }
});
