import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';
import {
  ExhibitionHighlightToursDocumentData as RawExhibitionHighlightToursDocumentData,
  ExhibitionTextsDocumentData as RawExhibitionTextsDocumentData,
} from '@weco/common/prismicio-types';
import { VideoProvider } from '@weco/common/views/components/VideoEmbed';

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
  audioDuration?: string;
  video?: string;
  videoProvider?: VideoProvider;
  videoThumbnail?: string;
  videoDuration?: string;
  subtitles?: prismic.RichTextField;
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
    provider: VideoProvider;
    thumbnail?: string;
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
  exhibitionTextUid?: string;
  exhibitionHighlightTourUid?: string;
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
