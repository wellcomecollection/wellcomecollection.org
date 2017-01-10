import { KEYS, nodeList } from '../util';

const tabs = (el, options) => {
  const tablist = el.querySelector('.js-tablist');
  const tabitems = el.querySelectorAll('.js-tabitem');
  const tablinks = nodeList(tablist.querySelectorAll('.js-tablink'));
  const tabpanels = nodeList(el.querySelectorAll('.js-tabpanel'));
  const tabfocusers = nodeList(el.querySelectorAll('.js-tabfocus'));
  let currentTab;
  let tabpanel;

  tabpanels.forEach((item) => {
    item.setAttribute('aria-hidden', 'true');
  });

  tablinks.forEach((tab, index) => {
    const id = tab.getAttribute('href').slice(1);
    const tabId = `tab-${id}`;

    tab.id = tabId;
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', `panel-${id}`);

    tabpanels[index].setAttribute('aria-labelledby', tabId);

    tab.addEventListener('click', (event) => {
      event.preventDefault();

      tabpanels.forEach((item) => {
        item.setAttribute('aria-hidden', 'true');
        item.classList.remove(options.visibleClass);
      });

      currentTab = tablist.querySelector(`.${options.currentClass}`);
      currentTab.classList.remove(options.currentClass);
      currentTab.querySelector('.js-tablink')
        .setAttribute('aria-selected', 'false');

      const tabitemsArray = Array.prototype.slice.call(tabitems);
      const tabParent = tab.parentNode;

      tabpanel = tabpanels[tabitemsArray.indexOf(tabParent)];
      tabpanel.setAttribute('aria-hidden', 'false');
      tabpanel.classList.add(options.visibleClass);

      tab.setAttribute('aria-selected', 'true');
      currentTab = tab;
      tabParent.classList.add(options.currentClass);

      const elToFocus = tabpanel.querySelector('.js-tabfocus') || tabpanel.firstElementChild;
      elToFocus.setAttribute('tabindex', '-1');
      elToFocus.focus();
    });

    // Allow tab focus with keyboard
    tab.addEventListener('keydown', ({ keyCode }) => {
      switch (keyCode) {
        case KEYS.LEFT:
        case KEYS.UP:
          const prevSibling = tab.parentElement.previousElementSibling;
          if (!prevSibling) return;

          prevSibling.querySelector('.js-tablink').focus();
          break;
        case KEYS.RIGHT:
        case KEYS.DOWN:
          const nextSibling = tab.parentElement.nextElementSibling;
          if (!nextSibling) return;

          nextSibling.querySelector('.js-tablink').focus();
          break;
      }
    });
  });

  // Return to current tab when tabbing out of the panel
  tabfocusers.forEach((item) => {
    item.addEventListener('keydown', (event) => {
      if (event.keyCode === KEYS.TAB && event.shiftKey) {
        event.preventDefault();
        currentTab.focus();
      }
    });
  });

  // Display first panel
  const firstTabpanel = el.querySelector('.js-tabpanel');
  firstTabpanel.setAttribute('aria-hidden', 'false');
  firstTabpanel.classList.add(options.visibleClass);

  // Set first tab/link as current/selected
  const firstItem = tablist.querySelector('.js-tabitem');
  firstItem.classList.add(options.currentClass);

  const firstLink = firstItem.querySelector('.js-tablink');
  firstLink.setAttribute('aria-selected', 'true');
  firstLink.setAttribute('tabindex', '0');
};

export default tabs;
