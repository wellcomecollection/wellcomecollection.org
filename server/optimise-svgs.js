const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const fs =  require('fs');
const root = path.resolve('./views/icons');
const SVGO = require('svgo');
const svgo = new SVGO({
  plugins: [
    { removeXMLNS: true },
    { removeUselessStrokeAndFill: true },
    { removeStyleElement: true },
    { removeUselessDefs: true }
  ]
});
// TODO: Promisify (pify)
glob(`${root}/**/*.svg`, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err;

      mkdirp(path.dirname(file), () => {
        svgo.optimize(data, {path: file}).then(result => {
          fs.writeFile(file, result.data, (err) => {
            if (err) throw err;
            else console.info(file);
          });
        });
      });
    });
  });
});
