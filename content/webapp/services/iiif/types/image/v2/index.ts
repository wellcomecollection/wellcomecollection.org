// The info.json document for a IIIF Image API v2 image:
// https://iiif.io/api/image/2.1/#image-information
// @iiif/presentation-3 covers the Presentation API only: its ImageService2
// type describes the service description embedded in a manifest (which has
// an @type property that info.json lacks), so we define the response
// document ourselves. Wellcome images always include their dimensions.
export type IIIFImage = {
  '@context': 'http://iiif.io/api/image/2/context.json';
  '@id': string;
  protocol: 'http://iiif.io/api/image';
  width: number;
  height: number;
  tiles?: {
    width: number;
    height?: number;
    scaleFactors: number[];
  }[];
  sizes?: {
    width: number;
    height: number;
  }[];
  profile: (
    | string
    | {
        formats?: string[];
        qualities?: string[];
        supports?: string[];
        maxWidth?: number;
        maxHeight?: number;
        maxArea?: number;
      }
  )[];
};
