import Router from 'koa-router';
import {renderEvent, renderEventsList} from './controllers';

const r = new Router({ sensitive: true });

r.get('/:preview(preview)?/events/:id', renderEvent);
r.get('/events', renderEventsList);

export const router = r.middleware();
