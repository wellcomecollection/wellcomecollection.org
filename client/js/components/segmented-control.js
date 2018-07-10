import showHide from './show-hide';
import focusTrap from './focus-trap';
import { onWindowResizeDebounce$ } from '../utils/dom-events';
import fastdom from '../utils/fastdom-promise';

export default (el) => {
  const showHideEl = el.querySelector('.js-segmented-control-show-hide');
  const controlDrawerLinks = el.querySelector('.js-segmented-control__drawer-list');
  const controlLinks = el.querySelector('.js-segmented-control__list');
  const controlButtonText = el.querySelector('.js-segmented-control__button-text');
  const fullPage = showHide({el: showHideEl});
  const trap = focusTrap(el);
  const activeClasses = ['is-active', 'bg-black', 'font-white', 'bg-hover-pewter'];
  const inactiveClasses = ['bg-white', 'font-black', 'bg-hover-pumice'];

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

    controlDrawerLinks.addEventListener('click', (e) => {
      const link = e.target;
      if (link.getAttribute('href').charAt(0) === '#') {
        controlButtonText.innerText = link.innerText;
        toggleElementVisibility();
      }
    }, false);

    controlLinks.addEventListener('click', (e) => {
      const link = e.target;

      if (!link.hasAttribute('href')) return;
      if (link.classList.contains('is-active') || link.getAttribute('href').charAt(0) !== '#') return;

      const currentActive = el.querySelector('.is-active');

      fastdom.mutate(() => {
        currentActive.classList.remove(...activeClasses);
        currentActive.classList.add(...inactiveClasses);
        link.classList.remove(...inactiveClasses);
        link.classList.add(...activeClasses);
      });
    }, false);

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
