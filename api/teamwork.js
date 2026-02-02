const https = require('https');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Your Teamwork credentials
  const TEAMWORK_SITE = '9cloudwebworks.teamwork.com';
  const API_KEY = process.env.TEAMWORK_API_KEY || 'twp_kouI7Vd8IetzZ1b88Y7L8vf6Xm0K';

  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  // Whitelist allowed endpoints
  const allowedEndpoints = ['projects.json', 'people.json', 'tasks.json', 'time_entries.json'];
  const baseEndpoint = endpoint.split('?')[0];
  
  if (!allowedEndpoints.includes(baseEndpoint)) {
    return res.status(403).json({ error: 'Endpoint not allowed' });
  }

  return new Promise((resolve) => {
    const auth = Buffer.from(`${API_KEY}:xxx`).toString('base64');
    
    const options = {
      hostname: TEAMWORK_SITE,
      port: 443,
      path: '/' + endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
          res.status(200).json(jsonData);
        } catch (e) {
          res.status(500).json({ error: 'Failed to parse response', details: data.substring(0, 200) });
        }
        resolve();
      });
    });

    request.on('error', (error) => {
      res.status(500).json({ error: error.message });
      resolve();
    });

    request.end();
  });
};
