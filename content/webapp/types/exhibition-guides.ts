// only what is required to render ArticlePromos and json-ld
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { MediaObjectType } from './media-object';
import { EmbedField, RichTextField } from '@prismicio/types';

export type ExhibitionGuideComponent = {
  number: number;
  title: string;
  image?: ImageType;
  tombstone: RichTextField;
  caption: RichTextField;
  transcription?: RichTextField;
  description?: string;
  audioWithDescription?: MediaObjectType;
  audioWithoutDescription?: MediaObjectType;
  bsl?: EmbedField;
};

export type ExhibitionLink = {
  id: string;
  title: string;
  description?: string;
  promo?: ImagePromo;
};

export type Exhibit = {
  description: string;
  exhibitType: 'exhibitions';
  item: ExhibitionLink[] | undefined;
};

export type ExhibitionGuideBasic = {
  type: 'exhibition-guides';
  id: string;
  title: string | undefined;
  promo?: ImagePromo | undefined;
  image?: ImageType;
  relatedExhibition: Exhibit;
  components: ExhibitionGuideComponent;
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
  relatedExhibition: Exhibit;
  components: ExhibitionGuideComponent;
  start?: string;
  isPermanent?: string;
  contributors?: string;
  labels?: string;
};
