function admin(url, $) {
  $('head')
    .prepend(`<link rel="stylesheet" href="/seams.ui.css">`)
    .prepend(`<script src="/seams.ui.min.js"></script>`);
  $('body').addClass('seams-admin-ui');
}

module.exports = admin;