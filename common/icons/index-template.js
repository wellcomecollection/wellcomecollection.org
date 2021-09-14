const path = require('path');

function indexTemplate(filePaths) {
  return filePaths
    .map(filePath => {
      const { name } = path.parse(filePath);
      const iconName = name.charAt(0).toLowerCase() + name.slice(1);

      // The path here is "wrong" because we want to move the index file up a dir
      return `export { default as ${iconName} } from './components/${name}';`;
    })
    .join('\n');
}

module.exports = indexTemplate;
