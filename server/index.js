import {setupApp} from './setup-app';
import {createPageConfig} from './model/page-config';
import {default as filtersMap} from './filters';
import {
  getPrismicApi,
  getEvent
} from './services/prismic';
import {
  parsePromoListItem,
  parseExhibitionsDoc
} from './services/prismic-parsers';

export {setupApp};
export const filters = filtersMap.toJS();
export const model = {createPageConfig};
export const prismicParsers = {
  parsePromoListItem,
  parseExhibitionsDoc
};
export const prismic = {getEvent};
export const services = {getPrismicApi};
