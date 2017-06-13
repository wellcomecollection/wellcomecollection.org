/* global ga */

import { on } from './util';
import { trackEvent } from './utils/track-event';

export default {
  init: () => {
    on('body', 'click', '[data-track-click]', ({ target }) => {
      const component = target.closest('[data-component-name]');
      const clicked = target.closest('[data-track-click]');
      const componentName = component.getAttribute('data-component-name');
      const componentId = component.getAttribute('data-component-id');
      const clickedProperties = JSON.parse(clicked.getAttribute('data-track-click'));
      const properties = Object.assign({}, clickedProperties, {componentId});

      trackEvent({name: componentName, properties});
    });
  }
};

function trackOutboundLink(url) {
  ga('send', 'event', 'outbound', 'click', url, {
    'transport': 'beacon',
    'hitCallback': () => {
      document.location = url;
    }
  });
};

function getDomain(url) {
  return url.replace('http://', '').replace('https://', '').split('/')[0];
}

function isExternal(url) {
  return getDomain(document.location.href) !== getDomain(url);
}

on('body', 'click', 'a', ({ target }) => {
  const anchor = target.closest('a');
  const url = anchor.href;

  if (isExternal(url)) {
    trackOutboundLink(url);
  }
});
