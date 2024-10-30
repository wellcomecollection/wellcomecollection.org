import { ImageType } from '@weco/common/model/image';
import { SiteSection } from '@weco/common/model/site-section';
import { ImagePromo } from '@weco/content/types/image-promo';

import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';

export type VisualStory = GenericContentFields & {
  type: 'visual-stories';
  uid: string;
  onThisPage: Link[];
  datePublished?: Date;
  relatedDocument?: {
    title?: string;
    id: string;
    uid?: string;
    type: 'exhibitions' | 'events';
  };
  siteSection?: SiteSection;
  showOnThisPage: boolean;
};

export type VisualStoryBasic = {
  type: 'visual-stories';
  id: string;
  uid: string;
  title: string;
  promo?: ImagePromo | undefined;
  image?: ImageType | undefined;
  relatedDocument?: {
    title?: string;
    id: string;
    uid?: string;
    type: 'exhibitions' | 'events';
  };
};
