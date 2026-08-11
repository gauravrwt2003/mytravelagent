import http from 'http';
import { agentEngine, itineraryAgent } from './index.js';

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/' || url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      service: 'roamingbuddy-agents',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const payload = body ? JSON.parse(body) : {};

      if (url.pathname === '/api/v1/search' && req.method === 'POST') {
        const results = await agentEngine.executeTransitSearch(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, results }));
      }

      if (url.pathname === '/api/v1/itinerary' && req.method === 'POST') {
        const itinerary = await itineraryAgent.generateItinerary(
          payload.destination || 'Goa',
          payload.days || 3,
          payload.travelStyle || 'Cultural'
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, itinerary }));
      }

      if (url.pathname === '/api/v1/pay' && req.method === 'POST') {
        const paymentRes = await agentEngine.processPayment(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, payment: paymentRes }));
      }

      if (url.pathname === '/api/v1/notify' && req.method === 'POST') {
        const notifications = await agentEngine.triggerFulfillment(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, notifications }));
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint Not Found' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RoamingBuddy Agents Cloud Run Service listening on port ${PORT}`);
});
