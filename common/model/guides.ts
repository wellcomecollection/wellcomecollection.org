import type { GenericContentFields } from './generic-content-fields';
import type { Link } from './link';
import { Format } from './format';

export type Guide = GenericContentFields & {
  type: 'guides';
  format?: Format;
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: string;
  showOnThisPage: boolean;
};
