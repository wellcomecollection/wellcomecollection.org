import {RichText} from 'prismic-dom';

export function prismicAsHtml(content) {
  return RichText.asHtml(content);
}

export function prismicAsText(content) {
  return RichText.asText(content).trim();
}
