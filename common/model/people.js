// @flow
import type { Picture } from './picture';
import type {HTMLString} from '../services/prismic/types';

export type Person = {|
  id: string;
  name: string,
  twitterHandle: ?string,
  description: ?HTMLString,
  image: Picture
|}
