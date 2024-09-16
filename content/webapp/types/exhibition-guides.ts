import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';
import {
  ExhibitionHighlightToursDocumentData as RawExhibitionHighlightToursDocumentData,
  ExhibitionTextsDocumentData as RawExhibitionTextsDocumentData,
} from '@weco/common/prismicio-types';

import { ImagePromo } from './image-promo';

type CaptionsOrTranscripts = {
  title: string;
  standaloneTitle: string;
  tombstone?: prismic.RichTextField;
  caption?: prismic.RichTextField;
  transcription?: prismic.RichTextField;
  context?: prismic.RichTextField;
};

export type GuideHighlightTour = {
  number?: number;
  title: string;
  audio?: string;
  transcript?: prismic.RichTextField;
  audioDuration?: number;
  video?: string;
  subtitles?: prismic.RichTextField;
  videoDuration?: number;
  image?: ImageType;
};

export type ExhibitionGuideComponent = {
  number?: number;
  displayTitle: string;
  anchorId: string;
  image?: ImageType;
  captionsOrTranscripts?: CaptionsOrTranscripts;
  audioWithoutDescription?: { url: string };
  bsl?: {
    embedUrl: string;
  };
};

export type RelatedExhibition = {
  id: string;
  uid: string;
  title: string;
  description?: string;
};

export type ExhibitionGuideBasic = {
  id: string;
  uid: string;
  title: string;
  introText: prismic.RichTextField;
  type:
    | 'exhibition-guides'
    | 'exhibition-guides-links'
    | 'exhibition-texts'
    | 'exhibition-highlight-tours';
  exhibitionTextId?: string;
  exhibitionHighlightTourId?: string;
  image?: ImageType;
  promo?: ImagePromo;
  relatedExhibition?: RelatedExhibition;
  availableTypes: {
    BSLVideo: boolean;
    captionsOrTranscripts: boolean;
    audioWithoutDescriptions: boolean;
  };
};

export type ExhibitionGuide = ExhibitionGuideBasic & {
  components: ExhibitionGuideComponent[];
};

// TODO remove 'captions-and-transcripts' once we close Jason/migrate it
// as we no longer set a cookie for that type.
// https://github.com/wellcomecollection/wellcomecollection.org/issues/11131
const typeNames = [
  'bsl',
  'audio-without-descriptions',
  'captions-and-transcripts',
] as const;
export type ExhibitionGuideType = (typeof typeNames)[number];

export function isValidExhibitionGuideType(
  type: string | string[] | undefined
): type is ExhibitionGuideType {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return typeNames.includes(type as any);
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export type ExhibitionText = ExhibitionGuideBasic & {
  textItems: RawExhibitionTextsDocumentData['slices'];
};

export type ExhibitionHighlightTour = ExhibitionGuideBasic & {
  stops: RawExhibitionHighlightToursDocumentData['slices'];
};
