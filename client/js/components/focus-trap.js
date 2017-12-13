import { addAttrToElements, removeAttrFromElements } from '../util';

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
      addAttrToElements([trapStart, trapEnd], 'tabindex', '0');
      trapEnd.addEventListener('focus', focusTrapStart);
    }

    if (trapReverseStart && trapReverseEnd) {
      addAttrToElements([trapReverseStart, trapReverseEnd], 'tabindex', '0');
      trapReverseEnd.addEventListener('keyup', focusTrapReverseStart);
    }
  }

  function removeTrap() {
    if (trapStart && trapEnd) {
      removeAttrFromElements([trapStart, trapEnd], 'tabindex');
      trapEnd.removeEventListener('focus', focusTrapStart);
    }

    if (trapReverseStart && trapReverseEnd) {
      removeAttrFromElements([trapReverseStart, trapReverseEnd], 'tabindex');
      trapReverseEnd.removeEventListener('keyup', focusTrapReverseStart);
    }
  }

  return {
    addTrap,
    removeTrap
  };
};
