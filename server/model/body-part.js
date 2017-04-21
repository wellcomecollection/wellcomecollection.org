// @flow
import type {Weight} from './weight';

export type BodyPart = {|
  weight: Weight;
  type: string;
  value: any; // TODO: Make this not `any`
|}
export function createBodyPart(data: BodyPart) { return (data: BodyPart); }
