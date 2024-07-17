const path = require('path');

function indexTemplate(filePaths) {
  const iconExports = filePaths
    .map(({ path: filePath }) => {
      const { name } = path.parse(filePath);
      const iconName = name.charAt(0).toLowerCase() + name.slice(1);

      // The path here is "wrong" because we want to move the index file up a dir
      return `export { default as ${iconName} } from './components/${name}';`;
    })
    .join('\n');

  return iconExports + `\n\nexport type { IconSvg } from './types';\n`;
}

module.exports = indexTemplate;
