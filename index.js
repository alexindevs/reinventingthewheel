const express = require('express');
const bodyParser = require('./parsers/body-parser')
const formDataParser = require('./parsers/form-parser')
const multipartParser = require('./parsers/multipart-parser')

const app = express();
const port = process.argv[3] || process.env.PORT || 3000;

app.use(bodyParser);
app.use(formDataParser);
app.use(multipartParser);


app.get('/', (req, res) => {
  res.end('Hello World!')
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})