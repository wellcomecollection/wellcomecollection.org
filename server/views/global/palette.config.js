import path from 'path';
import fs from 'fs';

const variablesPath = path.join(__dirname, '../../../client/scss/utilities/_variables.scss');
const variablesFile = fs.readFileSync(variablesPath, {encoding: 'utf-8'});
const colorsRegex = new RegExp(/\$colors: \(([\s\S]*?)\);/, 'g');
const colors = variablesFile.match(colorsRegex);

console.log(colors);

export const context = {

}
