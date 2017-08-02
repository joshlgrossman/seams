function inject(url, $) {
  $('head')
    .prepend(`<link rel="stylesheet" href="/seams.ui.css">`)
    .prepend(`<script src="/seams.ui.min.js"></script>`);
  $('body').addClass('seams-admin-ui');
}

function cookie(str) {
  if(str)
    return str.replace(/(?:(?:^|.*;\s*)seams-jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1');
  else return 'seams-jwt';
}

module.exports = {
  cookie,
  inject
};