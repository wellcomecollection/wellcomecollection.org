import showHide from './show-hide';
import { trackEvent } from '../utils/track-event';

export default (el) => {
  const toggle = showHide({el});
  const trackingJson = el.getAttribute('data-tracking-info');
  const trackingName = el.getAttribute('data-component-name');

  toggle.trigger.addEventListener('click', () => {
    if (trackingJson && trackingName) {
      const trackingInfo = JSON.parse(trackingJson);
      const isActive = toggle.getActive();

      trackEvent({
        name: trackingName,
        properties: Object.assign({}, trackingInfo, {clickAction: isActive ? 'didClose' : 'didOpen'})
      });
    }

    toggle.toggleActive();
  });
};
