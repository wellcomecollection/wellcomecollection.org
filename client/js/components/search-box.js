import { KEYS } from '../util';

export default (el) => {
  const input = el.querySelector('.js-input');
  const clearButton = el.querySelector('.js-clear');

  input.addEventListener('input', () => {
    setShowButton(Boolean(input.value.length));
  });

  input.addEventListener('keydown', ({ keyCode }) => {
    if (keyCode === KEYS.ESCAPE) {
      setShowButton(false);
      input.value = '';
    }
  });

  clearButton.addEventListener('click', (event) => {
    event.preventDefault();
    input.value = '';
    setShowButton(false);
    input.focus();
  });

  setShowButton(Boolean(input.value.length));

  function setShowButton(value) {
    el.classList[value ? 'add' : 'remove']('is-active');
  }
};
