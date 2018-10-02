// @flow
import type {GenericContentFields} from './generic-content-fields';

export type Page = {|
  type: 'pages',
  ...GenericContentFields,
  datePublished: ?Date,
  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  siteSection: ?string,
  // TODO: (drupal migration) This is used while we add the credit and
  // alt for Drupal content
  drupalPromoImage: ?string,
  drupalNid: ?string,
  drupalPath: ?string
|}
