import { isSiteSection, SiteSection } from '@weco/common/model/site-section';

import { isContentType } from './content-types';

type Props = {
  uid?: string;
  type: string;
  siteSection?: SiteSection;
};
type DataProps = {
  uid?: string;
  type: string;
  tags: string[];
  data: {
    relatedDocument?: {
      uid: string;
      type: string;
    };
  };
};

function linkResolver(doc: Props | DataProps): string {
  // this is mostly useful for scenarios like rendering in Page Builder
  if (!doc) return '/';

  const { uid, type } = doc;

  if (!uid) return '/';
  if (type === 'articles') return `/stories/${uid}`;
  if (type === 'webcomics') return `/stories/${uid}`;
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

  if (type === 'pages') {
    if ('siteSection' in doc) {
      return `${doc.siteSection}/${uid}`;
    } else if ('tags' in doc) {
      // Needed for Prismic previews
      const docSiteSection = doc.tags.find(t => isSiteSection(t));
      return `${docSiteSection ? '/' + docSiteSection : ''}/${uid}`;
    }
    return `/${uid}`;
  }

  if (isContentType(type)) {
    return `/${type}/${uid}`;
  }

  return '/';
}

export default linkResolver;
