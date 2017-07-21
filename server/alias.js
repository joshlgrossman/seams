const fileNameRegExp = /\/[^\/]+$/g;
const fileTypeRegExp = /\.[^\.]+$/g;
const adminFileRegExp = /^\/admin.*/;
const protectedFileRegExp = /^\/admin\.ui.*/;
const paramsRegExp = /(\?|\&)([^=&]+)(\=([^&]+))?/g;

function alias(url) {

  const params = {};
  const paramArray = url.match(paramsRegExp);
  url = url.replace(/\?.*/, '');

  if(paramArray && paramArray.length) {
    for(const param of paramArray) {
      const [key, val] = param.replace(/^(\?|\&)/, '').split('=');
      params[key] = val || true;
    }
  }

  if(url === '/') url = '/index.html';

  let fileName = url.match(fileNameRegExp);
  let fileType = url.match(fileTypeRegExp);
  let adminFile = adminFileRegExp.test(url);
  let protectedFile = adminFile && protectedFileRegExp.test(url);

  if(!fileName) {
    url = false;
    fileType = false;
  } else if(!fileType) {
    url += (fileType = '.html');
  } else fileType = fileType[0];

  return {url, fileType, adminFile, protectedFile, params};

}

module.exports = alias;