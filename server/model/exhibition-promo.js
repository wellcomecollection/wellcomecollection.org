// @flow
import type {Picture} from './picture';

export type ExhibitionPromo = {|
  id: string;
  url: string;
  title: string;
  image: Picture;
  description: ?string;
  start: string;
  end: ?string;
|}
