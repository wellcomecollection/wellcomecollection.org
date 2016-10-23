'use strict';

/* Create a new Fractal instance and export it for use elsewhere if required */
const fractal = module.exports = require('@frctl/fractal').create();

/* Set the title of the project */
fractal.set('project.title', 'Cardigan');

/* Tell Fractal where the components will live */
fractal.components.set('path', __dirname + '/views');

/* Tell Fractal where the documentation pages will live */
fractal.docs.set('path', __dirname + '/views/docs');

/* Specify a directory of static assets */
fractal.web.set('static.path', __dirname + './../dist');

/* Set the static HTML build path */
fractal.web.set('builder.dest', './../cardigan');

/* Add paths for component templates */
const nunj = require('@frctl/nunjucks')({
    //paths: ['views/components/grid-placeholder/']
});

/* Use Nunjucks for component templates */
fractal.components.engine(nunj);

/* Set view templates file extension */
fractal.components.set('ext', '.njk');

/* Set preview template for components */
fractal.components.set('default.preview', '@preview');

const mandelbrot = require('@frctl/mandelbrot'); // require the Mandelbrot theme module

// create a new instance with custom config options
const myCustomisedTheme = mandelbrot({
    skin: "navy"
    // any other theme configuration values here
});

fractal.web.theme(myCustomisedTheme); // tell Fractal to use the configured theme by default
