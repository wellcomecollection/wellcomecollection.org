const printUpTo = (max) => {
  let num = '';

  for (let i = 1; i <= max; i++) {
    num += i;
  }

  return num;
};

export default function grid(colsAtSizes, omitGridCell) {
  let retString = omitGridCell ? '' : 'grid__cell';

  for (let key in colsAtSizes) {
    retString += ` grid__cell--${key}${printUpTo(colsAtSizes[key])}`;
  }

  return retString;
}
