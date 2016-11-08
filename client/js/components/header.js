import showHide from './show-hide';
import { nodeList } from './../util';

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

    headerNav.addEventListener('mouseleave', () => {
      hideAll();
    });
  });
};

export default header;
