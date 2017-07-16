module.exports = {
  'content': ($el, content) => {
    return content === undefined ? 
      $el.html() : 
      $el.html(content);
  },
  'text': ($el, content) => {
    return content === undefined ?
      $el.text() :
      $el.text(content);
  },
  'src': ($el, content) => {
    return content === undefined ? 
      $el.attr('src') :
      $el.attr('src', content);
  },
  'href': ($el, content) => {
    return content === undefined ?
      $el.attr('href') :
      $el.attr('href', content);
  }
};