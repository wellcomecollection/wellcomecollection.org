export type IIIFImage = {
  '@context': 'http://iiif.io/api/image/2/context.json';
  '@id': string;
  protocol: 'http://iiif.io/api/image';
  width: number;
  height: number;
  tiles: {
    width: number;
    height: number;
    scaleFactors: number[];
  }[];
  sizes: {
    width: number;
    height: number;
  }[];
  profile: {
    formats: string[];
    qualities: string[];
    supports: string[];
  }[];
};
