import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';
import { Season } from './seasons';

export type Page = GenericContentFields & {
  type: 'pages';
  seasons: Season[];
  landingPages: Page[];
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: string;
  drupalPromoImage?: string;
  drupalNid?: string;
  drupalPath?: string;
  showOnThisPage: boolean;
};
