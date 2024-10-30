import { SiteSection } from '@weco/common/model/site-section';

import { Format } from './format';
import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';

export type Guide = GenericContentFields & {
  type: 'guides';
  uid: string;
  format?: Format;
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: SiteSection;
  showOnThisPage: boolean;
};
