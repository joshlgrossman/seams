const {$, cookie, CLASSNAME} = require('./util');
const Panel = require('./Panel');

class UI {

  constructor(directives) {
    this.panel = new Panel();
    this.logout = $('<button>', {
      id: CLASSNAME + '-logout-btn',
      innerText: 'log out'
    });

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

      let doDefault = false;

      el.addEventListener('click', evt => {
        if(!doDefault) {
          this.panel.show(el, directives);
          evt.stopPropagation();
          evt.preventDefault();
        }
        doDefault = false;
      });

      el.addEventListener('dblclick', evt => {
        doDefault = true;
        el.click();
      });

    });

    this.logout.addEventListener('click', evt => {
      cookie('seams-jwt', '');
      window.location.reload();
    });

    document.body.appendChild(this.logout);
  }

}

module.exports = UI;