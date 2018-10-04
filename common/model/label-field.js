// @flow
import type {HTMLString} from '../services/prismic/types';
import type {ContentFormatId} from './content-format-id';

export type LabelField = {|
  id?: ?ContentFormatId,
  title: ?string,
  description: ?HTMLString
|}
