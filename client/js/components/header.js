import showHide from './show-hide';
import headerSearch from './header/search';
import { nodeList, KEYS } from './../util';

const header = (el) => {
  const headerNav = el.querySelector('.js-header-nav');
  const headerLower = el.querySelector('.js-header-lower');
  const headerItems = headerNav.querySelectorAll('.js-show-hide');
  let dropdowns;
  let burger;

  const init = () => {
    dropdowns = collectDropdowns();
    burger = showHide({el: headerLower});
    headerSearch(el);
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

  const focusNextTrigger = (element, isReverse) => {
    const parentLi = element.parentNode;
    const nextNode = parentLi[isReverse ? 'previousElementSibling' : 'nextElementSibling'];

    if (!nextNode) return;

    nextNode.querySelector('.js-show-hide-trigger').focus();
  };

  const handleEvents = () => {
    const firstDropdown = dropdowns[0];
    const lastDropdown = dropdowns[dropdowns.length - 1];

    dropdowns.forEach((dropdown) => {
      dropdown.trigger.addEventListener('mouseover', () => {
        if (isBurgerVisible()) return;

        hideAllDropdowns();
        dropdown.setActive(true);
      });

      dropdown.trigger.addEventListener('focus', () => {
        if (isBurgerVisible()) return;

        hideAllDropdowns();
        dropdown.setActive(true);
      });

      dropdown.trigger.addEventListener('keydown', ({ keyCode }) => {
        switch (keyCode) {
          case KEYS.RIGHT:
            focusNextTrigger(dropdown.trigger);
            break;
          case KEYS.LEFT:
            focusNextTrigger(dropdown.trigger, true);
            break;
          case KEYS.ESCAPE:
            if (isBurgerVisible()) {
              burger.setActive(false);
              burger.trigger.focus();
            } else {
              dropdown.setActive(false);
            }
        }
      });

      dropdown.drawer.addEventListener('keydown', ({ keyCode }) => {
        if (keyCode !== KEYS.ESCAPE) return;

        dropdown.trigger.focus();
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
        document.body.classList.remove('is-mobile-nav-visible');
      } else {
        burger.setActive(true);
        document.body.classList.add('is-mobile-nav-visible');
      }
    });

    burger.trigger.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode !== KEYS.ESCAPE) return;

      burger.setActive(false);
    });

    window.addEventListener('resize', () => {
      // TODO: throttle or debounce this
      setBurgerAria(isBurgerVisible());
    });
  };

  init();
};

export default header;
