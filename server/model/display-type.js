// @flow
export type DisplayType = 
  | "lead"
  | "regular";

export function createType(data: DisplayType) {
  return (data: DisplayType);
}
