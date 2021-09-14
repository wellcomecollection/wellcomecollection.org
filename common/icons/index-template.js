const path = require('path');

function indexTemplate(filePaths) {
  return filePaths
    .map(filePath => {
      const { name } = path.parse(filePath);
      const iconName = name.charAt(0).toLowerCase() + name.slice(1);

      return `export { default as ${iconName} } from './${name}';`;
    })
    .join('\n');
}

module.exports = indexTemplate;
