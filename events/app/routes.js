import Router from 'koa-router';
import {renderEvent, renderEventsList} from './controllers';

const r = new Router({ sensitive: true });

r.get('/:preview(preview)?/ev/:id', renderEvent);
r.get('/ev', renderEventsList);

export const router = r.middleware();
