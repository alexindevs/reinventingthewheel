const querystring = require('querystring');

const formDataParser = (req, res, next) => {
  if (req.method === 'POST' && req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      req.body = querystring.parse(body);
      next();
    });
  } else {
    console.log('Not a form-data request');
    next();
  }
};

module.exports = formDataParser;
