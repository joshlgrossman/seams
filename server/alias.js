const fileNameRegExp = /\/[^\/]+$/g;
const fileTypeRegExp = /\.[^\.]+$/g;
const adminFileRegExp = new RegExp(`^/admin.*`);
const protectedFileRegExp = new RegExp(`^/admin.ui.*`);

function alias(url) {

  if(url === '/') url = '/index.html';

  let fileName = url.match(fileNameRegExp);
  let fileType = url.match(fileTypeRegExp);
  let adminFile = adminFileRegExp.test(url);
  let protectedFile = adminFile && protectedFileRegExp.test(url);

  if(!fileName) {
    url = false;
    fileType = false;
  } else if(!fileType) {
    url += '.html';
    fileType = '.html';
  } else fileType = fileType[0];

  return {url, fileType, adminFile, protectedFile};

}

module.exports = alias;