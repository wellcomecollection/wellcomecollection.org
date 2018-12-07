import Koa from 'koa';
import Router from 'koa-router';
import {
  renderEventbriteWidget,
  getEventsInfo
} from './controllers';

const app = new Koa();
const router = new Router({ sensitive: true });
router.get('/eventbrite/widget/:id', renderEventbriteWidget);
router.get('/eventbrite/api/v1/events', getEventsInfo);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3004);
console.log('Eventbrite service started on http://localhost:3004/eventbrite');
