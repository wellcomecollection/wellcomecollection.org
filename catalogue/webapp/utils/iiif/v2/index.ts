import {
  IIIFManifest,
  IIIFMetadata,
  IIIFStructure,
  IIIFMediaElement,
  Service,
  AuthService,
  AuthServiceService,
  IIIFAnnotationResource,
  EmptyIIIFMediaElement,
} from '../../../../webapp/services/iiif/types/manifest/v2';
import { TransformedCanvas } from '../../../types/manifest';
import { Manifest, Service as ServiceV3 } from '@iiif/presentation-3';
import { fetchJson } from '@weco/common/utils/http';
import cloneDeep from 'lodash.clonedeep';

const isFilledMediaElement = (
  element: IIIFMediaElement | EmptyIIIFMediaElement
): element is IIIFMediaElement => {
  return '@id' in element;
};

export function getAuthService(
  iiifManifest?: IIIFManifest
): AuthService | undefined {
  if (iiifManifest && iiifManifest.service) {
    if (Array.isArray(iiifManifest.service)) {
      const authServices = iiifManifest.service
        .filter(service => !!service.authService)
        .map(service => service?.authService);
      const restrictedService = authServices.find(
        service =>
          service?.['@id'] ===
          'https://iiif.wellcomecollection.org/auth/restrictedlogin'
      );
      const nonRestrictedService = authServices.find(
        service =>
          service?.['@id'] !==
          'https://iiif.wellcomecollection.org/auth/restrictedlogin'
      );

      // We're only interested in the services about access
      const servicesOfInterest = iiifManifest.service.filter(
        s => s.accessHint !== undefined
      );

      const isAvailableOnline =
        servicesOfInterest.some(service => !service.authService) &&
        !nonRestrictedService;
      // If any of the manifest accessHint services don't include an `authService` then we can show the viewer without a modal.
      // e.g. if the manifest is a mixture of open and restricted images, then
      // DLCS will hide the images that are restricted -- and we can let the
      // user click straight through to the images that are open.
      //
      // If there is a mixture of restricted images and non restricted images, we show the auth service of the non restricted ones, 'e.g. open with advisory', as these can still be viewd.
      // Individual images that are restricted won't be displayed anyway.
      return isAvailableOnline
        ? undefined
        : nonRestrictedService || restrictedService;
    } else {
      return iiifManifest.service.authService;
    }
  }
}

export function getMediaClickthroughServiceV3(
  services: ServiceV3[]
): AuthService | undefined {
  return (services as AuthService[]).find(
    s => s?.['@id'] === 'https://iiif.wellcomecollection.org/auth/clickthrough'
  );
}

export function getMediaClickthroughService(
  media: IIIFMediaElement
): AuthService | undefined {
  if (media?.service) {
    if (Array.isArray(media.service)) {
      return media.service.find(
        service =>
          service.profile === 'http://iiif.io/api/auth/0/clickthrough' ||
          service.profile === 'http://iiif.io/api/auth/1/clickthrough'
      );
    } else {
      if (
        media.service.profile === 'http://iiif.io/api/auth/0/clickthrough' ||
        media.service.profile === 'http://iiif.io/api/auth/1/clickthrough'
      ) {
        return media.service;
      }
    }
  }
}

export function getTokenService(
  authService: AuthService
): AuthServiceService | undefined {
  const authServiceServices = authService?.service || [];
  return authServiceServices.find(
    service =>
      service.profile === 'http://iiif.io/api/auth/0/token' ||
      service.profile === 'http://iiif.io/api/auth/1/token'
  );
}

const restrictedAuthServiceUrl =
  'https://iiif.wellcomecollection.org/auth/restrictedlogin';

export function checkModalRequired(
  authService: AuthService | undefined,
  isAnyImageOpen: boolean
): boolean {
  switch (authService?.['@id']) {
    case undefined:
      return false;
    case restrictedAuthServiceUrl:
      return !isAnyImageOpen;
    default:
      return true;
  }
}

