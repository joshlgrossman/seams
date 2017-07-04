window.addEventListener('load', function(){

  function setupNode({$el, directives}) {

    $el.addEventListener('click', evt => {
      setupEditor({$el, directives});
      evt.stopPropagation();
      evt.preventDefault();
    });

  }

  function setupEditor({$el, directives}) {

  }

  const $ = document.querySelectorAll.bind(document);
  const nodes = [];
  let id = 0;

  for(let i = 0; i < directives.length; i++) {
    const directive = directives[i];
    const $els = $(`*[data-${directives[i]}]`);

    for(let j = 0; j < $els.length; j++) {
      const $el = $els[j];

      if($el.dataset.seamsId) {
        nodes[$el.dataset.seamsId].directives.push(directive)
      } else {
        $el.dataset.seamsId = id;
        nodes[id++] = {$el, directives: [directive]};
      }
    }

  }

  nodes.forEach(setupNode);

});