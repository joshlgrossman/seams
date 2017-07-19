function admin(url, $) {
  $('head')
    .prepend(`<link rel="stylesheet" href="admin.ui.css">`)
    .prepend(`<script src="admin.ui.min.js"></script>`);
}

module.exports = admin;