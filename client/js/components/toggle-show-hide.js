import showHide from './show-hide';
import { trackEvent } from '../utils/track-event';

export default (el) => {
  const toggle = showHide({el});
  const trackingJson = el.getAttribute('data-tracking-info');

  toggle.trigger.addEventListener('click', () => {
    if (trackingJson) {
      const trackingInfo = JSON.parse(trackingJson);
      const isActive = toggle.getActive();

      trackEvent(Object.assign(
        {},
        trackingInfo,
        {clickAction: isActive ? 'didClose' : 'didOpen'}
      ));
    }

    toggle.toggleActive();
  });
};
