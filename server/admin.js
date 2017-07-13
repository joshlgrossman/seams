const fs = require('fs');
const directives = require('./directives');

const file = fs.readFileSync('./client/dist/admin.new.js');

function admin(url, $) {

  $('head').prepend(
    `<script>;!function(directives){${file.toString()}}(['${
      Object.keys(directives).join('\',\'')
    }']);</script>`
  );

}

module.exports = admin;