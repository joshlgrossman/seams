const UI = require('./UI');
const directives = require('../../server/directives');

window.addEventListener('load', () => {

  new UI(Object.keys(directives));

});