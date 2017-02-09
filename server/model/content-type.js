// @flow
export type ContentType = 
  | "article"; // at the moment article is all we have

export function createType(data: ContentType) {
  return (data: ContentType);
}
