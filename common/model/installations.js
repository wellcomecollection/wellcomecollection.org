// @flow
import type {HTMLString} from '../services/prismic/types';
import type {Place} from './place';
import type {Contributor} from './contributors';
import type {Picture} from './picture';

export type Installation = {|
  id: string,
  title: string,
  description: HTMLString,
  contributors: Contributor[],
  start: Date,
  end: ?Date,
  place: ?Place
|};

export type UiInstallation = {| ...Installation, ...{|
  featuredImageList: Picture[],
  body: any[]
|}|}
