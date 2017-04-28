import path from 'path';
import fs from 'fs';

const iconsPath = path.join(__dirname, '../icons');

function walk(dir) {
  const list = fs.readdirSync(dir);
  let results = [];

  list.forEach(function(item) {
    const dirOrFile = path.join(dir, '/', item);
    const stat = fs.statSync(dirOrFile);

    if (stat && stat.isDirectory()) {
      results = results.concat(walk(dirOrFile));
    } else {
      if (path.extname(dirOrFile) === '.svg') {
        const item = {
          extraClasses: ['icon--fill'],
          icon: path.join(path.basename(dir), path.basename(dirOrFile, '.svg'))
        };

        results.push(item);
      }
    }
  });

  return results;
}

const icons = walk(iconsPath);

export const context = { icons };
