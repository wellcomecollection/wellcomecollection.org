import { isContentType } from './content-types';

function linkResolver(doc: { id: string; type: string }): string {
  const { id, type } = doc;

  if (type === 'webcomics') return `/articles/${id}`;
  if (type === 'webcomic-series') return `/series/${id}`;
  if (type === 'exhibition-guides') return `/guides/exhibitions/${id}`;
  // TODO will need redoing when we determine the final url structure for these
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/9790
  if (type === 'visual-stories') return `/visual-stories/${id}`;

  if (isContentType(type)) {
    return `/${type}/${id}`;
  }

  return '/';
}

export default linkResolver;
