const {$, cookie, CLASSNAME, toggleClass} = require('./util');
const Panel = require('./Panel');

class UI {

  constructor(directives) {
    this.panel = new Panel();
    this.alert = $('<div>', {
      id: CLASSNAME + '-alert'
    });
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

          const x = evt.pageX;
          const width = window.innerWidth || document.body.clientWidth;
          const side = x < width/2;

          this.panel.show(el, directives, side);
          evt.stopPropagation();
          evt.preventDefault();
        }
        doDefault = false;
      });

      el.addEventListener('dblclick', evt => {
        doDefault = true;
        evt.target.click();
      });

      el.addEventListener('mouseenter', () => {
        toggleClass(this.alert, 'show', true);
      });

      el.addEventListener('mouseleave', () => {
        toggleClass(this.alert, 'show', false);
      });

    });

    this.logout.addEventListener('click', () => {
      cookie('seams-jwt', '');
      window.location.reload();
    });

    window.addEventListener('mousemove', evt => {
      this.alert.style = `left:${evt.pageX};top:${evt.pageY}`;
    });

    document.body.appendChild(this.logout);
    document.body.appendChild(this.alert);
  }

}

module.exports = UI;