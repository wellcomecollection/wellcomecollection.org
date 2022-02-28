import {
  IIIFManifest,
  IIIFRendering,
  IIIFMetadata,
  IIIFCanvas,
  IIIFStructure,
  IIIFMediaElement,
  AudioV3,
  Service,
  AuthService,
  AuthServiceService,
  IIIFAnnotationResource,
  IIIFThumbnailService,
} from '../model/iiif';
import {
  ContentResource,
  IIIFExternalWebResource,
  Manifest,
  Service as ServiceV3,
} from '@iiif/presentation-3';
import { fetchJson } from '@weco/common/utils/http';
import cloneDeep from 'lodash.clonedeep';
import { isNotUndefined } from '@weco/common/utils/array';

export function getServiceId(canvas?: IIIFCanvas): string | undefined {
  const serviceSrc = canvas?.images[0]?.resource?.service;
  if (serviceSrc) {
    if (Array.isArray(serviceSrc)) {
      const service = serviceSrc.find(
        item => item['@context'] === 'http://iiif.io/api/image/2/context.json'
      );
      return service && service['@id'];
    } else {
      return serviceSrc['@id'];
    }
  }
}

// We don't know at the top-level of a manifest whether any of the canvases contain images that are open access.
// The top-level holds information about whether the item contains _any_ images with an authService.
// Individual images hold information about their own authService (if it has one).
// So we check if any canvas _doesn't_ have an authService, and treat the whole item as open access if that's the case.
// This allows us to determine whether or not to show the viewer at all.
export function getIsAnyImageOpen(manifest: IIIFManifest): boolean {
  const { sequences } = manifest;
  const canvases = sequences?.map(sequence => sequence.canvases).flat() || [];

  return canvases.some(canvas => !isImageRestricted(canvas));
}

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

