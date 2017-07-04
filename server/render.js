const load = require('./load');
const directives = require('./directives');


function render(url, $) {

  const content = load(url);

  for(const key in content) {
    const val = content[key];
    for(const directiveName in directives) {
      directives[directiveName](
        $(`*[data-${directiveName}=${key}]`),
        val
      );
    }
  }

}

module.exports = render;