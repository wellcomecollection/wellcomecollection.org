// only what is required to render ArticlePromos and json-ld
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { MediaObjectType } from './media-object';
import { EmbedField, RichTextField } from '@prismicio/types';

export type ExhibitionGuideComponent = {
  // number: number;
  // title: string;
  // tombstone?: RichTextField;
  // image?: ImageType;
  // description?: string;
  // audioWithDescription?: MediaObjectType;
  // audioWithoutDescription?: MediaObjectType;
  // bsl?: MediaObjectType;
  // caption?: RichTextField;
  // transcript?: RichTextField;
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

// type Stop = {
//   number: number;
//   title: string;
//   image?: ImageType;
//   tombstone: prismicT.RichTextField;
//   caption: prismicT.RichTextField;
//   transcription?: prismicT.RichTextField;
//   description?: string;
//   audioWithDescription?: MediaObjectType;
//   audioWithoutDescription?: MediaObjectType;
//   bsl?: MediaObjectType;
// };

export type ExhibitionGuideFormat = string | number;

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
  components: ExhibitionGuideComponent;
};
