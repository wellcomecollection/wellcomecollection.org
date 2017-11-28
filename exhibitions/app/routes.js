import Router from 'koa-router';
import {renderExhibition} from './controllers';

const r = new Router({ sensitive: true });
r.get('/:preview(preview)?/exhibitions/:id', renderExhibition);

export const router = r.middleware();
