// @flow
export const truncate = (str: string, length = 255, symbol = '…'): string => {
  if (str.length <= length) {
    return str;
  } else {
    return `${str.slice(0, length)}${symbol}`;
  }
};
