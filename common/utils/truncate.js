// @flow
export const truncate = (str, length = 255, symbol = '…') => {
  if (str.length <= length) {
    return str;
  } else {
    return `${str.slice(0, length)}${symbol}`;
  }
};
