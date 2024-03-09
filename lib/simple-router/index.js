const Router = require('./simple-router');

const router = new Router();

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('GET /');
});

router.post('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('POST /');
});

router.put('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('PUT /');
});

router.delete('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('DELETE /');
});

// Simulate incoming requests
const simulateRequest = (method, url) => {
  const req = { method, url };
  const res = {
    writeHead: (statusCode, headers) => {
      console.log(`Status Code: ${statusCode}`);
      console.log('Headers:', headers);
    },
    end: (data) => {
      console.log('Response:', data);
    }
  };
  console.log(`Simulating ${method} request to ${url}`);
  router.handleRequest(req, res);
  console.log('------------------');
};

simulateRequest('GET', '/');
simulateRequest('POST', '/');
simulateRequest('PUT', '/');
simulateRequest('DELETE', '/');
simulateRequest('GET', '/nonexistent');
