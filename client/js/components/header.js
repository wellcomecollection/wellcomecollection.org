import showHide from './show-hide';
import { nodeList, KEYS } from './../util';

const header = (el) => {
  const headerNav = el.querySelector('.js-header-nav');
  const headerLower = el.querySelector('.js-header-lower');
  const headerItems = headerNav.querySelectorAll('.js-show-hide');
  let dropdowns = [];
  let burger;

  const init = () => {
    dropdowns = collectDropdowns();
    burger = makeBurger();
    handleEvents();
  };

  const makeBurger = () => {
    return showHide({el: headerLower});
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

      dropdown.trigger.addEventListener('keydown', (event) => {
        if (event.keyCode !== KEYS.ESCAPE) return;

        dropdown.setActive(false);
      });

      headerNav.addEventListener('mouseleave', () => {
        hideAllDropdowns();
      });
    });

    firstDropdown.trigger.addEventListener('keydown', (event) => {
      if (event.keyCode !== KEYS.TAB) return;
      if (!event.shiftKey) return;

      hideAllDropdowns();
    });

    lastDropdown.trigger.addEventListener('keydown', (event) => {
      if (event.keyCode !== KEYS.TAB) return;
      if (event.shiftKey) return;

      hideAllDropdowns();
    });

    burger.trigger.addEventListener('click', (event) => {
      event.preventDefault();
      burger.toggleActive();
    });

    burger.trigger.addEventListener('keyup', ({ keyCode }) => {
      if (keyCode !== KEYS.ESCAPE) return;

      if (keyCode === KEYS.ESCAPE) {
        burger.setActive(false);
      }
    });
  };

  init();
};

export default header;
