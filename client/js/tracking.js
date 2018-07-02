/* global ga */

import { on, testLocalStorage } from './util';

const hasWorkingLocalStorage = testLocalStorage();

const maybeTrackEvent = (hasAnalytics) => {
  if (hasAnalytics) {
    const actuallyTrackEvent = ({category, action, label}) => {
      ga('send', {
        hitType: 'event',
        eventCategory: category,
        eventAction: action,
        eventLabel: label
      });
    };
    return actuallyTrackEvent;
  } else {
    const noop = () => {};
    return noop;
  }
};

const maybeTrackOutboundLinks = (hasAnalytics) => {
  if (hasAnalytics) {
    const actuallyTrackLinks = (url) => {
      // This means that we won't be *consistently* tracking external links
      // in IE11 and iOS Safari: https://caniuse.com/#feat=beacon
      // On balance, this is probably better than preventDefault-ing the link event,
      // doing any tracking, then following the link programmatically.
      ga('send', 'event', 'outbound', 'click', url, {'transport': 'beacon'});
    };
    return actuallyTrackLinks;
  } else {
    const noop = () => {};
    return noop;
  }
};

function getDomain(url) {
  return url.replace('http://', '').replace('https://', '').split('/')[0];
}

function isExternal(url) {
  return getDomain(document.location.href) !== getDomain(url);
}

export const trackGaEvent = maybeTrackEvent(window.ga);

export const trackOutboundLink = maybeTrackOutboundLinks(window.ga);

// e.g:
// [
//  { ExhibitionPromo: {} },
//  { Page: {active: 'tomorrow'} } // <= this will always be set
// ]
function getComponentList(el, componentList = []) {
  const componentEl = el.closest('[data-component]');

  if (componentEl) {
    const componentName = componentEl.getAttribute('data-component');
    const componentStateString = componentEl.getAttribute('data-component-state');
    const componentState = componentStateString ? JSON.parse(componentStateString) : {};
    const updatedComponentList = componentList.concat([{[componentName]: componentState}]);
    if (componentEl.parentNode) {
      return getComponentList(componentEl.parentNode, updatedComponentList);
    }
    return updatedComponentList;
  } else {
    return componentList;
  }
}

export default {
  init: () => {
    const pageState = document.body.getAttribute('data-page-state') ? JSON.parse(document.body.getAttribute('data-page-state')) : {};
    // GA events
    on('body', 'click', '[data-track-event]', (event) => {
      const el = event.target.closest('[data-track-event]');
      const trackData = JSON.parse(el.getAttribute('data-track-event'));
      const componentList = getComponentList(el);
      const componentListString = JSON.stringify(componentList.concat([{Page: pageState}]));
      const label = `${(trackData.label || '')},componentList:${componentListString}`;
      trackGaEvent(Object.assign({}, trackData, {label}));
    });

    on('body', 'click', 'a', (event) => {
      const anchor = event.target.closest('a');

      const url = anchor.href;
      if (isExternal(url)) {
        trackOutboundLink(url);
      } else {
        // We set the component list data in localStorage,
        // which we then retrieve on the next pageview,
        // and pass along to GA there
        if (!hasWorkingLocalStorage) return;

        const el = event.target.closest('[data-component]');
        const componentList = (el ? getComponentList(el) : []).concat([{Page: pageState}]);
        const componentListString = JSON.stringify(componentList);

        if (componentList.length > 0) {
          window.localStorage.setItem('wc_referring_component_list', componentListString);
        }
      }
    });
  }
};
