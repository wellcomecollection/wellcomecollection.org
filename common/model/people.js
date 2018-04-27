// @flow
import type { Picture } from './picture';

export type Person = {|
  id: string;
  name: string,
  twitterHandle: ?string,
  description: ?string,
  image: Picture
|}
