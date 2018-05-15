// @flow
import type {Picture} from './picture';

export type ExhibitionPromo = {|
  format: 'Permanent' | 'Temporary',
  id: string;
  url: string;
  title: string;
  image: Picture;
  description: ?string;
  start: string;
  end: ?string;
  statusOverride: ?string
|}
