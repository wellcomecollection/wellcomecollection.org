const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'components'), (err, data) => {
  if (err) throw err;

  const fileInfo = data.map(fileName => {
    const fileWithoutExtension = fileName.slice(0, -3);
    const iconName =
      fileWithoutExtension.charAt(0).toLowerCase() +
      fileWithoutExtension.slice(1);

    return {
      fileWithoutExtension,
      iconName,
    };
  });

  const importData = fileInfo
    .map(f => {
      return `import ${f.iconName} from './components/${
        f.fileWithoutExtension
      }'`;
    })
    .join(';\n');

  const exportData = `export {\n  ${fileInfo
    .map(f => f.iconName)
    .join(',\n  ')},\n};\n`;

  const file = `${importData};\n\n${exportData}`;

  fs.writeFile(path.join(__dirname, 'index.js'), file, err => {
    if (err) throw err;
  });
});
