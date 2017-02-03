// @flow
export type NumberedList = {|
  name: string;
  items: Array<{
    title: string,
    url: string,
    meta: string
  }>;
|}

export function createNumberedList(data: NumberedList) { return (data: NumberedList); }
