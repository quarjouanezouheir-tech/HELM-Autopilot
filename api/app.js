const fs = require('fs');
const path = require('path');
const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url || '/';

  if (req.method === 'POST' && url.includes('/claude')) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.HELM_AUTOPILOT,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(HTML);
};
