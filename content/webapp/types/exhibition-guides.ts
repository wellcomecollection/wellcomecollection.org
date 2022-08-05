import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { RichTextField } from '@prismicio/types';
import { Link } from './link';

export type ExhibitionLink = {
  id: string;
  title: string;
  description?: string;
  promo?: ImagePromo;
};

export type ExhibitionGuideComponent = {
  number: number;
  title: string;
  image?: ImageType;
  tombstone: RichTextField;
  caption: RichTextField;
  transcription: RichTextField;
  description?: string;
  audioWithDescription?: Link;
  audioWithoutDescription?: Link;
  bsl: {
    embedUrl?: string;
  };
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
  image?: ImageType;
  promo?: ImagePromo;
  relatedExhibition: Exhibit | undefined;
};

export type ExhibitionGuide = ExhibitionGuideBasic & {
  components: ExhibitionGuideComponent[];
};
