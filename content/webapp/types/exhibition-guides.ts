// only what is required to render ArticlePromos and json-ld
import { Label } from '@weco/common/model/labels';
import { GuideComponent } from './exhibition-guide-component';
import { ImagePromo } from './image-promo';

export type ExhibitionLink = {
  id: string;
  title: string;
  description?: string;
};

export type ExhibitionGuideBasic = {
  type: 'exhibition-guides';
  id: string;
  title: string;
  labels: Label[];
  promo?: ImagePromo | undefined;
  relatedExhibition: ExhibitionLink;
};

export type ExhibitionGuide = {
  type: 'exhibition-guides';
  id: string;
  title: string;
  relatedExhibition: ExhibitionLink;
  guideComponents: GuideComponent[];
};
