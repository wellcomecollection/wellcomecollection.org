// @flow
export const striptags = (str: string) => str.replace(/(<([^>]+)>)/ig, '');
