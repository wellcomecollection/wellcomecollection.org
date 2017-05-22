import { on, nodeList } from './util';
import { trackEvent } from './utils/track-event';

export default {
  init: () => {
    on('body', 'click', '[data-track-click]', ({ target }) => {
      const component = target.closest('[data-component]');
      const clicked = target.closest('[data-track-click]');
      const componentName = component.getAttribute('data-component');
      const componentId = component.getAttribute('data-component-id');
      const clickedProperties = JSON.parse(clicked.getAttribute('data-track-click'));
      const properties = Object.assign({}, clickedProperties, {componentId});

      trackEvent({name: componentName, properties});
    });
  }
};
