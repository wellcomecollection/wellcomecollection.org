import { KEYS } from '../util';

const tabs = (el, options = {}) => {
  const defaults = {
    visibleClass: 'is-visible',
    currentClass: 'is-current'
  };
  const settings = Object.assign(defaults, options);
  const tablist = el.querySelector('.js-tablist');
  const tabitems = el.querySelectorAll('.js-tabitem');
  const tablinks = tablist.querySelectorAll('.js-tablink');
  const tabpanels = el.querySelectorAll('.js-tabpanel');

  tabpanels.forEach((item) => {
    item.setAttribute('aria-hidden', 'true');
  });

  tablinks.forEach((tab, index) => {
    const tabId = `tab-${tab.getAttribute('href').slice(1)}`;

    tab.id = tabId;
    tab.setAttribute('aria-selected', 'false');

    tabpanels[index].setAttribute('aria-labelledby', tabId);

    tab.addEventListener('click', (event) => {
      event.preventDefault();

      let tabpanel;
      let currentTab;

      tabpanels.forEach((item) => {
        item.setAttribute('aria-hidden', 'true');
        item.classList.remove(settings.visibleClass);
      });

      currentTab = tablist.querySelector(`.${settings.currentClass}`);
      currentTab.classList.remove(settings.currentClass);
      currentTab.querySelector('.js-tablink')
        .setAttribute('aria-selected', 'false');

      const tabitemsArray = Array.prototype.slice.call(tabitems);
      const tabParent = tab.parentNode;

      tabpanel = tabpanels[tabitemsArray.indexOf(tabParent)];
      tabpanel.setAttribute('aria-hidden', 'false');
      tabpanel.classList.add(settings.visibleClass);

      tab.setAttribute('aria-selected', 'true');
      tabParent.classList.add(settings.currentClass);

      const elToFocus = tabpanel.querySelector('.js-tabfocus') || tabpanel.firstElementChild;
      elToFocus.setAttribute('tabindex', '-1');
      elToFocus.focus();
    });

    tablinks.forEach((item) => {
      item.addEventListener('keydown', ({ keyCode }) => {
        switch (keyCode) {
          case KEYS.LEFT:
            const prevSibling = item.parentElement.previousElementSibling;
            if (!prevSibling) return;

            prevSibling.querySelector('.js-tablink').click();
            break;
          case KEYS.RIGHT:
            const nextSibling = item.parentElement.nextElementSibling;
            if (!nextSibling) return;

            nextSibling.querySelector('.js-tablink').click();
            break;
        }
      });
    });
  });

  // Display first panel
  const firstTabpanel = el.querySelector('.js-tabpanel');
  firstTabpanel.setAttribute('aria-hidden', 'false');
  firstTabpanel.classList.add(settings.visibleClass);

  // Set first tab/link as current/selected
  const firstItem = tablist.querySelector('.js-tabitem');
  firstItem.classList.add(settings.currentClass);

  const firstLink = firstItem.querySelector('.js-tablink');
  firstLink.setAttribute('aria-selected', 'true');
  firstLink.setAttribute('tabindex', '0');
};

export default tabs;
