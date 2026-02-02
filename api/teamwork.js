// api/teamwork.js - Vercel Serverless Function
// This proxies requests to Teamwork API to avoid CORS issues

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Your Teamwork credentials
  const TEAMWORK_URL = 'https://9cloudwebworks.teamwork.com';
  const API_KEY = 'twp_kouI7Vd8IetzZ1b88Y7L8vf6Xm0K';

  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  // Whitelist allowed endpoints for security
  const allowedEndpoints = ['projects.json', 'people.json', 'tasks.json', 'time_entries.json'];
  const baseEndpoint = endpoint.split('?')[0];
  
  if (!allowedEndpoints.includes(baseEndpoint)) {
    return res.status(403).json({ error: 'Endpoint not allowed' });
  }

  try {
    const url = `${TEAMWORK_URL}/${endpoint}`;
    const auth = Buffer.from(`${API_KEY}:xxx`).toString('base64');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Teamwork API error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Teamwork API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
