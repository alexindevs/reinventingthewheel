const bodyParser = (req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (body) {
                req.body = JSON.parse(body);
            }
            next();
        });
    } else {
        console.log('Not a JSON Request.')
        next();
    }
}
module.exports = bodyParser