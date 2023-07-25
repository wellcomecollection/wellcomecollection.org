import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';
import { SiteSection } from '@weco/common/views/components/PageLayout/PageLayout';

export type VisualStory = GenericContentFields & {
  type: 'visual-stories';
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: SiteSection;
  showOnThisPage: boolean;
};
