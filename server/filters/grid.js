export default function grid(colsAtSizes, omitGridCell) {
  let retString = omitGridCell ? '' : 'grid__cell';

  for (let key in colsAtSizes) {
    let size = key;

    if (key.includes('Shift')) {
      const shiftIndex = key.indexOf('Shift');
      size = `shift-${key.substr(0, shiftIndex)}`;
    }

    retString += ` grid__cell--${size}${colsAtSizes[key]}`;
  }

  return retString;
}
