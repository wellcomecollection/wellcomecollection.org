import { ImageType } from '@weco/common/model/image';
import { MediaObjectType } from './media-object';

export type GuideComponent = {
  type: 'exhibition-guides';
  number: number;
  title: string;
  tombstone?: string;
  image?: ImageType;
  description?: string;
  audioWithDescription?: MediaObjectType;
  audioWithoutDescription?: MediaObjectType;
  bsl?: MediaObjectType;
  caption?: string;
  transcript?: string;
};
