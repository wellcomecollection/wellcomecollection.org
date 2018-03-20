// @flow
export const truncate = (str: string, length: number = 255, symbol: string = '…'): string => {
  if (str.length <= length) {
    return str;
  } else {
    return `${str.slice(0, length)}${symbol}`;
  }
};
