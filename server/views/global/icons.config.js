import path from 'path';
import fs from 'fs';

export const status = 'graduated';

const iconsPath = path.join(__dirname, '../icons');

function walk(dir) {
  const list = fs.readdirSync(dir);

  return list
    .filter(filename => filename.endsWith('.svg'))
    .map(filename => ({ icon: filename.replace('.svg', '') }));
}

const icons = walk(iconsPath);

export const context = { icons };
