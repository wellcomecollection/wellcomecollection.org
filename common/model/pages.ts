import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';

export type Page = GenericContentFields & {
  type: 'pages';
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: string;
  drupalPromoImage?: string;
  drupalNid?: string;
  drupalPath?: string;
  showOnThisPage: boolean;
};
