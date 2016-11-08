import showHide from './show-hide';
import { nodeList, KEYS } from './../util';

const header = (el) => {
  const headerItems = el.querySelectorAll('[data-component="show-hide"]');
  const headerNav = el.querySelector('[data-hook="header-nav"]');
  const dropdowns = [];

  nodeList(headerItems).forEach((headerItem) => {
    dropdowns.push(showHide({el: headerItem}));
  });

  const hideAll = () => {
    dropdowns.forEach((dropdown) => {
      dropdown.setActive(false);
    });
  };

  dropdowns.forEach((dropdown) => {
    dropdown.trigger.addEventListener('mouseover', () => {
      hideAll();
      dropdown.setActive(true);
    });

    dropdown.trigger.addEventListener('focus', () => {
      hideAll();
      dropdown.setActive(true);
    });

    dropdown.trigger.addEventListener('keydown', (event) => {
      if (event.keyCode !== KEYS.ESCAPE) return;

      dropdown.setActive(false);
    });

    headerNav.addEventListener('mouseleave', () => {
      hideAll();
    });
  });

  const firstDropdown = dropdowns[0];
  const lastDropdown = dropdowns[dropdowns.length - 1];

  firstDropdown.trigger.addEventListener('keydown', (event) => {
    if (event.keyCode !== KEYS.TAB) return;
    if (!event.shiftKey) return;

    hideAll();
  });

  lastDropdown.trigger.addEventListener('keydown', (event) => {
    if (event.keyCode !== KEYS.TAB) return;
    if (event.shiftKey) return;

    hideAll();
  });
};

export default header;
