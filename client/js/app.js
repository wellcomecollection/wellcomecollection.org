/* global Raven */
import 'core-js/fn/object/assign';
import 'whatwg-fetch';
import lazysizes from 'lazysizes';

import { store$, dispatch } from './store';
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
import contentSlider from './components/content-slider';
import gaScrollDepth from '../libs/ga-scroll-depth';

const init = () => {
  nodeList(document.querySelectorAll('.async-content')).forEach((el) => {
    asynContent(el, dispatch);
  });

  lazysizes.init();
  instagram.init();

  const cookieEl = document.getElementById('cookie-notification');
  const burgerEl = document.querySelector('.js-header-burger');
  const headerSearchEl = document.getElementById('header-search');
  const openingHoursEls = document.querySelectorAll('.js-opening-hours');
  const wobblyEdgeEls = document.querySelectorAll('.js-wobbly-edge');
  const overlappingEls = document.querySelectorAll('.js-sticky, .js-full-width');
  const stickyEls = document.querySelectorAll('.js-sticky');
  const galleries = document.querySelectorAll('.js-image-gallery');
  const mainEl = document.getElementById('main');

  nodeList(wobblyEdgeEls).forEach((el) => wobblyEdge(el));

  if (mainEl) {
    gaScrollDepth(mainEl);
  }

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
    makeSticky(stickyEls, store$);
  }

  nodeList(galleries).forEach((gallery) => {
    contentSlider(gallery, {
      slideSelector: '.image-gallery__item',
      cssPrefix: 'image-gallery__',
      sliderType: 'gallery'
    });
  });
};

function initWithRaven() {
  try {
    init();
  } catch (e) {
    Raven.captureException(e);
    throw e;
  }
}

// If the DOM is not loading, we can init, else wait till we do
const domNotLoading = document.readyState !== 'loading';
if (domNotLoading) {
  initWithRaven();
} else {
  document.addEventListener('DOMContentLoaded', initWithRaven);
}
