// @flow
import { type Picture } from './picture';

export type NumberedList = {|
  url?: ?string;
  name?: ?string;
  image?: ?Picture;
  items: Array<{
    title: string,
    url?: ?string,
    date: Date
  }>;
|}

export function createNumberedList(data: NumberedList) { return (data: NumberedList); }
