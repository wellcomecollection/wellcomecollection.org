export default (el) => {
  const input = el.querySelector('.js-input');
  const clearButton = el.querySelector('.js-clear');

  input.addEventListener('input', (event) => {
    setShowButton(Boolean(event.target.value.length));
  });

  clearButton.addEventListener('click', (event) => {
    event.preventDefault();
    input.value = '';
    setShowButton(false);
  });

  function setShowButton(value) {
    el.classList[value ? 'add' : 'remove']('is-active');
  }
};
