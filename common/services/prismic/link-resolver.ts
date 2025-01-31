import { isSiteSection, SiteSection } from '@weco/common/model/site-section';

import { isContentType } from './content-types';

type Props = {
  uid?: string;
  type: string;
  highlightTourType?: 'audio' | 'bsl';
  siteSection?: SiteSection;
};

// Untransformed data
type DataProps = {
  uid?: string;
  type: string;
  highlightTourType?: 'audio' | 'bsl';
  tags: string[];
  data: {
    relatedDocument?: {
      uid: string;
      type: string;
    };
  };
};

export const highlightToursMap = {
  audio: 'audio-without-descriptions',
  bsl: 'bsl',
};

function linkResolver(doc: Props | DataProps): string {
  // This is mostly useful for scenarios like rendering in Page Builder
  // which doesn't necessarily have access to all data
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
