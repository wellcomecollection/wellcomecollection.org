import Router from 'koa-router';
import {renderEvent, renderEventSeries, renderEventsList} from './controllers';

const r = new Router({ sensitive: true });

r.get('/events/:id/:preview(preview)?', renderEvent);
r.get('/events', renderEventsList);
r.get('/event-series/:id', renderEventSeries);

export const router = r.middleware();
