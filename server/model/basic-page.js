// @flow
import type {BodyPart} from './body-part';
import type {Picture} from './picture';

export type BasicPage = {|
  headline: string;
  datePublished: Date;
  description: string;
  thumbnail?: ?Picture;
  bodyParts: Array<BodyPart>;
|}
