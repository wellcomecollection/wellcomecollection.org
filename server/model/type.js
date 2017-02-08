// @flow
export type Type = 
  | "article"; // at the moment article is all we have

export function createType(data: Type) {
  return (data: Type);
}
