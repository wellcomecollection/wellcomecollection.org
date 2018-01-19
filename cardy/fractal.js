const path = require('path');
const Fractal = require('@frctl/fractal');
const mandelbrot = require('@frctl/mandelbrot');
const statuses = require('./config/statuses');
const fractal = Fractal.create();

fractal.set('project.title', 'New cardy!');
fractal.components.set('path', path.join(__dirname, '../common/views'));

var reactAdapter = require('fractal-react-adapter')({
  babelConfig: {
    extensions: ['.js']
  }
});
fractal.components.engine(reactAdapter);
fractal.components.set('ext', '.js');
fractal.components.set('statuses', statuses);
fractal.components.set('default.status', 'wip');
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

function dir(relPath) {
  return path.resolve(`${__dirname}${relPath}`);
}

function serverDir(relPath) {
  return dir(`./../server/${relPath}`);
}

module.exports = fractal;
