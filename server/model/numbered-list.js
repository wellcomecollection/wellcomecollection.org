// @flow
import { type Picture } from './picture';
import { type Promo } from './promo';

export type NumberedList = {|
  name?: ?string;
  image?: ?Picture;
  items: Array<{
    title: string,
    url?: ?string,
    date: Date
  } | Promo>;
|}

export function createNumberedList(data: NumberedList) { return (data: NumberedList); }
