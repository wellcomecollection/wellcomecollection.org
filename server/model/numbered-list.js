import { type Picture } from './picture';

// @flow
export type NumberedList = {|
  name: string;
  image?: ?Picture;
  items: Array<{
    title: string,
    url: string,
    date: Date
  }>;
|}

export function createNumberedList(data: NumberedList) { return (data: NumberedList); }
