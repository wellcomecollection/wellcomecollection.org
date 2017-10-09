import showHide from './../show-hide';
import { KEYS } from './../../util';

const headerSearch = (el) => {
  const headerSearchInput = el.querySelector('.js-header-input');
  const closeSearchButton = el.querySelector('.js-header-close-search');
  const searchToggle = showHide({
    el: el,
    activeClass: 'header__form--is-active'
  });

  const init = () => {
    handleEvents();
  };

  const handleEvents = () => {
    // Only submit the form if the search field is visible and non-empty
    el.addEventListener('submit', (event) => {
      if (searchToggle.getActive() && (headerSearchInput.value.trim() !== '')) return;

      event.preventDefault();
      searchToggle.toggleActive();

      if (searchToggle.getActive()) {
        searchToggle.drawer.querySelector('input').focus();
      }
    });

    // Tabbing backwards or pressing escape on the search field hides the drawer
    headerSearchInput.addEventListener('keydown', ({ keyCode, shiftKey }) => {
      if (keyCode !== KEYS.ESCAPE && keyCode !== KEYS.TAB) return;
      if (keyCode === KEYS.TAB && !shiftKey) return;

      searchToggle.setActive(false);
      searchToggle.trigger.focus();
    });

    // Tabbing onto the search button opens the drawer and focuses the search field
    searchToggle.trigger.addEventListener('keyup', ({ keyCode }) => {
      if (keyCode !== KEYS.TAB) return;
      if (searchToggle.getActive()) return;

      searchToggle.setActive(true);
      searchToggle.drawer.querySelector('input').focus();
    });

    // Tabbing forwards off the search button closes the drawer
    searchToggle.trigger.addEventListener('keydown', ({ keyCode, shiftKey }) => {
      if (keyCode !== KEYS.TAB) return;
      if (shiftKey) return;

      searchToggle.setActive(false);
    });

    // Close search if clicked anywhere outside of search element
    document.addEventListener('click', (event) => {
      if (el.contains(event.target)) return;

      searchToggle.setActive(false);
    });

    closeSearchButton.addEventListener('click', () => {
      searchToggle.setActive(false);
    });
  };

  init();
};

export default headerSearch;
