// only what is required to render ArticlePromos and json-ld
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { MediaObjectType } from './media-object';

export type ExhibitionGuideComponent = {
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

export type ExhibitionLink = {
  id: string;
  title: string;
  description?: string;
};

export type ExhibitionGuideBasic = {
  type: 'exhibition-guides';
  id: string;
  title: string | undefined;
  promo?: ImagePromo | undefined;
  image?: ImageType;
  relatedExhibition: ExhibitionLink | undefined;
};

export type ExhibitionGuide = {
  type: 'exhibition-guides';
  id: string;
  title: string | undefined;
  relatedExhibition: ExhibitionLink | undefined;
  components: ExhibitionGuideComponent[];
};
