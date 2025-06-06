import type * as prismic from '@prismicio/client';

import { SiteSection } from '@weco/common/model/site-section';

import { Contributor } from './contributors';
import { Format } from './format';
import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';
import { Season } from './seasons';

export type ParentPage = Page & {
  order: number;
  type: 'pages' | 'exhibitions';
  tags?: string[];
};

export type Page = GenericContentFields & {
  type: 'pages';
  introText?: prismic.RichTextField;
  uid: string;
  format: Format | undefined;
  seasons: Season[];
  parentPages: ParentPage[];
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: SiteSection;
  showOnThisPage: boolean;
  contributors: Contributor[];
};
