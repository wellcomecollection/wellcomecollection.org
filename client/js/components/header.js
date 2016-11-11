import showHide from './show-hide';
import { nodeList, KEYS } from './../util';

const header = (el) => {
  const headerNav = el.querySelector('.js-header-nav');
  const headerLower = el.querySelector('.js-header-lower');
  const headerSearchForm = el.querySelector('.js-search');
  const headerSearchInput = headerSearchForm.querySelector('.js-search-input');
  const headerItems = headerNav.querySelectorAll('.js-show-hide');
  let searchToggle;
  let dropdowns;
  let burger;

  const init = () => {
    dropdowns = collectDropdowns();
    burger = showHide({el: headerLower});
    searchToggle = showHide({el: headerSearchForm});
    setBurgerAria(isBurgerVisible());
    handleEvents();
  };

  const collectDropdowns = () => {
    return nodeList(headerItems).map((headerItem) => {
      return showHide({el: headerItem});
    });
  };

  const hideAllDropdowns = () => {
    dropdowns.forEach((dropdown) => {
      dropdown.setActive(false);
    });
  };

  const setBurgerAria = (value) => {
    if (value) {
      burger.el.setAttribute('aria-expanded', burger.getActive());
    } else {
      burger.el.removeAttribute('aria-expanded');
    }
  };

  const isBurgerVisible = () => {
    const isDisplayed = window.getComputedStyle(burger.trigger)
      .getPropertyValue('display') === 'block';

    return isDisplayed;
  };

  const handleEvents = () => {
    const firstDropdown = dropdowns[0];
    const lastDropdown = dropdowns[dropdowns.length - 1];

    dropdowns.forEach((dropdown) => {
      dropdown.trigger.addEventListener('mouseover', () => {
        hideAllDropdowns();
        dropdown.setActive(true);
      });

      dropdown.trigger.addEventListener('focus', () => {
        hideAllDropdowns();
        dropdown.setActive(true);
      });

      dropdown.trigger.addEventListener('keydown', ({ keyCode }) => {
        if (keyCode !== KEYS.ESCAPE) return;

        dropdown.setActive(false);
      });

      dropdown.drawer.addEventListener('keydown', ({ keyCode }) => {
        if (keyCode !== KEYS.ESCAPE) return;

        dropdown.setActive(false);
      });

      headerNav.addEventListener('mouseleave', () => {
        hideAllDropdowns();
      });
    });

    firstDropdown.trigger.addEventListener('keydown', ({ keyCode, shiftKey }) => {
      if (keyCode !== KEYS.TAB) return;
      if (!shiftKey) return;

      hideAllDropdowns();
    });

    lastDropdown.trigger.addEventListener('keydown', ({ keyCode, shiftKey }) => {
      if (keyCode !== KEYS.TAB) return;
      if (shiftKey) return;

      hideAllDropdowns();
    });

    burger.trigger.addEventListener('click', (event) => {
      event.preventDefault();

      if (burger.getActive()) {
        burger.setActive(false);
        document.body.classList.remove('is-fixed', 'is-fixed--small');
      } else {
        burger.setActive(true);
        document.body.classList.add('is-fixed', 'is-fixed--small');
      }
    });

    burger.trigger.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode !== KEYS.ESCAPE) return;

      burger.setActive(false);
    });

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

    window.addEventListener('resize', () => {
      // TODO: throttle or debounce this
      setBurgerAria(isBurgerVisible());
    });
  };

  init();
};

export default header;
