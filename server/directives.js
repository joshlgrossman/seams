function content($el, content) {
  return content === undefined ?
    $el.html() :
    $el.html(content);
}

function text($el, content) {
  return content === undefined ?
    $el.text() :
    $el.text(content);
}

function src($el, content) {
  return content === undefined ?
    $el.attr('src') :
    $el.attr('src', content);
}

function href($el, content) {
  return content === undefined ?
    $el.attr('href') :
    $el.attr('href', content);
}

function background($el, content) {
  return content === undefined ?
    $el.css('background-image') :
    $el.css('background-image', content);
}

module.exports = {
  content,
  text,
  src,
  href,
  background
};