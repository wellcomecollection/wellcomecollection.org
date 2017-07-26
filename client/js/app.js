/* global Raven */
import 'core-js/fn/object/assign';
import 'core-js/fn/promise';
import 'core-js/fn/map';
import 'whatwg-fetch';
import lazysizes from 'lazysizes';

import { store$, dispatch } from './store';
import { nodeList } from './util';
import headerBurger from './components/header/burger';
import headerSearch from './components/header/search';
import openingHours from './components/opening-hours';
import wobblyEdge from './components/wobbly-edge';
import cookieNotification from './components/cookie-notification';
import makeSticky from './components/make-sticky.js';
import instagram from './components/instagram';
import asynContent from './components/async-content';
import contentSlider from './components/content-slider';
import gaScrollDepth from '../libs/ga-scroll-depth';
import joinCohort from './components/join-cohort';
import gifVideo from './components/gif-video';
import tracking from './tracking';
import polyfills from './polyfills';
import truncateText from './components/truncate-text';
import fontObserver from './utils/font-observer';
import sortSearch from './components/sort-search';
import backToTop from './components/back-to-top';
import toggleShowHide from './components/toggle-show-hide';
import scrollToInfo from './components/scroll-to-info';
import workMediaControls from './components/work-media-controls';

const init = () => {
  polyfills.init();

  nodeList(document.querySelectorAll('.async-content')).forEach((el) => {
    asynContent(el, dispatch);
  });

  lazysizes.init();
  instagram.init();
  tracking.init();
  fontObserver.init();

  const cookieEl = document.getElementById('cookie-notification');
  const burgerEl = document.querySelector('.js-header-burger');
  const headerSearchEl = document.getElementById('header-search');
  const openingHoursEls = document.querySelectorAll('.js-opening-hours');
  const wobblyEdgeEls = document.querySelectorAll('.js-wobbly-edge');
  const stickyEls = document.querySelectorAll('.js-sticky');
  const galleries = document.querySelectorAll('.js-image-gallery');
  const mainEl = document.getElementById('main');
  const cohortButtons = document.querySelectorAll('.js-cohort-button');
  const gifVideoEls = document.querySelectorAll('.js-gif-video');
  const sortSearchEls = document.querySelectorAll('.js-sort-search');
  const backToTopEl = document.querySelector('.js-back-to-top');
  const toggleShowHideEls = document.querySelectorAll('.js-show-hide');
  const scrollToInfoEls = document.querySelectorAll('.js-scroll-to-info');
  const workMediaEls = document.querySelectorAll('.js-work-media');

  nodeList(workMediaEls).forEach(workMediaControls);

  nodeList(gifVideoEls).forEach(gifVideo);

  nodeList(wobblyEdgeEls).forEach((el) => wobblyEdge(el));

  nodeList(toggleShowHideEls).forEach(toggleShowHide);

  nodeList(scrollToInfoEls).forEach(scrollToInfo);

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

  if (stickyEls) {
    makeSticky(stickyEls, store$);
  }

  nodeList(sortSearchEls).forEach(sortSearch);
  if (backToTopEl) {
    backToTop(backToTopEl, 'back-to-top--visible');
  }

  nodeList(galleries).forEach((gallery) => {
    contentSlider(gallery, {
      slideSelector: '.image-gallery__item',
      modifiers: ['in-article', 'in-content', 'gallery'],
      sliderType: 'gallery'
    });
  });

  nodeList(cohortButtons).forEach((button) => {
    joinCohort(button);
  });

  const truncateTextNodes = document.querySelectorAll('.js-truncate-text');
  nodeList(truncateTextNodes).forEach(truncateText);
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
