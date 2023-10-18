import { isContentType } from './content-types';

type Props = {
  id: string;
  type: string;
};
type DataProps = {
  id: string;
  type: string;
  data: {
    'related-document'?: {
      id: string;
      type: string;
    };
  };
};
function linkResolver(doc: Props | DataProps): string {
  const { id, type } = doc;

  if (type === 'webcomics') return `/articles/${id}`;
  if (type === 'webcomic-series') return `/series/${id}`;
  if (type === 'exhibition-guides') return `/guides/exhibitions/${id}`;

  if (type === 'visual-stories') {
    if ('data' in doc) {
      const {
        data: { 'related-document': relatedDocument },
      } = doc;

      if (relatedDocument) {
        return `/${relatedDocument.type}/${relatedDocument.id}/visual-stories`;
      } else {
        return `/visual-stories/${id}`;
      }
    }
  }

  if (isContentType(type)) {
    return `/${type}/${id}`;
  }

  return '/';
}

export default linkResolver;
