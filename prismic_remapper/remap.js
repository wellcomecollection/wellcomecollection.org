const fs = require('mz/fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const name = process.argv[2];
const showIds = process.argv[3] && process.argv[3] === '--log-ids';

// TODO: nicer errors?
const {filter = () => true, map} = require(`./${name}/remap`);
async function go() {
  const files = await fs.readdir('./.dist');
  const dataPromises = files.filter(filename => filename.endsWith('.json')).map(async filename => {
    return fs.readFile(`./.dist/${filename}`).then(fileContent => {
      const doc = JSON.parse(fileContent);
      return {filename, doc};
    });
  });

  await new Promise((resolve, reject) => mkdirp(`./${name}/premapped`, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  }));

  const data = await Promise.all(dataPromises);
  // we clone here to avoid mutating the original object
  const filteredData = data.map(({filename, doc}) => ({
    doc: Object.assign({}, doc),
    filename: filename
  })).filter(filter);

  filteredData.forEach(({filename, doc}, i) => {
    fs.writeFileSync(`./${name}/premapped/${filename}`, JSON.stringify(doc, null, 2));
  });

  const newData = filteredData.map(map);

  await new Promise((resolve, reject) => {
    rimraf('./.dist/remapped', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  await new Promise((resolve, reject) => mkdirp('./.dist/remapped', (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  }));

  if (newData.length > 0) {
    newData.forEach(({filename, doc}, i) => {
      fs.writeFile(`./.dist/remapped/${filename}`, JSON.stringify(doc, null, 2));
    });

    // Write the example before and after files
    const after = newData[0];
    const before = data.find(doc => doc.filename === after.filename);

    fs.writeFile(`./${name}/before.json`, JSON.stringify(before.doc, null, 2));
    fs.writeFile(`./${name}/after.json`, JSON.stringify(after.doc, null, 2));
  }

  console.info(`Remapped ${newData.length} documents`);
  if (showIds) {
    newData.forEach(({filename}) => console.info(`${filename.split('$')[0]}`));
  }
}

go();
