// @flow
import type {Picture} from './picture';

type formats = 'Permanent';

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
