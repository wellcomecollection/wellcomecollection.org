import showHide from './../show-hide';
import { KEYS } from './../../util';

const headerSearch = (el) => {
  const headerSearchForm = el.querySelector('.js-search');
  const headerSearchInput = headerSearchForm.querySelector('.js-search-input');
  const searchToggle = showHide({el: headerSearchForm});

  const init = () => {
    handleEvents();
  };

  const handleEvents = () => {
    headerSearchForm.addEventListener('submit', (event) => {
      if (searchToggle.getActive() && headerSearchInput.value.trim().length) return;

      event.preventDefault();
      searchToggle.toggleActive();

      if (searchToggle.getActive()) {
        searchToggle.drawer.focus();
      }
    });

    headerSearchInput.addEventListener('keydown', ({ keyCode, shiftKey }) => {
      if (keyCode !== KEYS.ESCAPE && keyCode !== KEYS.TAB) return;
      if (keyCode === KEYS.TAB && !shiftKey) return;

      searchToggle.setActive(false);
      searchToggle.trigger.focus();
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
