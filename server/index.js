import {setupApp} from './setup-app';
import {createPageConfig} from './model/page-config';
import {default as filtersMap} from './filters';
import {getPrismicApi} from './services/prismic';
import {parseBody} from './services/prismic-body-parser';
import {
  asText,
  asHtml,
  parsePicture,
  parseImagePromo,
  parsePromoListItem
} from './services/prismic-parsers';

export {setupApp};
export const filters = filtersMap.toJS();
export const model = {createPageConfig};
export const services = {
  getPrismicApi,
  parseBody,
  asText,
  asHtml,
  parsePicture,
  parseImagePromo,
  parsePromoListItem
};
