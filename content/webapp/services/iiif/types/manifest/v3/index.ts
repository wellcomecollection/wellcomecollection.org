import {
  ContentResource,
  IIIFExternalWebResource,
  ExternalWebResource,
} from '@iiif/presentation-3';

export type Audio = {
  title?: string;
  sounds: {
    sound: IIIFExternalWebResource;
    title?: string;
  }[];
  thumbnail?: ContentResource;
  transcript?: ContentResource;
};

export type Video = IIIFExternalWebResource & {
  thumbnail?: string;
  annotations?: ExternalWebResource;
};
