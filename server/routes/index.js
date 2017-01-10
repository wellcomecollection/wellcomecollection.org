import Router from 'koa-router';
import {index, article, artefact, explore, healthcheck} from '../controllers';

const r = new Router();

r.get('/', index);
r.get('/healthcheck', healthcheck);
r.get('/explore', explore);
r.get('/articles/:id', article);
r.get('/artefacts/:id*', artefact);

export const router = r.middleware();
