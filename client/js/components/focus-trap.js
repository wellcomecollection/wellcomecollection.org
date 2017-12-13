export default (el) => {
  const trapStart = el.querySelector('.js-trap-start');
  const trapEnd = el.querySelector('.js-trap-end');
  const trapReverseStart = el.querySelector('.js-trap-reverse-start');
  const trapReverseEnd = el.querySelector('.js-trap-reverse-end');

  function focusTrapStart() {
    trapStart.focus();
  }

  function focusTrapReverseStart({ shiftKey }) {
    if (!shiftKey) return;

    trapReverseStart.focus();
  }

  function addTrap() {
    if (trapStart && trapEnd) {
      trapEnd.addEventListener('focus', focusTrapStart);
    }

    if (trapReverseStart && trapReverseEnd) {
      trapReverseEnd.addEventListener('keyup', focusTrapReverseStart);
    }
  }

  function removeTrap() {
    if (trapStart && trapEnd) {
      trapEnd.removeEventListener('focus', focusTrapStart);
    }

    if (trapReverseStart && trapReverseEnd) {
      trapReverseEnd.removeEventListener('keyup', focusTrapReverseStart);
    }
  }

  return {
    addTrap,
    removeTrap
  };
};
