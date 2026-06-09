import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORS configuration
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

  const id = req.query.id || req.body.id;
  if (!id) {
    return res.status(400).json({ error: "Missing 'id' parameter." });
  }

  try {
    console.log(`Fetching subsidy details for ID: ${id} from JGrants Portal API...`);
    const jgrantsUrl = `https://api.jgrants-portal.go.jp/exp/v1/public/subsidies/id/${id}`;
    
    const response = await fetch(jgrantsUrl);
    if (!response.ok) {
      throw new Error(`JGrants API returned status code ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json({ success: true, data: data.result?.[0] || null });

  } catch (error) {
    console.error(`JGrants API fetch failed for id ${id}:`, error);
    return res.status(500).json({ error: `Failed to fetch subsidy details for id ${id}.` });
  }
}
