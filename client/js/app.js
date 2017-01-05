import {message} from './wellcome';
import { nodeList } from './util';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';
import openingHours from './components/opening-hours';
import wobblyEdge from './components/wobbly-edge';
import cookieNotification from './components/cookie-notification';
import preventOverlapping from './components/prevent-overlapping';
import makeSticky from './components/make-sticky.js';
message();

const init = () => {
  const cookieEl = document.getElementById('cookie-notification');
  const burgerEl = document.querySelector('.js-header-burger');
  const headerSearchEl = document.getElementById('header-search');
  const openingHoursEls = document.querySelectorAll('.js-opening-hours');
  const wobblyEdgeEls = document.querySelectorAll('.js-wobbly-edge');
  const overlappingEls = document.querySelectorAll('.article__main .figure--sticky, .article__main .figure--full-width');
  const stickyEls = document.querySelectorAll('.article__main .figure--sticky');

  nodeList(wobblyEdgeEls).forEach((el) => wobblyEdge(el));

  if (cookieEl) {
    cookieNotification(cookieEl);
  }

  if (burgerEl) {
    headerBurger(burgerEl);
  }

  if (headerSearchEl) {
    headerSearch(headerSearchEl);
  }

  if (openingHoursEls) {
    openingHours(openingHoursEls);
  }

  if (overlappingEls) {
    preventOverlapping(overlappingEls);
  }

  if (stickyEls) {
    makeSticky(stickyEls);
  }
};

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
