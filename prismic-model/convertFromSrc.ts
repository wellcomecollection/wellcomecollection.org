/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';

const modelName = process.argv[2];

if (modelName) {
  const model = require(`./js/${modelName}`).default;
  fs.writeFile(
    `./json/${modelName}.json`,
    JSON.stringify(model, null, 2),
    err => {
      if (err) throw err;
    }
  );
} else {
  fs.readdir('./src', (err, files) => {
    if (err) throw err;
    files.forEach(filename => {
      if (filename.endsWith('.ts')) {
        const modelName = filename.replace('.ts', '');
        const model = require(`./src/${modelName}`).default;
        fs.writeFile(
          `./json/${modelName}.json`,
          JSON.stringify(model, null, 2),
          err => {
            if (err) throw err;
          }
        );
      }
    });
  });
}
