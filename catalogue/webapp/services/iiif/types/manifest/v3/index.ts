import { ContentResource, IIIFExternalWebResource } from '@iiif/presentation-3';

export type Audio = {
  title?: string;
  sounds: {
    sound: IIIFExternalWebResource;
    title?: string;
  }[];
  thumbnail?: ContentResource;
  transcript?: ContentResource;
};
