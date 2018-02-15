import Router from 'koa-router';
import {renderWhatsOn} from './controllers';

const r = new Router({ sensitive: true });

r.get('/whats-on', renderWhatsOn);
r.get('/whats-on/:blah+', (ctx) => {
  ctx.redirect('/whats-on');
});

export const router = r.middleware();
