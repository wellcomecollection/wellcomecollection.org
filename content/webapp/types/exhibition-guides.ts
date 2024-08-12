import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import * as prismic from '@prismicio/client';
import {
  ExhibitionTextsDocumentData as RawExhibitionTextsDocumentData,
  ExhibitionHighlightToursDocumentData as RawExhibitionHighlightToursDocumentData,
} from '@weco/common/prismicio-types';

type CaptionsOrTranscripts = {
  title: string;
  standaloneTitle: string;
  tombstone?: prismic.RichTextField;
  caption?: prismic.RichTextField;
  transcription?: prismic.RichTextField;
  context?: prismic.RichTextField;
};

export type GuideHighlightTour = {
  number: number | undefined;
  title: string;
  audio: string | undefined;
  transcript: prismic.RichTextField | undefined;
  audioDuration: number | undefined;
  video: string | undefined;
  subtitles: prismic.RichTextField | undefined;
  videoDuration: number | undefined;
  image: ImageType | undefined;
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
  title: string;
  description?: string;
};

export type ExhibitionGuideBasic = {
  title: string;
  introText: prismic.RichTextField;
  type:
    | 'exhibition-guides'
    | 'exhibition-guides-links'
    | 'exhibition-texts'
    | 'exhibition-highlight-tours';
  id: string;
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

const typeNames = [
  'bsl',
  'audio-without-descriptions',
  'captions-and-transcripts',
] as const;
export type ExhibitionGuideType = (typeof typeNames)[number];

export function isValidType(
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
