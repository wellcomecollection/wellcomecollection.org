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
import infoBanner from './components/info-banner';
import makeSticky from './components/make-sticky';
import instagram from './components/instagram';
import asynContent from './components/async-content';
import contentSlider from './components/content-slider';
import gaScrollDepth from '../libs/ga-scroll-depth';
import createImageViewer from './components/image-viewer';
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
import copyUrl from './components/copy-url';
import searchBox from './components/search-box';
import iframeContainer from './components/iframe-container';
import {eventbriteTicketButton} from './components/eventbrite-ticket-button';
import segmentedControl from './components/segmented-control';
import tabs from './components/tabs';

const init = () => {
  polyfills.init();

  nodeList(document.querySelectorAll('.async-content')).forEach((el) => {
    asynContent(el, dispatch);
  });

  lazysizes.init();
  instagram.init();
  tracking.init();
  fontObserver.init();

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
  const copyUrlEls = document.querySelectorAll('.js-copy-url');
  const searchBoxEls = document.querySelectorAll('.js-search-box');
  const iframeContainerEls = document.querySelectorAll('.js-iframe-container');
  const viewersFullscreen = document.querySelectorAll('.js-image-viewer');
  const infoBannerEls = document.querySelectorAll('.js-info-banner');
  const segmentedControlEls = document.querySelectorAll('.js-segmented-control');
  const eventsFilter = document.querySelectorAll('.js-events-filter');

  nodeList(segmentedControlEls).forEach(segmentedControl);

  nodeList(infoBannerEls).forEach(infoBanner);

  nodeList(iframeContainerEls).forEach(iframeContainer);

  nodeList(searchBoxEls).forEach(searchBox);

  nodeList(copyUrlEls).forEach(copyUrl);

  nodeList(gifVideoEls).forEach(gifVideo);

  nodeList(wobblyEdgeEls).forEach((el) => wobblyEdge(el));

  nodeList(toggleShowHideEls).forEach(toggleShowHide);

  nodeList(scrollToInfoEls).forEach(scrollToInfo);

  nodeList(viewersFullscreen).forEach((viewer) => createImageViewer(viewer));

  nodeList(eventsFilter).forEach((el) => tabs(el, {
    currentClass: 'tabitem--is-current',
    visibleClass: 'tabpanel--is-visible'
  }));

  if (mainEl) {
    gaScrollDepth(mainEl);
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

  nodeList(document.querySelectorAll('.js-eventbrite-ticket-button')).forEach(eventbriteTicketButton);
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
