import {setupApp} from './setup-app';
import {List} from 'immutable';
import {createPageConfig} from './model/page-config';
import {UiComponent} from './model/ui-component';
import {Picture} from './model/picture';
import {PaginationFactory} from './model/pagination';
import {default as filtersMap} from './filters';
import {
  getPrismicApi,
  getEvent,
  getPaginatedResults,
  getExhibitionAndRelatedContent
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
export {List};
export const prismic = {
  getPrismicApi,
  getEvent,
  getPaginatedResults,
  getExhibitionAndRelatedContent,
  parsePromoListItem,
  parseExhibitionsDoc,
  prismicImage,
  asText
};
