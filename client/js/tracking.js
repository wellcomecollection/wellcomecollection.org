/* global ga */

import { on } from './util';

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
      // doing any tracking, then following the link programatically.
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

export default {
  init: () => {
    // GA events
    on('body', 'click', '[data-track-event]', ({ target }) => {
      const el = target.closest('[data-track-event]');
      trackGaEvent(JSON.parse(el.getAttribute('data-track-event')));
    });

    on('body', 'click', 'a', (event) => {
      const anchor = event.target.closest('a');

      const url = anchor.href;
      if (isExternal(url)) {
        trackOutboundLink(url);
      }
    });
  }
};
