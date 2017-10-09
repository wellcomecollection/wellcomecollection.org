import path from 'path';
import Fractal from '@frctl/fractal';
import Nunjucks from '@frctl/nunjucks';
import mandelbrot from '@frctl/mandelbrot';
import {Map} from 'immutable';
import filters from '../server/filters';
import extensions from '../server/extensions';
import {getEnvWithGlobalsExtensionsAndFilters} from '../server/view/env-utils';
import {createPageConfig} from '../server/model/page-config';
import statuses from './config/statuses';

const fractal = Fractal.create();
const root = serverDir('views');

// We need to set this up because Fractal doesn't allow us to specify our own
// nunjucks env, but rather uses config to set it up.
const nunjucksEnv = getEnvWithGlobalsExtensionsAndFilters(root, Map());
const extensionsWithEnv = extensions.map(Extension => new Extension(nunjucksEnv));

const nunjucks = Nunjucks({
  paths: ['./../server', root],
  filters: filters.toJS(),
  extensions: extensionsWithEnv.toJS(),
  globals: {
    pageConfig: createPageConfig({ title: 'Cardigan', inSection: 'explore', path: '/' })
  }
});
fractal.components.engine(nunjucks);

fractal.set('project.title', 'Design system');

fractal.components.set('path', root);
fractal.components.set('statuses', statuses);
fractal.components.set('default.status', 'wip');
fractal.components.set('ext', '.njk');
fractal.components.set('default.preview', '@preview');
fractal.components.set('default.collator', function(markup, item) {
  return (`
    <hr class="divider divider--keyline divider--pumice" style="margin: 6px 0;" />
    <h2 class="styleguide__font__example--HNM5" style="margin-bottom: 24px;">${item.label}</h2>
    <div style="margin-bottom: 24px;">
      ${markup}
    </div>
  `);
});

fractal.docs.set('path', serverDir('views/docs'));
fractal.docs.set('ext', 'njk');
fractal.docs.engine(nunjucks);

fractal.web.set('static.path', dir('./../dist'));
fractal.web.set('builder.dest', '.dist');

const cardiganTheme = mandelbrot({
  skin: 'navy',
  styles: ['default', '/dist-styles/styleguide.css'],
  favicon: '/cardigan-theme/assets/favicon.ico'
});
cardiganTheme.addLoadPath(serverDir('cardigan-theme'));
cardiganTheme.addLoadPath(serverDir('views'));
cardiganTheme.addStatic(serverDir('cardigan-theme'), '/cardigan-theme');
cardiganTheme.addStatic(dir('./../dist/assets/css/'), '/dist-styles');
fractal.web.theme(cardiganTheme);

export default fractal;

function dir(relPath) {
  return path.resolve(`${__dirname}${relPath}`);
}

function serverDir(relPath) {
  return dir(`./../server/${relPath}`);
}
