import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { RichTextField } from '@prismicio/types';
import { Link } from './link';

export type ExhibitionLink = {
  id: string;
  title: string;
  description?: string;
  promo?: ImagePromo;
};

export type ExhibitionGuideComponent = {
  number: number;
  standaloneTitle: RichTextField;
  title: string;
  image?: ImageType;
  tombstone: RichTextField;
  caption: RichTextField;
  transcription: RichTextField;
  context?: RichTextField;
  audioWithDescription?: Link;
  audioWithoutDescription?: Link;
  bsl: {
    embedUrl?: string;
  };
};

export type Exhibit = {
  id: string;
  title: string;
  description: string;
  exhibitType: 'exhibitions';
  item: ExhibitionLink | undefined;
};

export type ExhibitionGuideBasic = {
  title: string;
  introText: RichTextField;
  type: 'exhibition-guides' | 'exhibition-guides-links';
  id: string;
  image?: ImageType;
  promo?: ImagePromo;
  relatedExhibition: Exhibit | undefined;
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
