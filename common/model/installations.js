import type {HTMLString} from '../services/prismic/types';
import type {Place} from './place';
import {Contributor} from './contributors';

export type Installation = {|
  id: string,
  title: string,
  description: HTMLString,
  contributors: Contributor[],
  start: Date,
  end: ?Date,
  place: ?Place
|};
