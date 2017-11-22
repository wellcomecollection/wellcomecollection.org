import {setupApp} from 'common/app';
import Router from 'koa-router';
import {renderExhibition} from './controllers';

const r = new Router({ sensitive: true });

r.get('/:preview(preview)?/ex/:id', renderExhibition);
r.get('/ex/:id', (ctx, next) => {
  console.info('exhi:id');
  next();
});

const router = r.middleware();
setupApp(router).listen(3001);
