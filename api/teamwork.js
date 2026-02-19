const https = require('https');

const TEAMWORK_URL = 'https://9cloudwebworks.teamwork.com';
const API_KEY = process.env.TEAMWORK_API_KEY || 'twp_kouI7Vd8IetzZ1b88Y7L8vf6Xm0K';

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const endpoint = req.query.endpoint;
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  // Build query string from all params except 'endpoint'
  const params = { ...req.query };
  delete params.endpoint;
  const queryString = Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : '';

  const url = `${TEAMWORK_URL}/${endpoint}${queryString}`;
  const auth = Buffer.from(`${API_KEY}:x`).toString('base64');

  return new Promise((resolve) => {
    const request = https.get(
      url,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
      (response) => {
        let data = '';
        response.on('data', (chunk) => (data += chunk));
        response.on('end', () => {
          try {
            const json = JSON.parse(data);
            // Forward Teamwork pagination headers as metadata
            json._pagination = {
              page: parseInt(response.headers['x-page']) || 1,
              pages: parseInt(response.headers['x-pages']) || 1,
              records: parseInt(response.headers['x-records']) || 0,
            };
            res.status(response.statusCode).json(json);
          } catch {
            res.status(500).json({ error: 'Failed to parse response', raw: data.substring(0, 500) });
          }
          resolve();
        });
      }
    );
    request.on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });
  });
};
