import showHide from './show-hide';
import focusTrap from './focus-trap';
import { onWindowResizeDebounce$ } from '../utils/dom-events';

export default (el) => {
  const showHideEl = el.querySelector('.js-segmented-control-show-hide');
  const fullPage = showHide({el: showHideEl});
  const trap = focusTrap(el);

  setFullPageAria(isTriggerVisible());

  fullPage.trigger.setAttribute('aria-controls', 'segmented-control-drawer');

  fullPage.trigger.addEventListener('click', () => {
    if (fullPage.getActive()) {
      fullPage.el.setAttribute('aria-expanded', false);
      fullPage.setActive(false);
      trap.removeTrap();
    } else {
      fullPage.el.setAttribute('aria-expanded', true);
      fullPage.setActive(true);
      trap.addTrap();
    }
  });

  function isTriggerVisible() {
    return window.getComputedStyle(fullPage.el)
      .getPropertyValue('display') === 'block';
  }

  function setFullPageAria(value) {
    if (value) {
      fullPage.el.setAttribute('aria-expanded', fullPage.getActive());
    } else {
      fullPage.el.removeAttribute('aria-expanded');
    }
  }

  onWindowResizeDebounce$.subscribe({
    next() {
      setFullPageAria(isTriggerVisible());
    }
  });
};
