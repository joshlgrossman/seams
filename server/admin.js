const fs = require('fs');
const directives = require('./directives');

const js = fs.readFileSync(
  process.env.DEBUG == 'true' ? 
    './client/dist/admin.js' :
    './client/dist/admin.min.js'
);

const css = fs.readFileSync('./client/dist/admin.css')

function admin(url, $) {
  $('head')
    .prepend(`<style>${css.toString()}</style>`)
    .prepend(`<script>${js.toString()}</script>`);
}

module.exports = admin;