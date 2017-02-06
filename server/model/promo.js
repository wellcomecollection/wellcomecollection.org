// @flow
export type Promo = {|
  modifiers: Array<string>;
  article: null; // TODO: make type for Article?
  copy?: string;
  url: string;
  meta?: {
    type?: string,
    date?: string,
    length?: string
  };
|}

export function createPromo(data: Promo) { return (data: Promo); }
