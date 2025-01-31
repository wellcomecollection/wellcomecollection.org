import { isSiteSection, SiteSection } from '@weco/common/model/site-section';

import {
  AllContentType,
  contentApiTypeMap,
  isContentApiContentType,
  isContentType,
} from './content-types';

type Props = {
  uid?: string;
  type: string;
  highlightTourType?: 'audio' | 'bsl' | 'text';
  siteSection?: SiteSection;
};

// Untransformed data
type DataProps = {
  uid?: string;
  type: string;
  highlightTourType?: 'audio' | 'bsl' | 'text';
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
  text: 'captions-and-transcripts',
};

function linkResolver(doc: Props | DataProps): string {
  // This is mostly useful for scenarios like rendering in Page Builder
  // which doesn't necessarily have access to all data
  if (!doc) return '/';

  const { uid, type: docType } = doc;
  // The type of a document can be slightly different depending on whether we retrieve it
  // from Prismic or the Content API, e.g. articles vs article,
  // but we want to construct the same urls for them
  // We also have an additional type of 'exhibition-guides-links' tht we use inside the CardGrid component
  // This is so we can create links to the individual guide types such as bsl or captions-and-transcripts
  const type =
    isContentType(docType as AllContentType) ||
    docType === 'exhibition-guides-links'
      ? docType
      : isContentApiContentType(docType as AllContentType)
        ? contentApiTypeMap[docType]
        : '';

  if (!uid) return '/';
  let siteSection: SiteSection | undefined;
  switch (type) {
    case 'articles':
    case 'webcomics':
      return `/stories/${uid}`;
    case 'webcomic-series':
      return `/series/${uid}`;
    case 'exhibition-texts':
      return `/guides/exhibitions/${uid}/captions-and-transcripts`;
    case 'exhibition-highlight-tours':
    case 'exhibition-guides-links': // We create this type in OtherExhibitionGuides, in order to render cards with links to individual tourTypes (.../bsl, .../audio-without-description, .../captions-and-transcripts)
    case 'exhibition-guides': // This is a deprecated Prismic type
      if (doc.highlightTourType) {
        return `/guides/exhibitions/${uid}/${highlightToursMap[doc.highlightTourType]}`;
      } else {
        return `/guides/exhibitions/${uid}`;
      }
    case 'visual-stories':
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
      break;
    case 'pages':
      if ('siteSection' in doc) {
        siteSection = doc.siteSection;
      }

      // Prismic previews come through here.
      if ('tags' in doc) {
        siteSection = doc.tags.find(t => isSiteSection(t));
      }

      return siteSection === uid || !siteSection // if it is a landing page or doesn't have a siteSection
        ? `/${uid}`
        : `/${siteSection}/${uid}`;
  }

  if (isContentType(type)) {
    return `/${type}/${uid}`;
  }

  return '/';
}

export default linkResolver;
