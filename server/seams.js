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

function respond302(response, data) {
  response.writeHead(302, data.head);
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

function parseBody(request) {
  return new Promise((resolve, reject) => {

    let body = '';
    request.on('data', data => body += data);
    request.on('end', () => {
      try {
        const json = JSON.parse(body.toString());
        resolve(json);
      } catch(e) {
        const json = qs.parse(body.toString());

        if(json) resolve(json);
        else reject(e);

      }
    });

  });
}

function processArgs(args) {
  const cmdPrefix = '--create-seams-admin';
  let name, password;
  for(const arg of args) {
    const [key,val] = arg.split('=');
    if(key === `${cmdPrefix}-name`) {
      name = val;
    } else if(key === `${cmdPrefix}-password`) {
      password = val;
    }
  }
  if(name && password) {
    auth.create({name, password}).then(user => {
      console.log(`Admin ${name} created`);
    }).catch(err => {
      console.log(`Admin ${name} could not be created ${err ? ':' + err : ''}`);
    });
  }
}

function seams({dir, connection, secret, expires}) {


  if(connection) db(connection).then(() => {
    processArgs(process.argv.slice(2));
  }).catch(err => {
    console.log('Could not connect to database');
  });

  const _auth = auth.jwt(secret);
  const _cache = cache(expires);

  function get(request, response) {

    const {url, fileType, adminFile, protectedFile} = alias(request.url);
    const cookie = adminCookie(request.headers.cookie || '');
    const token = _auth.decode(cookie);

    if((!url && !fileType) || (protectedFile && !token)) {
      respond404(response);
      return;
    }

    const cached = _cache(url);
    if(!token && cached) {
      respond200(response, cached);
      return;
    }

    const filePath = adminFile ? 
      path.join(__dirname, '../client/dist', url) :
      path.join(dir, url)

    fs.readFile(filePath, async (err, content) => {

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
        token ? data : _cache(url, data)
      );

    });
    
  }

  async function put(request, response) {
    try {
      const json = await parseBody(request);
      await save(request.url, json);
      respondJSON(response, {err: false});
    } catch (e) {
      respondJSON(response, {err: true, msg: e.toString()})
    }
  }

  async function post(request, response) {
    try {
      const json = await parseBody(request);
      const username = await auth.validate(json);

      if(username) {
        const content = JSON.stringify({name: username});
        const head = {
          'Content-Type': mimeTypes['.json'],
          'Content-Length': content.length,
          'Set-Cookie': `seams-jwt=${_auth.encode(username)}; Max-Age=28800`,
          'Location': '/'
        };
        response.writeHead(302, head);
        response.write(content);
        response.end();
      } else {
        respondJSON(response, {err: true});
      }

    } catch (e) {
      respondJSON(response, {err: true});
    }
  }

  return function(request, response) {
    switch(request.method) {
      case 'GET': get(request, response); break;  // static files
      case 'PUT': put(request, response); break;  // content management
      case 'POST': post(request, response); break;// admin login
    }
  }

}

module.exports = seams;