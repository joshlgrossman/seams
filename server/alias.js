const fileNameRegExp = /\/[^\/]+$/g;
const fileTypeRegExp = /\.[^\.]+$/g;

function alias(url) {
  if(url === '/') url = '/index.html';

  let fileName = url.match(fileNameRegExp);
  let fileType = url.match(fileTypeRegExp);

  if(!fileName) {
    url = false;
    fileType = false;
  } else if(!fileType) {
    url += '.html';
    fileType = ['.html'];
  } else fileType = fileType[0];

  return {url, fileType};
}

module.exports = alias;