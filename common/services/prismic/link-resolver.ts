import { isContentType } from './content-types';

type Props = {
  uid?: string;
  type: string;
};
type DataProps = {
  uid?: string;
  type: string;
  data: {
    relatedDocument?: {
      uid: string;
      type: string;
    };
  };
};

function linkResolver(doc: Props | DataProps): string {
  const { uid, type } = doc;
  if (!uid) return '/';
  if (type === 'webcomics') return `/articles/${uid}`;
  if (type === 'webcomic-series') return `/series/${uid}`;
  if (
    type === 'exhibition-guides' ||
    type === 'exhibition-texts' ||
    type === 'exhibition-highlight-tours' ||
    type === 'exhibition-guides-links'
  )
    return `/guides/exhibitions/${uid}`;

  if (type === 'visual-stories') {
    if ('data' in doc) {
      const {
        data: { relatedDocument },
      } = doc;
      if (relatedDocument?.uid) {
        return `/${relatedDocument.type}/${relatedDocument.uid}/visual-stories`;
      } else {
        return `/visual-stories/${uid}`;
      }
    }
  }

  if (isContentType(type)) {
    return `/${type}/${uid}`;
  }

  return '/';
}

export default linkResolver;
