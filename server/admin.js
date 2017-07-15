const fs = require('fs');
const directives = require('./directives');

const file = fs.readFileSync('./client/dist/admin.js');

function admin(url, $) {
  $('head').prepend(`<script>${file.toString()}</script>`);
}

module.exports = admin;