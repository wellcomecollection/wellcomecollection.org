import {asHtml, asText} from '../services/prismic-parsers';

export function prismicAsHtml(content) {
  return asHtml(content);
}

export function prismicAsText(content) {
  return asText(content);
}
