import showHide from './show-hide';
import focusTrap from './focus-trap';
import { onWindowResizeDebounce$ } from '../utils/dom-events';
import fastdom from '../utils/fastdom-promise';

export default (el) => {
  const showHideEl = el.querySelector('.js-segmented-control-show-hide');
  const controlDrawerLinks = el.querySelectorAll('.js-segmented-control__drawer-link');
  const fullPage = showHide({el: showHideEl});
  const trap = focusTrap(el);

  function init() {
    setFullPageAria(isTriggerVisible());
    fastdom.mutate(() => {
      fullPage.trigger.setAttribute('aria-controls', fullPage.drawer.id);
    });
    handleEvents();
  }

  function toggleElementVisibility() {
    if (fullPage.getActive()) {
      fullPage.setActive(false);
      trap.removeTrap();

      fastdom.mutate(() => {
        fullPage.el.setAttribute('aria-expanded', false);
        document.body.classList.remove('is-scroll-locked--to-medium');
      });
    } else {
      fullPage.setActive(true);
      trap.addTrap();

      fastdom.mutate(() => {
        fullPage.el.setAttribute('aria-expanded', true);
        document.body.classList.add('is-scroll-locked--to-medium');
      });
    }
  }

  function handleEvents() {
    fullPage.trigger.addEventListener('click', () => {
      toggleElementVisibility();
    });

    controlDrawerLinks.forEach((link, index) => {
      link.addEventListener('click', (event) => {
        if (link.getAttribute('href').charAt(0) === '#') {
          toggleElementVisibility();
        }
      });
    });

    onWindowResizeDebounce$.subscribe({
      next() {
        setFullPageAria(isTriggerVisible());
      }
    });
  }

  function isTriggerVisible() {
    return fastdom.measure(() => {
      return window.getComputedStyle(fullPage.el)
        .getPropertyValue('display') === 'block';
    });
  }

  function setFullPageAria(value) {
    if (value) {
      fastdom.mutate(() => {
        fullPage.el.setAttribute('aria-expanded', fullPage.getActive());
      });
    } else {
      fastdom.mutate(() => {
        fullPage.el.removeAttribute('aria-expanded');
      });
    }
  }

  init();
};
