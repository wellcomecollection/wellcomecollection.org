// @flow
import type { GenericContentFields } from './generic-content-fields';
import type { Link } from './link';
import type { Season } from './seasons';
import { Format } from './format';
import type { Exhibition } from './exhibitions';

export type ParentPage = {
  ...Page,
  order: number,
};

// type ParentContent = ParentPage | Exhibition;
export type Page = {|
  type: 'pages',
  format: ?Format,
  ...GenericContentFields,
  seasons: Season[],
  parentPages: Array<ParentPage | Exhibition>,
  onThisPage: Link[],
  datePublished: ?Date,
  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  siteSection: ?string,
  // TODO: (drupal migration) This is used while we add the credit and
  // alt for Drupal content
  drupalPromoImage: ?string,
  drupalNid: ?string,
  drupalPath: ?string,
  showOnThisPage: boolean,
|};
