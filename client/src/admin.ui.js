const UI = require('./UI');
const directives = require('../../server/directives');

window.addEventListener('load', () => {

  const ui = new UI(Object.keys(directives));

});