const fs = require('fs');
const directives = require('./directives');

const file = fs.readFileSync(
  process.env.DEBUG == 'true' ? 
    './client/dist/admin.js' :
    './client/dist/admin.min.js'
);

function admin(url, $) {
  $('head').prepend(`<script>${file.toString()}</script>`);
}

module.exports = admin;