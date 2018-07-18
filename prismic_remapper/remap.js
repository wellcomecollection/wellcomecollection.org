const fs = require('mz/fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const name = process.argv[2];

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

  const data = await Promise.all(dataPromises);
  // we clone here to avoid mutating the original object
  const newData = data.map(({filename, doc}) => ({
    doc: Object.assign({}, doc),
    filename: filename
  })).filter(filter).map(map);

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

  newData.forEach(({filename, doc}, i) => {
    fs.writeFile(`./.dist/remapped/${filename}`, JSON.stringify(doc, null, 2));
  });

  // Write the example before and after files
  const after = newData[0];
  const before = data.find(doc => { if (doc.filename === after.filename) { console.info(doc.doc.body); } return doc.filename === after.filename; });
  data.forEach(d => { if (d.filename.startsWith('W0dMzyYAACYAZuDf')) { console.info(d.doc.body); } });

  fs.writeFile(`./${name}/before.json`, JSON.stringify(before.doc, null, 2));
  fs.writeFile(`./${name}/after.json`, JSON.stringify(after.doc, null, 2));
}

go();
