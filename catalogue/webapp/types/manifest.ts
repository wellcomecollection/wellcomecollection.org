import {
  IIIFMediaElement,
  IIIFRendering,
  IIIFCanvas,
} from '../../webapp/services/iiif/types/manifest/v2';
import { AudioV3 } from '../../webapp/services/iiif/types/manifest/v3';

// TODO NEXT check all types and if they should really optional
export type ManifestData = {
  v2: {
    // all of these could be undefined if the manifest fetch fails and therefore the manifestData is undefined
    title: string;
    imageCount: number;
    childManifestsCount: number;
    video?: IIIFMediaElement;
    iiifCredit?: string;
    iiifPresentationDownloadOptions?: IIIFRendering[];
    iiifDownloadEnabled?: boolean;
    firstChildManifestLocation?: string;
    showDownloadOptions: boolean; // TODO do we need this and iiifDownloadEnabled?
    downloadOptions: IIIFRendering[];
    // [
    //   {
    //     "@id": "https://iiif.wellcomecollection.org/pdf/b31362758",
    //     "label": "View as PDF",
    //     "format": "application/pdf"
    //   },
    //   {
    //     "@id": "https://api.wellcomecollection.org/text/v1/b31362758",
    //     "label": "View raw text",
    //     "format": "text/plain"
    //   }
    // ],
    pdfRendering: any; // TODO type properly
    authService: any; // TODO type properly
    tokenService: any; // TODO type properly
    isAnyImageOpen: boolean; // TODO type properly
    isTotallyRestricted: boolean; // TODO type properly
    isCollectionManifest: boolean; // TODO not this, can we use childManifestCount, is it ultimately the same thing
    manifests: any; // TODO type properly
    canvases: IIIFCanvas[] | undefined; // TODO return values for all of these if iiif manifest is undefined.
    parentManifestUrl: string | undefined;
    needsModal: any; // TODO type properly
    searchService: any; // TODO type properly
    structures: any; // TODO type properly
  };
  v3: {
    audio: AudioV3;
    services: any[]; // TODO
  };
};
