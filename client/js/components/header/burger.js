import showHide from './../show-hide';
import { KEYS } from './../../util';

const headerBurger = (el) => {
  const headerLower = el.querySelector('.js-header-lower');
  const burger = showHide({el: headerLower});

  const init = () => {
    setBurgerAria(isBurgerVisible());
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
        document.body.classList.remove('is-mobile-nav-visible');
      } else {
        burger.setActive(true);
        document.body.classList.add('is-mobile-nav-visible');
      }
    });

    burger.trigger.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode !== KEYS.ESCAPE) return;

      burger.setActive(false);
    });

    window.addEventListener('resize', () => {
      // TODO: throttle or debounce this
      setBurgerAria(isBurgerVisible());
    });
  };

  init();

  return {
    burger,
    isBurgerVisible
  };
};

export default headerBurger;
