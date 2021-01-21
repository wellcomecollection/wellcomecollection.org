import * as path from 'path';
import send from 'koa-send';
import { RouteMiddleware } from '../../types/application';

export const frontendBundles: RouteMiddleware<{
  slug: string;
  bundleId: string;
  bundleName?: string;
}> = async (context) => {
  if ((context.params.bundleName || '').match(/\.\./)) {
    context.status = 404;
    return;
  }

  const root = path.resolve(__dirname, '..', '..', '..', 'lib', 'frontend');

  const bundle = path.join('build', context.params.bundleName || 'bundle.js');

  await send(context, bundle, { root });
};
