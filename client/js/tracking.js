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
    const actuallyTrackLinks = (url, shouldOpenNewTab) => {
      const options =  {
        'transport': 'beacon',
        'hitCallback': () => {
          document.location = url;
        }
      };
      ga('send', 'event', 'outbound', 'click', url, (shouldOpenNewTab ? {} : options));
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
      const ctrlOrMetaKey = event.metaKey || event.ctrlKey;
      const shouldOpenNewTab = anchor.target === '_blank' || ctrlOrMetaKey;

      const url = anchor.href;
      if (isExternal(url)) {
        trackOutboundLink(url, shouldOpenNewTab);
      }
    });
  }
};

