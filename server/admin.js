const cookieRegExp = /(?:(?:^|.*;\s*)seams-jwt\s*\=\s*([^;]*).*$)|^.*$/;

function inject($) {
  $('head')
    .prepend(`<link rel="stylesheet" href="/seams.ui.css">`)
    .prepend(`<script src="/seams.ui.min.js"></script>`);
  $('body').addClass('seams-admin-ui');
}

function cookie(str) {
  if(str)
    return str.replace(cookieRegExp, '$1');
  else return 'seams-jwt';
}

module.exports = {
  cookie,
  inject
};