import { on, getClosest, nodeList } from './util';
import { trackEvent } from './utils/track-event';

// Transporter
on('body', 'click', '[data-track="transporter"]', (event) => {
  const transporter = getClosest(event.target, '[data-track="transporter"]');
  const promos = nodeList(transporter.querySelectorAll('.promo'));
  const promo = getClosest(event.target, '.promo');
  const link = promo ? promo.href : null;
  const position = promo ? promos.indexOf(promo) : null;
  const properties = {id: transporter.id, link, position};

  if (link) {
    trackEvent({name: 'Transporter', properties});
  }
});
