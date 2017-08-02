const auth = require('./auth');
const mimeTypes = require('./mime');

let DEBUG = false;

function respond(response, status, {content, head, json} = {}) {
  if(json !== undefined) {
    content = JSON.stringify(json);
    head = head || {};
    head['Content-Type'] = mimeTypes['.json'];
    head['Content-Length'] = content.length;
  }
  response.writeHead(status, head);
  if(content !== undefined) response.write(content);
  response.end();
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

module.exports = {
  respond,
  parseBody,
  debug,
  processArgs
};