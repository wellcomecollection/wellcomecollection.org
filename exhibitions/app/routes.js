import Router from 'koa-router';
import {renderExhibition, renderExhibitionsList} from './controllers';

const r = new Router({ sensitive: true });
r.get('/:preview(preview)?/exhibitions/:id', renderExhibition);
r.get('/:preview(preview)?/exhibitions', renderExhibitionsList);

export const router = r.middleware();
