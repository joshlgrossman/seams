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
const mimeTypes = require('./mime');

const fileNameRegExp = /\/[^\/]+$/g;
const fileTypeRegExp = /\.[^\.]+$/g;

let DEBUG = false;

function respond(response, status, {content, head, json}) {
  if(json !== undefined) {
    content = JSON.stringify(json);
    head = head || {};
    head['Content-Type'] = mimeTypes['.json'];
    head['Content-Length'] = content.length;
  }
  (status, head, content, json);
  response.writeHead(status, head);
  if(content !== undefined) response.write(content);
  response.end();
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

function debug(...str) {
  if(DEBUG) console.log(...str);
}

function processArgs(args) {
  const cmdPrefix = '--seams';
  let name, password;
  for(const arg of args) {
    const [key,val] = arg.split('=');
    if(key === `${cmdPrefix}-admin-name`) {
      name = val;
    } else if(key === `${cmdPrefix}-admin-password`) {
      password = val;
    } else if(key === `${cmdPrefix}-debug`) {
      DEBUG = val || true;
    }
  }
  if(name && password) {
    auth.create({name, password}).then(user => {
      console.log(`Admin ${name} created`);
    }).catch(err => {
      console.error(`Admin ${name} could not be created ${err ? ':' + err : ''}`);
    });
  }
}

function seams({dir, db: connection, secret, expires}) {

  console.log('> seams server running');

  if(connection) db(connection).then(() => {
    processArgs(process.argv.slice(2));
  }).catch(err => {
    console.error(`Could not connect to database: ${err.toString()}`);
  });

  const _auth = auth.jwt(secret);
  const _cache = cache(expires);

  function get(request, response) {

    const {url, fileType, adminFile, protectedFile, params} = alias(request.url);
    const cookie = adminCookie(request.headers.cookie || '');
    const token = _auth.decode(cookie);

    if((!url && !fileType) || (protectedFile && !token)) {
      respond(response, 404);
      return;
    }

    const cached = _cache(url);
    if(!token && cached) {
      respond(response, 200, cached);
      return;
    }

    const filePath = adminFile ? 
      path.join(__dirname, '../client/dist', url) :
      path.join(dir, url)

    fs.readFile(filePath, async (err, content) => {

      const mimeType = mimeTypes[fileType];

      if(err || !mimeType) {
        respond(response, 404);
        return;
      }

      if(mimeType === 'text/html' || mimeType === 'application/xml') {
        const $ = cheerio.load(content);
        await render(url, $);
        debug(`${url} rendered`);
        if(token) admin(url, $);

        content = $.html();
      }

      const head = {
        'Content-Type': mimeType,
        'Content-Length': content.length
      };

      const data = {head, content};

      respond(
        response,
        200,
        token ? data : _cache(url, data)
      );

    });
    
  }

  async function put(request, response) {
    try {
      const json = await parseBody(request);
      await save(request.url, json);
      debug(`${request.url} updated`);
      respond(response, 200, {
        json: {
          err: false
        }
      });
    } catch (e) {
      respond(response, 200, {
        json: {
          err: true, 
          msg: e.toString()
        }
      });
    }
  }

  async function post(request, response) {
    try {
      const json = await parseBody(request);
      const username = await auth.validate(json);

      if(username) {
        debug(`${username} logged in`);
        const head = {
          'Set-Cookie': `seams-jwt=${_auth.encode(username)}; Max-Age=28800`
        };
        respond(response, 200, {
          head, 
          json: {
            name: username
          }
        });
      } else {
        respond(response, 200, {
          json: {
            err: true
          }
        });
      }

    } catch (e) {
      respond(response, 200, {
        json: {
          err: true
        }
      });
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