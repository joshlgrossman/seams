const load = require('./load');
const directives = require('./directives');

async function render(url, $) {

  try {
    const content = await load(url);

    for(const key in content) {
      const val = content[key];
      if(val)
        for(const directiveName in directives) {
          directives[directiveName](
            $(`*[data-${directiveName}=${key}]`),
            val
          );
        }
    }
  } catch (e) {
    console.error(e);
  }

}

module.exports = render;