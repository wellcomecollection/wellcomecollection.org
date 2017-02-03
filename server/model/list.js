export type List = {
  name?: string; // TODO: this probably shouldn't be optional
  items: Array<any>;
}

export function createList(data: List) {
  return (data: List);
}
