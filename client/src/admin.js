const {$, http} = require('./util');

window.addEventListener('load', () => {

  const $errors = $('.errors')[0];
  const $name = $('.username')[0];
  const $password = $('.password')[0];
  const $submit = $('.submit')[0];
  let timeout;

  function showErrors(err) {
    $errors.innerHTML = err;
    if($errors.className.indexOf('show') === -1)
      $errors.className += ' show';
    clearTimeout(timeout);
    timeout = setTimeout(hideErrors, 5000);
  }

  function hideErrors() {
    $errors.className = $errors.className.replace(' show', '');
  }

  $submit.addEventListener('click', evt => {
    evt.preventDefault();
    evt.stopPropagation();

    const name = $name.value;
    const password = $password.value;

    if(name && password) {
      http.post('/', {name, password}).then(res => {
        if(res.err) showErrors(res.msg || 'Invalid credentials');
        else window.location.reload();
      });
    } else {
      showErrors('Please enter username and password');
    }

  });

});