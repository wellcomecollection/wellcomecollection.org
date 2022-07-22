// only what is required to render ArticlePromos and json-ld
import { Label } from '@weco/common/model/labels';
import { ImageType } from '@weco/common/model/image';
import { GuideComponent } from './exhibition-guide-component';
import { ImagePromo } from './image-promo';

export type ExhibitionGuideBasic = {
  type: 'exhibition-guides';
  id: string;
  title: string;
  labels: Label[];
  image?: ImageType;
  promo?: ImagePromo | undefined;
};

export type ExhibitionGuide = {
  type: 'exhibition-guides';
  id: string;
  title: string;
  image?: ImageType;
  guideComponents: GuideComponent[];
};
