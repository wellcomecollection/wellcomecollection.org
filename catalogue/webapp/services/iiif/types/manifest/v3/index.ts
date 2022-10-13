import {
  ContentResource,
  IIIFExternalWebResource,
  InternationalString,
} from '@iiif/presentation-3';

// TODO remove V3
export type AudioV3 = {
  title?: string;
  sounds: {
    sound: IIIFExternalWebResource;
    title?: string;
  }[];
  thumbnail?: ContentResource;
  transcript?: ContentResource;
};

// TODO V3
export type IIIFImageV3 = {
  id: string;
  type: 'Image';
  label: InternationalString;
  format: string;
};
