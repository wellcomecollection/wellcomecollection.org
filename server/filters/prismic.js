import {RichText} from 'prismic-dom';

export function prismicAsHtml(content) {
  return RichText.asHtml(content);
}
