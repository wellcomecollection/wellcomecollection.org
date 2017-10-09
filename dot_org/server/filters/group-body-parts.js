import {List} from 'immutable';

export function groupBodyParts(bodyParts) {
  // Here be mutants...
  let currentGroupKey = 0;
  const grouped = List(bodyParts).groupBy((part, key) => {
    if (part.weight === 'supporting' || part.weight === 'standalone') {
      currentGroupKey = key;
    }

    return currentGroupKey;
  });

  // Nunjucks is beginning to get sad...
  const groupedJS = grouped.map(group => group.toJS()).toJS();
  return Object.keys(groupedJS).map(key => groupedJS[key]);
}
