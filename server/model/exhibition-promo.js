// @flow
import type {Picture} from './picture';

type formats = 'permanent';

export type ExhibitionPromo = {|
  id: string;
  format: ?formats;
  url: string;
  title: string;
  image: Picture;
  description: ?string;
  start: string;
  end: ?string;
  statusOverride: ?string
|}
