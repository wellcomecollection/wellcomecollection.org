import path from 'path';
import Fractal from '@frctl/fractal';
import Nunjucks from '@frctl/nunjucks';
import mandelbrot from '@frctl/mandelbrot';
import filters from './filters';
import extensions from './extensions';
import {getEnvWithExtensionsAndFilters} from './view/env-utils';
import {createPageConfig} from './model/page-config';

const fractal = Fractal.create();
const root = dir('/views');

// We need to set this up because Fractal doesn't allow us to specify our own
// nunjucks env, but rather uses config to set it up.
const nunjucksEnv = getEnvWithExtensionsAndFilters(root);
const extensionsWithEnv = extensions.map(Extension => new Extension(nunjucksEnv));

const nunjucks = Nunjucks({
  filters: filters.toJS(),
  extensions: extensionsWithEnv.toJS(),
  globals: {
    pageConfig: createPageConfig({ title: 'Cardigan', inSection: 'explore' })
  }
});
fractal.components.engine(nunjucks);

fractal.set('project.title', 'Cardigan');

fractal.components.set('path', root);
fractal.components.set('default.status', 'wip');
fractal.components.set('ext', '.njk');
fractal.components.set('default.preview', '@preview');

fractal.docs.set('path', dir('/views/docs'));
fractal.web.set('static.path', dir('./../dist'));
fractal.web.set('builder.dest', dir('./../cardigan'));

const cardiganTheme = mandelbrot({
  skin: "navy",
  styles: ['default', '/cardigan-theme/tweaks.css']
});

cardiganTheme.addStatic(path.join(__dirname, '/cardigan-theme'), '/cardigan-theme');

fractal.web.theme(cardiganTheme);

export default fractal;

function dir(relPath) {
  return path.resolve(`${__dirname}${relPath}`);
}
