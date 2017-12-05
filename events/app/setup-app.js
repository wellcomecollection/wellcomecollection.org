import path from 'path';
import {setupApp} from 'common';
import Router from 'koa-router';
import {renderEvent} from './controllers';

const r = new Router({ sensitive: true });

r.get('/events/:id/:preview(preview)?', renderEvent);

const router = r.middleware();
const staticPath = path.join(__dirname, '../../dist');
const viewPaths = [path.join(__dirname, 'views')];

export const app = setupApp({ router, viewPaths, staticPath });
