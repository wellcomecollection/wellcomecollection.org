import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { RichTextField } from '@prismicio/client';

type CaptionsOrTranscripts = {
  title: string;
  standaloneTitle: string;
  tombstone?: RichTextField;
  caption?: RichTextField;
  transcription?: RichTextField;
  context?: RichTextField;
};

export type ExhibitionGuideComponent = {
  number?: number;
  displayTitle: string;
  anchorId: string;
  image?: ImageType;
  captionsOrTranscripts?: CaptionsOrTranscripts;
  audioWithDescription?: { url: string };
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
  introText: RichTextField;
  type: 'exhibition-guides' | 'exhibition-guides-links';
  id: string;
  image?: ImageType;
  promo?: ImagePromo;
  relatedExhibition?: RelatedExhibition;
  availableTypes: {
    BSLVideo: boolean;
    captionsOrTranscripts: boolean;
    audioWithoutDescriptions: boolean;
    audioWithDescriptions: boolean;
  };
};

export type ExhibitionGuide = ExhibitionGuideBasic & {
  components: ExhibitionGuideComponent[];
};

const typeNames = [
  'bsl',
  'audio-with-descriptions',
  'audio-without-descriptions',
  'captions-and-transcripts',
] as const;
export type ExhibitionGuideType = typeof typeNames[number];

export function isValidType(
  type: string | string[] | undefined
): type is ExhibitionGuideType {
  return typeNames.includes(type as any);
}
