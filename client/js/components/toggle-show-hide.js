import showHide from './show-hide';
import { trackGaEvent } from '../tracking';

export default (el) => {
  const toggle = showHide({el});
  const trackingAction = el.getAttribute('data-track-action');
  const trackingLabel = el.getAttribute('data-track-label');

  toggle.trigger.addEventListener('click', () => {
    if (trackingAction) {
      const extraLabel =  trackingLabel ? `${trackingLabel}, ` : '';
      const isActive = toggle.getActive();

      trackGaEvent('component', `${trackingAction}:click`, `${extraLabel}click-action:${isActive ? 'did close' : 'did open'}`);
    }

    toggle.toggleActive();
  });
};
