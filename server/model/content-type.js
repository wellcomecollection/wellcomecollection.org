// @flow
export type contentType = 
  | "article"; // at the moment article is all we have

export function createType(data: contentType) {
  return (data: contentType);
}
