// @flow
import type { ImageType } from './image';
import type { SameAs } from './same-as';
import type {HTMLString} from '../services/prismic/types';

export type Person = {|
  id: string;
  name: string,
  twitterHandle: ?string,
  description: ?HTMLString,
  image: ImageType,
  sameAs: SameAs
|}
