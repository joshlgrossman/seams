const fs = require('fs');
const path = require('path');
const qs = require('querystring');

const cheerio = require('cheerio');

const render = require('./render');
const admin = require('./admin');
const cache = require('./cache');
const db = require('./db');
const save = require('./save');
const alias = require('./alias');
const auth = require('./auth');

const fileNameRegExp = /\/[^\/]+$/g;
const fileTypeRegExp = /\.[^\.]+$/g;

const mimeTypes = {
  '.htm':   'text/html',
  '.html':  'text/html',
  '.xml':   'application/xml',
  '.gif':   'image/gif',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.png':   'image/png',
  '.js':    'text/javascript',
  '.json':  'application/json',
  '.css':   'text/css'
};

function respond404(response, reason) {
  response.writeHead(404, reason);
  response.end();
}

function respond200(response, data) {
  response.writeHead(200, data.head);
  response.write(data.content);
  response.end();
}

function respondJSON(response, json) {
  const content = JSON.stringify(json);
  const head = {
    'Content-Type': mimeTypes['.json'],
    'Content-Length': content.length
  };
  respond200(response, {content, head});
}

function adminCookie(str) {
  return str.replace(/(?:(?:^|.*;\s*)seams-jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1');
}

function seams({dir, connection, secret}) {

  if(connection) db(connection);
  const jwt = auth(secret);

  function get(request, response) {

    const {url, fileType} = alias(request.url);
    const cookie = adminCookie(request.headers.cookie || '');
    const token = jwt.decode(cookie);
    
    if(!url && !fileType) {
      respond404(response);
      return;
    }

    const cached = cache(url);
    if(!token && cached) {
      respond200(response, cached);
      return;
    }

    fs.readFile(path.join(dir, url), async (err, content) => {

      const mimeType = mimeTypes[fileType];

      if(err || !mimeType) {
        respond404(response);
        return;
      }

      if(mimeType === 'text/html' || mimeType === 'application/xml') {
        const $ = cheerio.load(content);
        await render(url, $);

        if(token) admin(url, $);

        content = $.html();
      }

      const head = {
        'Content-Type': mimeType,
        'Content-Length': content.length
      };

      const data = {head, content};

      respond200(
        response,
        token ? data : cache(url, data)
      );

    });
    
  }

  function post(request, response) {
    let body = '';
    request.on('data', data => body += data);
    request.on('end', async () => {
      const json = JSON.parse(body.toString());
      try {
        await save(request.url, json);
        respondJSON(response, {err: false});
      } catch (e) {
        respondJSON(response, {err: true, msg: e.toString()})
      }
    });
  }

  return function(request, response) {
    switch(request.method) {
      case 'GET': get(request, response); break;
      case 'POST': post(request, response); break;
    }
  }

}

module.exports = seams;