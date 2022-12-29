require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

const { json } = require('body-parser');
const dns = require('dns')
const app = express();
const url = require('url');
const { hostname } = require('os');

// Basic Configuration
const port = process.env.PORT || 3000;
let urls = []
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  let href = url.parse(req.body.url)

  let link = href.hostname == null? href.href: href.hostname
  dns.lookup(link, function(err, address, family){

  err ? res.send({error: 'invalid url'}) :res.send({original_url: href.href, short_url: urls.length+1}) && urls.push(href.href)
  console.log(urls)
  })
});
app.get('/api/shorturl/:id', function(req, res){
  let short_url = req.params.id
  res.redirect(urls[short_url-1])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
