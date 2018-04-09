import Router from 'koa-router';
import {renderExhibitionsList} from './controllers';

const r = new Router({ sensitive: true });
r.get('/exhibitions', renderExhibitionsList);

export const router = r.middleware();
