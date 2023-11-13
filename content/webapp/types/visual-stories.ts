import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';
import { Contributor } from './contributors';
import { SiteSection } from '@weco/common/views/components/PageLayout/PageLayout';

export type VisualStory = GenericContentFields & {
  type: 'visual-stories';
  onThisPage: Link[];
  contributors: Contributor[];
  datePublished?: Date;
  relatedDocument?: {
    title?: string;
    id: string;
    type: 'exhibitions' | 'events';
  };
  siteSection?: SiteSection;
  showOnThisPage: boolean;
};
