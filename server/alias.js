const fileNameRegExp = /\/[^\/]+$/g;
const fileTypeRegExp = /\.[^\.]+$/g;
const adminFileRegExp = /^\/seams.*/;
const protectedFileRegExp = /^\/seams\.ui.*/;
const paramsRegExp = /(\?|\&)([^=&]+)(\=([^&]+))?/g;
const paramDelimRegExp = /^(\?|\&)/;
const paramStartRegExp = /\?.*/;

function alias(url) {

  if(url === undefined) return {};

  const params = {};
  const paramArray = url.match(paramsRegExp);
  url = url.replace(paramStartRegExp, '');

  if(paramArray && paramArray.length) {
    for(const param of paramArray) {
      const [key, val] = param.replace(paramDelimRegExp, '').split('=');
      params[key] = val || true;
    }
  }

  if(url[url.length-1] === '/') url += 'index.html';

  let fileType = url.match(fileTypeRegExp);
  const fileName = url.match(fileNameRegExp);
  const adminFile = adminFileRegExp.test(url);
  const protectedFile = adminFile && protectedFileRegExp.test(url);

  if(!fileName) url = fileType = false;
  else if(!fileType) url += (fileType = '.html');
  else fileType = fileType[0];

  return {url, fileType, adminFile, protectedFile, params};

}

module.exports = alias;