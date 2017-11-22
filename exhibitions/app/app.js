import router from 'koa-router';
import {koaApp} from 'common/koa-app';

console.info(router, koaApp)

// Blurgh
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('exhibitions ok');
}).listen(3000);
