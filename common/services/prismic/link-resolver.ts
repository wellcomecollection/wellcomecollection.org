import { isSiteSection, SiteSection } from '@weco/common/model/site-section';

import {
  contentApiTypeMap,
  isContentApiContentType,
  isContentType,
} from './content-types';

type Props = {
  uid?: string;
  type: string;
  siteSection?: SiteSection;
};

// Untransformed data
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
  // This is mostly useful for scenarios like rendering in Page Builder
  // which doesn't necessarily have access to all data
  if (!doc) return '/';

  const { uid } = doc;

  const type = isContentType(doc.type)
    ? doc.type
    : isContentApiContentType(doc.type)
      ? contentApiTypeMap[doc.type]
      : '';

  if (!uid) return '/';
  if (type === 'articles') return `/stories/${uid}`;
  if (type === 'webcomics') return `/stories/${uid}`;
  if (type === 'webcomic-series') return `/series/${uid}`;

  if (
    type === 'exhibition-guides' ||
    type === 'exhibition-texts' ||
    type === 'exhibition-highlight-tours' ||
    type === 'exhibition-guides-links' ||
    type === 'Exhibition text' ||
    type === 'Exhibition highlight tour'
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
    let siteSection: SiteSection | undefined;

    if ('siteSection' in doc) {
      siteSection = doc.siteSection;
    }

    // Prismic previews come through here.
    if ('tags' in doc) {
      siteSection = doc.tags.find(t => isSiteSection(t));
    }

    const isLandingPage = siteSection === uid;

    return isLandingPage || !siteSection ? `/${uid}` : `/${siteSection}/${uid}`;
  }

  if (isContentType(type)) {
    return `/${type}/${uid}`;
  }

  return '/';
}

export default linkResolver;
