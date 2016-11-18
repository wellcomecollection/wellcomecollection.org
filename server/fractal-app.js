import Fractal from '@frctl/fractal';
import Nunjucks from '@frctl/nunjucks';
import mandelbrot from '@frctl/mandelbrot';
import Component from './extensions/component';
const fractal = Fractal.create();

fractal.set('project.title', 'Cardigan');
fractal.components.set('path', __dirname + '/views');
fractal.docs.set('path', __dirname + '/views/docs');
fractal.web.set('static.path', __dirname + './../dist');
fractal.web.set('builder.dest', './../cardigan');
fractal.components.set('default.status', 'wip');

const nunjucks = Nunjucks({
    extensions: { componentExtension: Component }
});

fractal.components.engine(nunjucks);
fractal.components.set('ext', '.njk');
fractal.components.set('default.preview', '@preview');
const cardiganTheme = mandelbrot({
    skin: "navy"
});

fractal.web.theme(cardiganTheme);

export default fractal;
