const crypto = require('crypto');

function base64Encode(json) {
  return new Buffer(JSON.stringify(json)).toString('base64');
}

function base64Decode(str) {
  return JSON.parse(new Buffer(str, 'base64').toString('ascii'));
}

function auth(secret) {

  function decode(token) {
    
    const [header64, payload64, signature] = token.split('.');
    if(!header64 || !payload64 || !signature) return null;

    const now = new Date();
    const hour = 3600000;
    const hmac = crypto.createHmac('sha256', secret);

    hmac.update(header64 + '.' + payload64);

    if(signature !== hmac.digest('base64')) return null;

    const header = base64Decode(header64);
    const payload = base64Decode(payload64);

    return {header, payload};

  }

  function encode(name) {

    const now = new Date();
    const hour = 3600000;
    const hmac = crypto.createHmac('sha256', secret);

    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      exp: new Date(now + hour).getTime(),
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

module.exports = auth;