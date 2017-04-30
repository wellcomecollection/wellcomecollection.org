import path from 'path';
import fs from 'fs';

function getColors() {
  return new Promise((resolve, reject) => {
    const variablesPath = path.join(__dirname, '../../../client/scss/utilities/_variables.scss');
    fs.readFile(variablesPath, {encoding: 'utf-8'}, (err, data) => {
      if (err) reject(err);

      const colorsRegex = new RegExp(/\$colors: \(([\s\S]*?)\);/);
      const colors = data
        .match(colorsRegex)[1]
        .split('),')
        .slice(0, -1)
        .map((item) => {
          const inner = item.split(':');
          const right = inner[1]
            .slice(2, -1)
            .split(',');

          return {
            name: inner[0].trim().slice(1, -1),
            hex: right[0],
            attribution: right[1].trim().slice(1)
          };
        });

      resolve(colors);
    });
  });
}

const nonColors = ['currentColor', 'transparent', 'inherit'];

export const context = {
  primary: getColors().then(colors => colors.filter(color => color.attribution === 'primary')),
  secondary: getColors().then(colors => colors.filter((color) => {
    if (nonColors.indexOf(color.name) > -1) return;

    return color.attribution === 'secondary';
  }))
};
