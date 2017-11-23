const fs = require('fs');
const chokidar = require('chokidar');
const mkdirp = require('mkdirp');
const dirname = require('path').dirname;
const watcher = chokidar.watch(['**/*.js', '**/*.njk', '**/*.json'], {
  persistent: true,
  ignoreInitial: true,
  ignored: ['.dist']
});
const babel = require('babel-core');

function distPath(path) {
  return `./.dist/${path}`;
}

function compileOrCopy(path) {
  console.info(dirname(distPath(path)));
  mkdirp.sync(dirname(distPath(path)));
  if (path.endsWith('.js')) {
    babel.transformFile(path, {}, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        fs.writeFile(distPath(path), result.code, (err) => {
          if (err) console.error(err);
          else console.info(`${path} compiled and copied`);
        });
      }
    });
  } else {
    // TODO: errors?
    fs.createReadStream(path).pipe(fs.createWriteStream(distPath(path)));
    console.info(`${path} copied across, hopefully`);
  }
}

mkdirp('./.dist');
watcher.on('add', compileOrCopy);
watcher.on('change', compileOrCopy);
watcher.on('unlink', (path) => {
  console.info(path)
});
