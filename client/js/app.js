import {message} from './wellcome';
import { nodeList } from './util';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';
import openingHours from './components/opening-hours';
import wobblyEdge from './components/wobbly-edge';
import cookieNotification from './components/cookie-notification';

message();

const init = () => {
  const cookieEl = document.getElementById('cookie-notification');
  const burgerEl = document.querySelector('.js-header-burger');
  const headerSearchEl = document.getElementById('header-search');
  const openingHoursEls = document.querySelectorAll('.js-opening-hours');
  const wobblyEdgeEls = document.querySelectorAll('.js-wobbly-edge');

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
};

if (document.readyState !== 'loading') {
  init();
} else {
  console.log('loading');
  document.addEventListener('DOMContentLoaded', init);
}

