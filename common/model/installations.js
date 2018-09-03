// @flow
import type {GenericContentFields} from './generic-content-fields';
import type {HTMLString} from '../services/prismic/types';
import type {Place} from './places';

export type Installation = {|
  ...GenericContentFields,
  type: 'installations',
  description: HTMLString,
  start: Date,
  end: ?Date,
  place: ?Place
|};

export type UiInstallation = Installation;
