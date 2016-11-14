import showHide from './../show-hide';
import { nodeList, KEYS } from './../../util';
import headerBurger from './burger';

const headerDropdowns = (el) => {
  const headerNav = el.querySelector('.js-header-nav');
  const headerItems = headerNav.querySelectorAll('.js-show-hide');
  const mobileMenu = headerBurger(el);
  const dropdowns = nodeList(headerItems).map((item) => {
    return showHide({el: item});
  });

  const init = () => {
    handleEvents();
  };

  const hideAllDropdowns = () => {
    dropdowns.forEach((dropdown) => {
      dropdown.setActive(false);
    });
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
        if (mobileMenu.isBurgerVisible()) return;

        hideAllDropdowns();
        dropdown.setActive(true);
      });

      dropdown.trigger.addEventListener('focus', () => {
        if (mobileMenu.isBurgerVisible()) return;

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
            if (mobileMenu.isBurgerVisible()) {
              mobileMenu.burger.setActive(false);
              mobileMenu.burger.trigger.focus();
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
  };

  init();
};

export default headerDropdowns;
