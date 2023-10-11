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
    type: 'exhibitions'; // TODO add 'events' as an option when doing https://github.com/wellcomecollection/wellcomecollection.org/issues/10308
  };
  siteSection?: SiteSection;
  showOnThisPage: boolean;
};
