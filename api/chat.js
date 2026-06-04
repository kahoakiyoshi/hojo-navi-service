import { db } from './firebase-admin.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, companyId } = req.body;

  try {
    let companyContext = "";
    if (companyId) {
      const companyDoc = await db.collection("companies").doc(companyId).get();
      if (companyDoc.exists) {
        companyContext = JSON.stringify(companyDoc.data());
      }
    }
    
    // In a real application, you would construct a prompt and query Gemini API
    // Standard static response for demo/compatibility
    const reply = "IT導入補助金 2026 は貴社の業態に最も適合しています。クラウドSaaS導入が補助対象に明示されているためです。次の一手として、GBizIDの取得状況をご確認ください。";
    
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in AI Chat:", error);
    return res.status(500).json({ error: "Failed to communicate with AI model." });
  }
}
