// @flow
import path from 'path';
import {setupApp} from 'common';
import Router from 'koa-router';
import {renderExhibition} from './controllers';

const r = new Router({ sensitive: true });

r.get('/:preview(preview)?/ex/:id', renderExhibition);

const router = r.middleware();
const viewPaths = [path.join(__dirname, 'views')];

setupApp({ router, viewPaths }).listen(3001);

console.log('Exhibitions GO!')
