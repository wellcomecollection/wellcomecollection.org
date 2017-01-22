const printUpTo = (max) => {
  let num = '';

  for (let i = 1; i <= max; i++) {
    num += i;
  }

  return num;
};

/**
 * Outputs grid__cell class modifiers.
 * @param {Object} colsAtSizes - key:value pairs of breakpoints:columns.
 * @param {boolean} omitGridCell - whether to omit base 'grid__cell' class.
 */

export default function grid(colsAtSizes, omitGridCell) {
  let retString = omitGridCell ? '' : 'grid__cell';

  for (let key in colsAtSizes) {
    let size = key;

    if (key.includes('Shift')) {
      const shiftIndex = key.indexOf('Shift');
      size = `shift-${key.substr(0, shiftIndex)}`;
    }

    retString += ` grid__cell--${size}${printUpTo(colsAtSizes[key])}`;
  }

  return retString;
}
