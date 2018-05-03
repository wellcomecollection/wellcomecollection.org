import fs from 'fs';

const modelName = process.argv[2];

if (modelName) {
  const model = require(`./js/${modelName}`).default;
  fs.writeFile(
    `./json/${modelName}.json`,
    JSON.stringify(model, null, 2),
    (err) => { if (err) throw err; }
  );
} else {
  fs.readdir('./js', (err, files) => {
    if (err) throw err;
    files.forEach(filename => {
      if (filename.endsWith('.js')) {
        const modelName = filename.replace('.js', '');
        const model = require(`./js/${modelName}`).default;
        fs.writeFile(
          `./json/${modelName}.json`,
          JSON.stringify(model, null, 2),
          (err) => { if (err) throw err; }
        );
      }
    });
  });
}
