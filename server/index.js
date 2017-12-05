import {setupApp} from './setup-app';
import {List} from 'immutable';
import {createPageConfig} from './model/page-config';
import {UiComponent} from './model/ui-component';
import {Picture} from './model/picture';
import {PaginationFactory} from './model/pagination';
import {default as filtersMap} from './filters';
import Prismic from 'prismic-javascript';
import {
  getPrismicApi,
  getEvent
} from './services/prismic';
import {
  parsePromoListItem,
  parseExhibitionsDoc,
  prismicImage,
  asText
} from './services/prismic-parsers';

export {setupApp};
export const filters = filtersMap.toJS();
export const model = {createPageConfig, Picture, UiComponent, PaginationFactory};
export {Prismic};
export {List};
export const prismicParsers = {
  parsePromoListItem,
  parseExhibitionsDoc,
  prismicImage,
  asText
};
export {Prismic};
export const prismic = {getEvent};
export const services = {getPrismicApi};
