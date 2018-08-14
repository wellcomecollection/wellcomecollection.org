import Router from 'koa-router';
import {renderEvent} from './controllers';

const r = new Router({ sensitive: true });

r.get('/events/:id/:preview(preview)?', renderEvent);

export const router = r.middleware();
