// only what is required to render ArticlePromos and json-ld
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { MediaObjectType } from './media-object';
import { EmbedField } from '@prismicio/types';

export type ExhibitionGuideComponent = {
  number: number;
  title: string;
  tombstone?: string;
  image?: ImageType;
  description?: string;
  audioWithDescription?: MediaObjectType;
  audioWithoutDescription?: MediaObjectType;
  bsl?: EmbedField;
  caption?: string;
  transcript?: string;
};

export type ExhibitionLink = {
  id: string;
  title: string;
  description?: string;
  promo?: ImagePromo;
};

export type Exhibit = {
  exhibitType: 'exhibitions';
  item: ExhibitionLink[] | undefined;
};

export type ExhibitionGuideBasic = {
  type: 'exhibition-guides';
  id: string;
  title: string | undefined;
  promo?: ImagePromo | undefined;
  image?: ImageType;
  relatedExhibition: Exhibit[] | undefined;
  start: string;
  isPermanent: string;
  contributors: string;
  labels: string;
};

export type ExhibitionGuide = {
  type: 'exhibition-guides';
  id: string;
  title: string | undefined;
  image?: ImageType;
  promo?: ImagePromo | undefined;
  relatedExhibition: ExhibitionLink | undefined;
  components: ExhibitionGuideComponent[];
};
