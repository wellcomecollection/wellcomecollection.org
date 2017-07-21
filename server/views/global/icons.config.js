import path from 'path';
import fs from 'fs';

export const status = 'graduated';

const iconsPath = path.join(__dirname, '../icons');

function walk(dir) {
  const list = fs.readdirSync(dir);

  return list.reduce((acc, curr) => {
    const dirOrFile = path.join(dir, '/', curr);
    const stat = fs.statSync(dirOrFile);

    if (stat && stat.isDirectory()) {
      return acc.concat(walk(dirOrFile));
    } else if (path.extname(dirOrFile) === '.svg') {
      return acc.concat({
        extraClasses: ['icon--fill', 'icon--4x'],
        icon: path.join(path.basename(dir), path.basename(dirOrFile, '.svg'))
      });
    }

    return acc;
  }, []);
}

const icons = walk(iconsPath);

export const context = { icons };
