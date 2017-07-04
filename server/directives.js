module.exports = {
  'content':  ($el, content) => $el.html(content),
  'src':      ($el, content) => $el.attr('src', content),
  'href':     ($el, content) => $el.attr('href', content)
};