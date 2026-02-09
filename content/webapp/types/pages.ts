import type * as prismic from '@prismicio/client';

import { SiteSection } from '@weco/common/model/site-section';

import { Contributor } from './contributors';
import { Format } from './format';
import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';
import { Season } from './seasons';

export type BasePage = GenericContentFields & {
  introText?: prismic.RichTextField;
  uid: string;
  format: Format | undefined;
  seasons: Season[];
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: SiteSection;
  showOnThisPage: boolean;
  contributors: Contributor[];
};

export type ParentPage = BasePage & {
  type: 'pages' | 'exhibitions';
  parentPages: ParentPage[];
  order: number;
  tags?: string[];
};

export type Page = BasePage & {
  type: 'pages';
  parentPages: ParentPage[];
};
