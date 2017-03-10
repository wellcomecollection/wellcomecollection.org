// @flow
export type NumberedList = {|
  name: string;
  items: Array<{
    title: string,
    url: string,
    date: Date
  }>;
|}

export function createNumberedList(data: NumberedList) { return (data: NumberedList); }
