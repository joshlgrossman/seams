const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');

const render = require('./render');
const admin = require('./admin');
const cache = require('./cache');

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

function seams(dir) {

  return function(request, response) {
    let url = request.url;
    if(url === '/') url = '/index.html';

    const start = new Date();


    let fileName = url.match(fileNameRegExp);
    let fileType = url.match(fileTypeRegExp);

    if(!fileName) {
      respond404(response);
      return;
    }

    if(!fileType) {
      url += '.html';
      fileType = ['.html'];
    } else fileType = fileType[0];
    
    const cached = cache(url);
    if(cached) {
      respond200(response, cached);
      return;
    }

    fs.readFile(path.join(dir, url), (err, content) => {

      const mimeType = mimeTypes[fileType];

      if(err || !mimeType) {
        respond404(response);
        return;
      }

      if(mimeType === 'text/html' || mimeType === 'application/xml') {
        const $ = cheerio.load(content);
        render(url, $);
        admin(url, $);
        content = $.html();
      }

      const head = {
        'Content-Type': mimeType,
        'Content-Length': content.length
      };

      respond200(
        response,
        cache(url, {head, content})
      );

    });
    
  }

}

module.exports = seams;