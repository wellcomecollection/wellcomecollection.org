/* global Raven */
import 'core-js/fn/object/assign';
import 'whatwg-fetch';
import lazysizes from 'lazysizes';

import { nodeList } from './util';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';
import openingHours from './components/opening-hours';
import wobblyEdge from './components/wobbly-edge';
import cookieNotification from './components/cookie-notification';
import preventOverlapping from './components/prevent-overlapping';
import makeSticky from './components/make-sticky.js';
import instagram from './components/instagram';
import asynContent from './components/async-content';
import shrinkStoriesNav from './components/shrink-stories-nav';
import contentSlider from './components/content-slider';

const init = () => {
  nodeList(document.querySelectorAll('.async-content')).forEach(asynContent);

  lazysizes.init();
  instagram.init();

  const cookieEl = document.getElementById('cookie-notification');
  const burgerEl = document.querySelector('.js-header-burger');
  const headerSearchEl = document.getElementById('header-search');
  const openingHoursEls = document.querySelectorAll('.js-opening-hours');
  const wobblyEdgeEls = document.querySelectorAll('.js-wobbly-edge');
  const overlappingEls = document.querySelectorAll('.js-sticky, .js-full-width');
  const stickyEls = document.querySelectorAll('.js-sticky');
  const seriesNav = document.querySelector('.js-series-nav');
  const seriesSlider = document.querySelector('.js-numbered-slider');

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

  if (seriesNav) {
    shrinkStoriesNav(seriesNav);
  }

  if (seriesSlider) {
    contentSlider(seriesSlider, {
      transitionSpeed: 0.7,
      startPosition: 0,
      cssPrefix: 'numbered-list__'
    });
  }
};

function initWithRaven() {
  try {
    init();
  } catch (e) {
    Raven.captureException(e);
    throw e;
  }
}

if (document.readyState !== 'loading') {
  initWithRaven();
} else {
  document.addEventListener('DOMContentLoaded', initWithRaven);
}
