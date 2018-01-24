// @flow
import type {Picture} from './picture';
import type {ExhibitionFormat} from '../content-model/exhibition';

export type ExhibitionPromo = {|
  id: string,
  url: string,
  title: string,
  image: Picture,
  description: ?string,
  start: string,
  end: ?string,
  format: ?ExhibitionFormat
|}
