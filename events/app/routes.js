import Router from 'koa-router';
import {renderEvent} from './controllers';

const r = new Router({ sensitive: true });

r.get('/:preview(preview)?/ev/:id', renderEvent);

export const router = r.middleware();
