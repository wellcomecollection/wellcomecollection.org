const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const outputFilePath = path.join(__dirname, 'index.ts');

const files = fs.readdirSync(componentsDir);
const filesInfo = files
  .map(file => {
    try {
      const { name } = path.parse(file);
      return {
        fileWithoutExtension: name,
        iconName: name.charAt(0).toLowerCase() + name.slice(1),
      };
    } catch (e) {
      // Do nothing
    }
  })
  .filter(Boolean);

const imports = filesInfo.map(
  ({ iconName, fileWithoutExtension }) =>
    `import ${iconName} from './components/${fileWithoutExtension}'`
);

const outFile = `${imports.join(';\n')};

export {
  ${filesInfo.map(({ iconName }) => iconName).join(',\n  ')},
};
`;
fs.writeFileSync(outputFilePath, outFile);
