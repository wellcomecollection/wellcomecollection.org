import fs from 'fs';

const modelName = process.argv[2];
const model = require(`./js/${modelName}`).default;

fs.writeFile(
  `./json/${modelName}.json`,
  JSON.stringify(model, null, 2),
  (err) => { if (err) throw err; }
);
