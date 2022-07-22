// only what is required to render ArticlePromos and json-ld
import { Label } from '@weco/common/model/labels';
import { ImageType } from '@weco/common/model/image';

export type ExhibitionGuideFormat = {
  number: number;
  title: string;
  tombstone: string;
  image?: ImageType;
  description: string;
  audioWithDescription?: string;
  audioWithoutDescription?: string;
  bsl?: string;
  caption?: string;
  transcript?: string;
};

export type ExhibitionGuideBasic = {
  type: 'exhibition-guides';
  id: string;
  title: string;
  labels: Label[];
  image?: ImageType;
  format: ExhibitionGuideFormat;
};

export type ExhibitionGuide = {
  type: 'exhibition-guides';
};
