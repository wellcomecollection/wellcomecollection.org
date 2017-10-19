/* global ga */

import { on, fullscreenchange, fullscreenEnabled } from './util';

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
      ga('send', 'event', 'outbound', 'click', url, {
        'transport': 'beacon',
        'hitCallback': () => {
          document.location = url;
        }
      });
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

    on('body', 'click', 'a', ({ target }) => {
      const anchor = target.closest('a');
      const url = anchor.href;
      if (isExternal(url)) {
        trackOutboundLink(url);
      }
    });

    fullscreenchange.forEach((eventName) => {
      document.addEventListener(eventName, (event) => {
        const status  = fullscreenEnabled() ? 'opened' : 'closed';
        trackGaEvent({
          category: 'component',
          action: `fullscreen:${status}`,
          label: `title:${document.title}, fullscreenElement:${event.target.className}`
        });
      });
    });
  }
};
