// @flow
import type { Image as ImageProps } from './image';
import type { SameAs } from './same-as';
import type {HTMLString} from '../services/prismic/types';

export type Person = {|
  id: string;
  name: string,
  twitterHandle: ?string,
  description: ?HTMLString,
  image: ImageProps,
  sameAs: SameAs
|}
