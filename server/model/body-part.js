// @flow
type BodyPart = {|
  weight: string;
  type: string;
  value: any; // TODO: Make this not `any`
|}
export function createBodyPart(data: BodyPart) { return (data: BodyPart); }
