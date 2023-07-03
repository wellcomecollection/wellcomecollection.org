import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';
import { Format } from './format';
import { SiteSection } from '@weco/common/views/components/PageLayout/PageLayout';

export type Guide = GenericContentFields & {
  type: 'guides';
  format?: Format;
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: SiteSection;
  showOnThisPage: boolean;
};
