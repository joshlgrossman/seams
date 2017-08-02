const crypto = require('crypto');
const db = require('./db');

function base64Encode(json) {
  return new Buffer(JSON.stringify(json)).toString('base64');
}

function base64Decode(str) {
  return JSON.parse(new Buffer(str, 'base64').toString('ascii'));
}

function jwt(secret) {

  function decode(token) {
    
    const [header64, payload64, signature] = token.split('.');
    if(!header64 || !payload64 || !signature) return null;

    const hmac = crypto.createHmac('sha256', secret);

    hmac.update(header64 + '.' + payload64);

    if(signature !== hmac.digest('base64')) return null;

    const header = base64Decode(header64);
    const payload = base64Decode(payload64);

    if(!payload.exp || payload.exp < Date.now()) return null;

    return {header, payload};

  }

  function encode(name) {

    const hour = 3600000;
    const hmac = crypto.createHmac('sha256', secret);

    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      exp: Date.now() + hour,
      name: name,
      admin: true
    };

    const header64 = base64Encode(header);
    const payload64 = base64Encode(payload);
    hmac.update(header64 + '.' + payload64);
    const signature = hmac.digest('base64');

    return header64 + '.' + payload64 + '.' + signature;

  }

  return {encode, decode};

};

function validate({name, password}) {
  return new Promise((resolve, reject) => {

    if(!name || !password || !db.users) reject();
    else db.users.findOne({name}, (err, doc) => {
      if(err || !doc) return reject(err);
      
      const {password: hash, salt} = doc;
      const hmac = crypto.createHmac('sha512', salt);
      hmac.update(password);

      if(hmac.digest('hex') === hash) resolve(name);
      else reject(name);
    });

  });
}

function create({name, password}) {
  return new Promise((resolve, reject) => {

    if(!name || !password || !db.users) reject();
    else {
      const salt = crypto.randomBytes(8).toString('hex').slice(0, 16);
      const hmac = crypto.createHmac('sha512', salt);
      hmac.update(password);
      const hash = hmac.digest('hex');

      db.users.insertOne({name, salt, password: hash}, (err, doc) => {
        if(err) reject(err);
        else resolve(doc);
      });
    }

  });
}

module.exports = {
  jwt,
  validate,
  create
}