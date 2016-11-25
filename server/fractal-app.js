import path from 'path';
import Fractal from '@frctl/fractal';
import Nunjucks from '@frctl/nunjucks';
import mandelbrot from '@frctl/mandelbrot';
import Component from './extensions/component';
import getEnv from './view/env-utils';
const fractal = Fractal.create();
const root = dir('/views');
const nunjucksEnv = getEnv(root);

const nunjucks = Nunjucks({
    extensions: { componentExtension: new Component(nunjucksEnv) }
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
    skin: "navy"
});

fractal.web.theme(cardiganTheme);

export default fractal;

function dir(relPath) {
    return path.resolve(`${__dirname}${relPath}`);
}
