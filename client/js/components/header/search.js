import showHide from './../show-hide';
import { KEYS } from './../../util';

const headerSearch = (el) => {
  const headerSearchInput = el.querySelector('.js-header-input');
  const searchToggle = showHide({
    el: el,
    activeClass: 'header__form--is-active'
  });

  const init = () => {
    handleEvents();
  };

  const handleEvents = () => {
    el.addEventListener('submit', (event) => {
      if (searchToggle.getActive() && (headerSearchInput.value.trim() !== '')) return;

      event.preventDefault();
      searchToggle.toggleActive();

      if (searchToggle.getActive()) {
        searchToggle.drawer.querySelector('input').focus();
      }
    });

    headerSearchInput.addEventListener('keydown', ({ keyCode, shiftKey }) => {
      if (keyCode !== KEYS.ESCAPE && keyCode !== KEYS.TAB) return;
      if (keyCode === KEYS.TAB && !shiftKey) return;

      searchToggle.setActive(false);
      searchToggle.trigger.focus();
    });

    searchToggle.trigger.addEventListener('keyup', ({ keyCode }) => {
      if (keyCode !== KEYS.TAB) return;
      if (searchToggle.getActive()) return;

      searchToggle.setActive(true);
      searchToggle.drawer.querySelector('input').focus();
    });

    searchToggle.trigger.addEventListener('keydown', ({ keyCode, shiftKey }) => {
      if (keyCode !== KEYS.TAB) return;
      if (shiftKey) return;

      searchToggle.setActive(false);
    });
  };

  init();
};

export default headerSearch;