export function checkIsTotallyRestricted(
  authService: AuthService | undefined,
  isAnyImageOpen: boolean
): boolean {
  return authService?.['@id'] === restrictedAuthServiceUrl && !isAnyImageOpen;
}

export function getUiExtensions(
  iiifManifest: IIIFManifest
): Service | undefined {
  if (iiifManifest.service) {
    if (
      !Array.isArray(iiifManifest.service) &&
      iiifManifest.service.profile ===
        'http://universalviewer.io/ui-extensions-profile'
    ) {
      return iiifManifest.service;
    } else if (Array.isArray(iiifManifest.service)) {
      return iiifManifest.service.find(
        service =>
          service.profile === 'http://universalviewer.io/ui-extensions-profile'
      );
    }
  }
}

export function isUiEnabled(
  uiExtensions: Service | undefined,
  uiName: string
): boolean {
  const disableUI = uiExtensions && uiExtensions.disableUI;
  if (disableUI) {
    return !(
      disableUI.includes(uiName) || disableUI.includes(uiName.toLowerCase())
    );
  }
  return true;
}

export function getIIIFMetadata(
  iiifManifest: IIIFManifest,
  label: string
): IIIFMetadata | undefined {
  return iiifManifest.metadata.find(data => data.label === label);
}

export function getStructures(iiifManifest: IIIFManifest): IIIFStructure[] {
  return iiifManifest?.structures || [];
}

// When lots of the works were digitised, structures with multiple pages such as table of contents
// were created individually, rather than as a single structure with a range of pages.
// This means we will often display repetitive links to the essentially the same thing.
// Until we can improve the data at source, this function groups structures that have the same label attached to consecutive pages into a single structure.
export function groupStructures(
  canvases: TransformedCanvas[],
  structures: IIIFStructure[]
): IIIFStructure[] {
  const clonedStructures = cloneDeep(structures);
  return clonedStructures.reduce(
    (acc, structure) => {
      if (!structure.canvases) return acc;

      const [lastCanvasInRange] = structure.canvases.slice(-1);
      const [firstCanvasInRange] = structure.canvases;
      const firstCanvasIndex = canvases.findIndex(
        canvas => canvas['@id'] === firstCanvasInRange
      );
      if (
        acc.previousLabel === structure.label &&
        firstCanvasIndex === acc.previousLastCanvasIndex + 1
      ) {
        acc.groupedArray[acc.groupedArray.length - 1].canvases.push(
          lastCanvasInRange
        );
      } else if (structure.canvases.length > 0) {
        acc.groupedArray.push(structure);
      }
      acc.previousLabel = structure.label;
      acc.previousLastCanvasIndex = canvases.findIndex(
        canvas => canvas['@id'] === lastCanvasInRange
      );
      return acc;
    },
    {
      previousLastCanvasIndex: null,
      previousLabel: null,
      groupedArray: [],
    }
  ).groupedArray;
}

export function getVideo(
  iiifManifest: IIIFManifest
): IIIFMediaElement | undefined {
  const videoSequence =
    iiifManifest &&
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(
        element => element['@type'] === 'dctypes:MovingImage'
      )
    );
  return (
    videoSequence &&
    videoSequence.elements
      .filter(isFilledMediaElement)
      .find(element => element['@type'] === 'dctypes:MovingImage')
  );
}

export function getAnnotationFromMediaElement(
  mediaElement: IIIFMediaElement
): IIIFAnnotationResource | undefined {
  return (
    mediaElement.resources &&
    mediaElement.resources.find(
      resource => resource['@type'] === 'oa:Annotation'
    )
  );
}

export function getFirstCollectionManifestLocation(
  iiifManifest: IIIFManifest
): string | undefined {
  return iiifManifest.manifests?.find(manifest => manifest['@id'])?.['@id'];
}

export function getIIIFPresentationCredit(
  manifest: IIIFManifest
): string | undefined {
  const attribution = getIIIFMetadata(manifest, 'Attribution');
  return attribution?.value.split('<br/>')[0];
}

export async function getIIIFManifest(
  url: string
): Promise<IIIFManifest | Manifest> {
  const manifest = await fetchJson(url);
  return manifest;
}
