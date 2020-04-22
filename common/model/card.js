// @flow
import { type ImageType } from '@weco/common/model/image';
import { type Format } from '@weco/common/model/format';

export type Card = {|
  type: 'card',
  format: ?Format,
  title: ?string,
  description: ?string,
  image: ?ImageType,
  link: ?string,
|};