export function getTokenServiceV3(
  authServiceId: string,
  services?: ServiceV3[]
): AuthServiceService | undefined {
  const service = (services as AuthService[])?.find(
    s => s?.['@id'] === authServiceId
  );

  return service?.service?.find(
    s =>
      s.profile === 'http://iiif.io/api/auth/0/token' ||
      s.profile === 'http://iiif.io/api/auth/1/token'
  );
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

export const restrictedAuthServiceUrl =
  'https://iiif.wellcomecollection.org/auth/restrictedlogin';

export function getImageAuthService(
  canvas: IIIFCanvas
): AuthService | string | null {
  const serviceArray = canvas?.images?.[0]?.resource?.service?.[0]?.service;
  const authService =
    serviceArray &&
    serviceArray.find(
      service =>
        service['@context'] === 'http://iiif.io/api/auth/0/context.json' ||
        service === restrictedAuthServiceUrl
    );
  return authService || null;
}

export function isImageRestricted(canvas: IIIFCanvas): boolean {
  const imageAuthService = getImageAuthService(canvas);

  return Boolean(
    imageAuthService?.['@id'] === restrictedAuthServiceUrl ||
      imageAuthService === restrictedAuthServiceUrl
  );
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

export function getDownloadOptionsFromManifest(
  iiifManifest: IIIFManifest
): IIIFRendering[] {
  const sequence = iiifManifest.sequences?.find(
    sequence => sequence['@type'] === 'sc:Sequence'
  );
  const sequenceRendering = sequence?.rendering ?? [];
  const sequenceRenderingArray: IIIFRendering[] = Array.isArray(
    sequenceRendering
  )
    ? sequenceRendering
    : [sequenceRendering];

  const pdfRenderingArray: IIIFRendering[] = iiifManifest.mediaSequences
    ? iiifManifest.mediaSequences.reduce((acc: IIIFRendering[], sequence) => {
        return acc.concat(
          sequence.elements
            .map(element => {
              return {
                '@id': element['@id'],
                format: element.format,
                label: `Download ${
                  element.format === 'application/pdf' ? 'PDF' : 'file'
                }`,
                width: element.width,
              };
            })
            .filter(Boolean)
        );
      }, [])
    : [];
  return [...sequenceRenderingArray, ...pdfRenderingArray].filter(Boolean);
}

export function getCanvases(iiifManifest: IIIFManifest): IIIFCanvas[] {
  const sequence =
    iiifManifest.sequences &&
    iiifManifest.sequences.find(
      sequence =>
        sequence['@type'] === 'sc:Sequence' &&
        sequence.compatibilityHint !== 'displayIfContentUnsupported'
    );
  return sequence ? sequence.canvases : [];
}

export function getStructures(iiifManifest: IIIFManifest): IIIFStructure[] {
  return iiifManifest?.structures || [];
}

// When lots of the works were digitised, structures with multiple pages such as table of contents
// were created individually, rather than as a single structure with a range of pages.
// This means we will often display repetitive links to the essentially the same thing.
// Until we can improve the data at source, this function groups structures that have the same label attached to consecutive pages into a single structure.
export function groupStructures(
  canvases: IIIFCanvas[],
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
    videoSequence.elements.find(
      element => element['@type'] === 'dctypes:MovingImage'
    )
  );
}

export function getAudio(iiifManifest: IIIFManifest): IIIFMediaElement[] {
  const audioSequences = (iiifManifest.mediaSequences || [])
    .flatMap(sequence =>
      sequence.elements.find(element => element['@type'] === 'dctypes:Sound')
    )
    .filter(isNotUndefined);

  return audioSequences;
}

export function getAudioV3(manifest: Manifest): AudioV3 {
  const canvases = manifest.items.filter(item => item.type === 'Canvas');
  const title = canvases.find(c => c?.label?.en)?.[0];
  const audioTypes = ['Audio', 'Sound'];
  const sounds = canvases
    .map(c => {
      const title = c?.label?.en?.[0];
      const annotationPage = c?.items?.find(i => i.type === 'AnnotationPage');
      const annotation = annotationPage?.items?.find(
        i => i.type === 'Annotation'
      );
      const sound =
        audioTypes.includes(
          (annotation?.body as ContentResource)?.type || ''
        ) && annotation?.body;
      return { sound, title };
    })
    .filter(s => Boolean(s.sound) && isNotUndefined(s.sound)) as {
    title?: string;
    sound: IIIFExternalWebResource;
  }[];

  const placeholderCanvasItems = manifest.placeholderCanvas?.items?.find(
    i => i.type === 'AnnotationPage'
  );
  const placeholderCanvasAnnotation = placeholderCanvasItems?.items?.find(
    i => i.type === 'Annotation'
  );
  const thumbnail = placeholderCanvasAnnotation?.body as ContentResource;
  const transcript = manifest?.rendering?.find(
    i => i?.['format'] === 'application/pdf'
  );

  return { title, sounds, thumbnail, transcript };
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

export function getFirstChildManifestLocation(
  iiifManifest: IIIFManifest
): string | undefined {
  if (iiifManifest.manifests) {
    return iiifManifest.manifests.find(manifest => manifest['@id'])['@id'];
  }
}

export function getIIIFPresentationCredit(
  manifest: IIIFManifest
): string | undefined {
  const attribution = getIIIFMetadata(manifest, 'Attribution');
  return attribution?.value.split('<br/>')[0];
}

export function getSearchService(manifest: IIIFManifest): Service | undefined {
  if (Array.isArray(manifest.service)) {
    return manifest.service.find(
      service =>
        service['@context'] === 'http://iiif.io/api/search/0/context.json'
    );
  } else if (
    manifest.service?.['@context'] ===
    'http://iiif.io/api/search/0/context.json'
  ) {
    return manifest.service;
  }
}

// This is necessary while we are in the process of switching the source of the iiif presentation manifests
// There is a slight (temporary) difference between the manifest served from wellcomelibrary.org
// and the one served from iiif.wellcomecollection.org
// In the former canvas.thumbnail.service is an object and in the latter it is an array.
export function getThumbnailService(
  canvas: IIIFCanvas
): IIIFThumbnailService | undefined {
  const service = canvas?.thumbnail?.service;
  if (Array.isArray(service)) {
    return service[0];
  } else {
    return service;
  }
}

export async function getIIIFManifest(
  url: string
): Promise<IIIFManifest | Manifest> {
  const manifest = await fetchJson(url);
  return manifest;
}
