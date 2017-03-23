import { type Picture } from './picture';

// @flow
import type Picture from './picture';

export type NumberedList = {|
  name: string;
  image?: Picture;
  image?: ?Picture;
  items: Array<{
    title: string,
    url: string,
    date: Date
  }>;
|}

export function createNumberedList(data: NumberedList) { return (data: NumberedList); }
