import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';
import { Season } from './seasons';
import { Format } from './format';

export type ParentPage = Page & {
  order: number;
};

export type Page = GenericContentFields & {
  type: 'pages';
  format: Format | undefined;
  seasons: Season[];
  parentPages: ParentPage[];
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: string;
  drupalPromoImage?: string;
  drupalNid?: string;
  drupalPath?: string;
  showOnThisPage: boolean;
};
