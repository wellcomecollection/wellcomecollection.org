// Models the response from a IIIF Image API v2 info.json endpoint.
// https://iiif.io/api/image/2.1/#image-information
//
// When you fetch an image service URL with /info.json, you get technical metadata
// about the image (dimensions, tile sizes, etc.). This is different from the brief
// service reference that appears inside a manifest's `service` property.
//
// The @iiif/presentation-3 library only types the Presentation API (manifests),
// not the Image API responses, so we define this type ourselves.
// Wellcome images always include their dimensions.
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
