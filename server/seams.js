const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');

const render = require('./render');
const admin = require('./admin');
const cache = require('./cache');
const db = require('./db');
const save = require('./save');
const alias = require('./alias');
const auth = require('./auth');
const mimeTypes = require('./mime');
const {
  respond,
  parseBody,
  debug,
  processArgs
} = require('./util');

function seams({dir, db: connection, secret, expires}) {

  console.log('> seams server running');

  if(connection) db(connection).then(() => {
    processArgs(process.argv.slice(2));
  }).catch(err => {
    console.error(`Could not connect to database: ${err.toString()}`);
  });

  const _jwt = auth.jwt(secret);
  const _cache = cache(expires);

  function get(request, response) {

    const {url, fileType, adminFile, protectedFile} = alias(request.url);
    const cookie = admin.cookie(request.headers.cookie || '');
    const token = _jwt.decode(cookie);

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
      path.join(dir, url);

    fs.readFile(filePath, async (err, content) => {

      const mimeType = mimeTypes[fileType];

      if(err || !mimeType) {
        respond(response, 404);
        return;
      }

      if(mimeType === 'text/html' || mimeType === 'application/xml') {
        try {
          const $ = cheerio.load(content);
          await render(url, $);
          debug(`${url} rendered`);
          if(token) admin.inject(url, $);

          content = $.html();
        } catch(e) {
          console.log(`Rendering error: ${e}`);
        }
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
          'Set-Cookie': `${admin.cookie()}=${_jwt.encode(username)}; Max-Age=28800`
        };
        respond(response, 200, {
          head, 
          json: {
            name: username
          }
        });
      } else {
        throw new Error('Could not validate');
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
    try {
      switch(request.method) {
        case 'GET': get(request, response); break;  // static files
        case 'PUT': put(request, response); break;  // content management
        case 'POST': post(request, response); break;// admin login
        default: throw new Error('Action not supported');
      }
    } catch (e) {
      console.error(`Error handling request: ${e.toString()}`);
      respond(response, 404);
    }
  }

}

module.exports = seams;