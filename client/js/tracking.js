import { on, nodeList } from './util';
import { trackEvent } from './utils/track-event';

export default {
  init: () => {
    // Transporter
    on('body', 'click', '[data-track="transporter"]', (event) => {
      const transporter = event.target.closest('[data-track="transporter"]');
      const promos = nodeList(transporter.querySelectorAll('.promo'));
      const promo = event.target.closest('.promo');
      const link = promo ? promo.href : null;
      const position = promo ? promos.indexOf(promo) : null;
      const properties = {componentId: transporter.id, link, position};

      if (link) {
        trackEvent({name: 'Transporter', properties});
      }
    });
  }
};
