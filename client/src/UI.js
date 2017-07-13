const Panel = require('./Panel');

class UI {

  constructor(directives) {
    this.panel = new Panel();

    const nodes = [];
    let id = 0;

    for(let i = 0; i < directives.length; i++) {
      const directive = directives[i];
      const els = document.querySelectorAll(`*[data-${directives[i]}]`);

      for(let j = 0; j < els.length; j++) {
        const el = els[j];

        if(el.dataset.seamsId) {
          nodes[el.dataset.seamsId].directives.push(directive)
        } else {
          el.dataset.seamsId = id;
          nodes[id++] = {el, directives: [directive]};
        }
      }

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