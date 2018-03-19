import type {HTMLString} from '../services/prismic/types';
import {Contributor} from './contributors';

export type Installation = {|
  id: string,
  title: string,
  description: HTMLString,
  contributors: Contributor[]
|};
