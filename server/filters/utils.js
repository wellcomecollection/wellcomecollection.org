import { default as gridConfig } from 'wellcomecollection-config/grid-config';

export function getSizesAsObject(sizes) {
  const gridConfigKeys = Object.keys(gridConfig);

  if (typeof sizes === 'object') {
    const sizesKeys = Object.keys(sizes);
    const sizesLength = sizesKeys.length;
    const lastKey = sizesKeys[sizesLength - 1];
    const lastValue = sizes[lastKey];
    const remainingKeys = gridConfigKeys
      .filter((key, index) => index >= sizesLength)
      .map((key) => {
        return {
          key: key,
          value: lastValue
        };
      })
      .reduce((acc, curr) => {
        return Object.assign(acc, {[curr.key]: curr.value});
      }, {});

    return Object.assign({}, sizes, remainingKeys);
  } else {
    return gridConfigKeys.map((key) => {
      return {
        key: key,
        value: sizes
      };
    }).reduce((acc, curr) => {
      return Object.assign(acc, {[curr.key]: curr.value});
    }, {});
  }
}
