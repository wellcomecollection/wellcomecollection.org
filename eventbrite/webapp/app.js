import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import fetch from 'isomorphic-unfetch';

import {
  renderEventbriteWidget,
  getEventsInfo
} from './controllers';

const app = new Koa();
const router = new Router({ sensitive: true });
router.get('/eventbrite/widget/:id', renderEventbriteWidget);
router.get('/eventbrite/api/v1/events', getEventsInfo);
router.post('/eventbrite/api/v1/events', async (ctx, next) => {
  const {masterRef} = ctx.request.body;
  // TODO: maybe a GraphQuery would be easier here
  const fetchLinks = [
    'events-formats.title',
    'places.title',
    'event-series.title',
    'interpretation-types.title',
    'audiences.title'
  ];
  const url = `https://wellcomecollection.prismic.io/api/v2/documents/search?ref=${masterRef}&orderings=%5Bdocument.last_publication_date+desc%5D&fetchLinks=${fetchLinks.join(',')}&format=json`;
  const json = await fetch(url).then(res => res.json());
  const lastUpdated = json.results && json.results[0];
  if (lastUpdated && lastUpdated.type === 'events') {
    const event = lastUpdated;
    console.log(JSON.stringify(event));
  }
  ctx.body = 'ok';
  return next();
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
console.log('Eventbrite service started on http://localhost:3000/eventbrite');
