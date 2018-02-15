import Router from 'koa-router';
import {renderWhatsOn} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
// Used to deal with the gumpf Drupal creates e.g. /whats-on/events/all-events
r.get('/whats-on/:blah+', (ctx) => {
  ctx.redirect('/whats-on');
});

export const router = r.middleware();
