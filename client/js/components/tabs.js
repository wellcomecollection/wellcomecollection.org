import { KEYS } from '../util';

const tabs = (el) => {
  const tablist = el.querySelector('.js-tablist');
  const tabitems = el.querySelectorAll('.js-tabitem');
  const tablinks = tablist.querySelectorAll('.js-tablink');
  const tabpanels = el.querySelectorAll('.js-tabpanel');

  tabpanels.forEach((item) => {
    item.classList.add('js-tabpanel', 'is-hidden');
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
        item.classList.add('is-hidden');
      });

      currentTab = tablist.querySelector('.is-current');
      currentTab.classList.remove('is-current');
      currentTab.querySelector('.js-tablink')
        .setAttribute('aria-selected', 'false');

      const tabitemsArray = Array.prototype.slice.call(tabitems);
      const tabParent = tab.parentNode;

      tabpanel = tabpanels[tabitemsArray.indexOf(tabParent)];
      tabpanel.setAttribute('aria-hidden', 'false');
      tabpanel.classList.remove('is-hidden');

      tab.setAttribute('aria-selected', 'true');
      tabParent.classList.add('is-current');

      const elToFocus = tabpanel.querySelector('.js-tabfocus') || tabpanel.firstElementChild;
      elToFocus.setAttribute('tabindex', '-1');
      elToFocus.focus();
    });

    tablinks.forEach((item) => {
      item.addEventListener('keydown', ({ keyCode }) => {
        switch (keyCode) {
          case KEYS.LEFT:
            const prevSibling = item.parentElement.previousElementSibling;
            if (prevSibling.length === 0) return;

            prevSibling.querySelector('.js-tablink').click();
            break;
          case KEYS.RIGHT:
            const nextSibling = item.parentElement.nextElementSibling;
            if (nextSibling.length === 0) return;

            nextSibling.querySelector('.js-tablink').click();
            break;
        }
      });
    });
  });

  // Display first panel
  const firstTabpanel = el.querySelector('.js-tabpanel');
  firstTabpanel.setAttribute('aria-hidden', 'false');
  firstTabpanel.classList.remove('is-hidden');

  // Set first tab/link as current/selected
  const firstItem = tablist.querySelector('.js-tabitem');
  firstItem.classList.add('is-current');

  const firstLink = firstItem.querySelector('.js-tablink');
  firstLink.setAttribute('aria-selected', 'true');
  firstLink.setAttribute('tabindex', '0');
};

export default tabs;
