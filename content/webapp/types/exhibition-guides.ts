import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { MediaObjectType } from './media-object';
import { EmbedField, RichTextField } from '@prismicio/types';
import { GenericContentFields } from './generic-content-fields';

export type ExhibitionGuideComponent = {
  number: number;
  title: string;
  image?: ImageType;
  tombstone: RichTextField;
  caption: RichTextField;
  transcription: RichTextField;
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
  id: string;
  title: string;
  description: string;
  exhibitType: 'exhibitions';
  item: ExhibitionLink | undefined;
};

export type ExhibitionGuideBasic = {
  type: 'exhibition-guides';
  id: string;
  title: string;
  promo?: ImagePromo;
  image?: ImageType;
  relatedExhibition: Exhibit | undefined;
  components: ExhibitionGuideComponent[];
};

export type ExhibitionGuide = GenericContentFields & {
  type: 'exhibition-guides';
  id: string;
  title: string;
  image?: ImageType;
  promo?: ImagePromo;
  relatedExhibition: Exhibit | undefined;
  components: ExhibitionGuideComponent[];
};
