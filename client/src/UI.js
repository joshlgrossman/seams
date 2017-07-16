const {$} = require('./util');
const Panel = require('./Panel');

class UI {

  constructor(directives) {
    this.panel = new Panel();

    const nodes = [];
    let id = 0;

    for(let i = 0; i < directives.length; i++) {
      const directive = directives[i];

      $(`*[data-${directives[i]}]`).forEach(el => {
        if(el.dataset.seamsId) {
          nodes[el.dataset.seamsId].directives.push(directive)
        } else {
          nodes[el.dataset.seamsId = id++] = {el, directives: [directive]};
        }
      });
    }

    nodes.forEach(({el, directives}) => {

      el.addEventListener('click', evt => {
        this.panel.show(el, directives);
        evt.stopPropagation();
        evt.preventDefault();
      });

    });
  }

}

module.exports = UI;