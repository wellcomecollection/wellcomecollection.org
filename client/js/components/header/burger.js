import showHide from './../show-hide';
import { KEYS } from './../../util';
import focusTrap from './../focus-trap';
import { onWindowResizeDebounce$ } from '../../utils/dom-events';

const headerBurger = (el) => {
  const trap = focusTrap(el);
  const burgerDrawer = el.querySelector('.js-header-burger-drawer');
  const firstNavLink = burgerDrawer.querySelector('.js-header-nav-link');
  const burgerTrigger = el.querySelector('.js-header-burger-trigger');
  const burger = showHide({
    activeClass: 'header--is-burger-open',
    el: el,
    trigger: burgerTrigger,
    drawer: burgerDrawer
  });

  const init = () => {
    setBurgerAria(isBurgerVisible());
    burger.trigger.setAttribute('role', 'button');
    burger.trigger.setAttribute('aria-controls', 'header-nav');
    handleEvents();
  };

  const setBurgerAria = (value) => {
    if (value) {
      burger.el.setAttribute('aria-expanded', burger.getActive());
    } else {
      burger.el.removeAttribute('aria-expanded');
    }
  };

  const isBurgerVisible = () => {
    const isDisplayed = window.getComputedStyle(burger.trigger)
      .getPropertyValue('display') === 'block';

    return isDisplayed;
  };

  const handleEvents = () => {
    burger.trigger.addEventListener('click', (event) => {
      event.preventDefault();

      if (burger.getActive()) {
        burger.setActive(false);
        trap.removeTrap();
        document.body.classList.remove('is-scroll-locked--to-header-medium');
      } else {
        burger.setActive(true);
        trap.addTrap();
        document.body.classList.add('is-scroll-locked--to-header-medium');
      }
    });

    burger.trigger.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode !== KEYS.ESCAPE) return;

      burger.setActive(false);
    });

    // Focus nav items when tabbing from open burger
    burger.trigger.addEventListener('keydown', (event) => {
      if (event.keyCode !== KEYS.TAB) return;
      if (event.shiftKey) return;
      if (!burger.getActive()) return;

      event.preventDefault();
      firstNavLink.focus();
    });

    // Focus burger when tabbing backwards from nav items
    firstNavLink.addEventListener('keydown', (event) => {
      if (event.keyCode !== KEYS.TAB) return;
      if (!event.shiftKey) return;
      if (!isBurgerVisible()) return;

      event.preventDefault();
      burger.trigger.focus();
    });

    onWindowResizeDebounce$.subscribe({
      next() {
        setBurgerAria(isBurgerVisible());
      }
    });
  };

  init();
};

export default headerBurger;
