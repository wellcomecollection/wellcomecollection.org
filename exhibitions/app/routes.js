import Router from 'koa-router';
import {renderExhibition, renderExhibitionsList} from './controllers';

const r = new Router({ sensitive: true });
r.get('/exhibitions/:id/:preview(preview)?', renderExhibition);
r.get('/exhibitions/:preview(preview)?', renderExhibitionsList);

export const router = r.middleware();
