const {$, http} = require('./util');

window.addEventListener('load', () => {

  const $errors = $('.errors')[0];
  const $name = $('.username')[0];
  const $password = $('.password')[0];
  const $submit = $('.submit')[0];
  let timeout;

  function hideErrors() {
    $($errors, '.show', false);
  }

  function showErrors(err) {
    $errors.innerHTML = err;
    $($errors, '.show', true);
    clearTimeout(timeout);
    timeout = setTimeout(hideErrors, 5000);
  }

  function checkValidity() {
    if($name.value.trim() && $password.value.trim()) {
      $submit.removeAttribute('disabled');
    } else {
      $submit.setAttribute('disabled', '');
    }
  }

  $name.addEventListener('input', checkValidity);
  $password.addEventListener('input', checkValidity);

  $submit.addEventListener('click', evt => {
    evt.preventDefault();
    evt.stopPropagation();

    const name = $name.value;
    const password = $password.value;

    if(name && password) {
      http.post('/', {name, password})
      .then(res => {
        if(res.err) showErrors(res.msg || 'Invalid credentials');
        else window.location.reload();
      })
      .catch(() => {
        showErrors('Could not connect to server');
      });
    } else {
      showErrors('Please enter username and password');
    }

  });

});