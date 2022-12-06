import { Audio, Video } from '../../../services/iiif/types/manifest/v3';
import {
  AnnotationBody,
  ChoiceBody,
  ContentResource,
  ExternalWebResource,
  IIIFExternalWebResource,
  Manifest,
  MetadataItem,
  Service,
  InternationalString,
  Canvas,
  AuthExternalService,
  AuthAccessTokenService,
  Range,
} from '@iiif/presentation-3';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { isNotUndefined } from '@weco/common/utils/array';
import {
  DownloadOption,
  TransformedCanvas,
  AuthClickThroughServiceWithPossibleServiceArray,
} from '../../../types/manifest';
import cloneDeep from 'lodash.clonedeep';

// The label we want to use to distinguish between parts of a multi-volume work
// (e.g. 'Copy 1' or 'Volume 1') can currently exist in either the first or
// second position of an array, with the item title appearing in the other
// position. This is an interim check to give us the label we want, but ideally
// it would be consistent in the manifest. It will eventually be the second
// thing in the array, consistently, at which point this function will be
// redundant.
export function getMultiVolumeLabel(
  internationalString: InternationalString,
  itemTitle: string
): string {
  const stringAtIndex1 = getEnFromInternationalString(internationalString, 1);
  const stringAtIndex0 = getEnFromInternationalString(internationalString, 0);

  return stringAtIndex1 === itemTitle ? stringAtIndex0 : stringAtIndex1;
}

// TODO: rename this to something like getDisplayLabel since the key of interest
// can be either 'en' or 'none'
export function getEnFromInternationalString(
  internationalString: InternationalString,
  index = 0
): string {
  return (
    internationalString?.['en']?.[index] ||
    internationalString?.['none']?.[index] ||
    ''
  );
}

export function transformLabel(
  label: InternationalString | string | undefined
): string | undefined {
  if (typeof label === 'string' || label === undefined) return label;

  return getEnFromInternationalString(label);
}

export function getAudio(manifest: Manifest | undefined): Audio | undefined {
  if (!manifest) return;
  const canvases = manifest.items.filter(item => item.type === 'Canvas');
  const firstEnCanvas = canvases.find(c => c?.label?.en);
  const title = firstEnCanvas?.label
    ? getEnFromInternationalString(firstEnCanvas.label)
    : '';
  const audioTypes = ['Audio', 'Sound'];
  const sounds = canvases
    .map(c => {
      const title = c?.label && getEnFromInternationalString(c.label);
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
  const transcript = manifest.rendering?.find(
    i => i?.['format'] === 'application/pdf'
  );

  return { title, sounds, thumbnail, transcript };
}

type Rendering = {
  id?: string;
  format?: string;
  label?: string | InternationalString;
};

export function getDownloadOptionsFromManifest(
  iiifManifest: Manifest | undefined
): DownloadOption[] {
  // The ContentResource type on the Manifest, which applies to the iiifManifest.rendering seems incorrect
  // Temporarily adding this until it is fixed.
  const rendering = (iiifManifest?.rendering as Rendering[]) || [];
  return rendering
    .filter(({ id, format }) => {
      // I'm removing application/zip (for now?) as we haven't had these before
      // and the example I've seen is 404ing:
      // (Work) https://wellcomecollection.org/works/mg56yqa4 ->
      // (Catalogue response) https://api.wellcomecollection.org/catalogue/v2/works/mg56yqa4?include=items ->
      // (V3 Manifest) https://iiif.wellcomecollection.org/presentation/v3/b10326947
      // (rendering - application/zip) https://api.wellcomecollection.org/text/v1/b10326947.zip (returns 404)
      // For details of why we remove text/plain see https://github.com/wellcomecollection/wellcomecollection.org/issues/7592
      return id && format !== 'application/zip' && format !== 'text/plain';
    })
    .map(({ id, format, label }) => {
      return {
        id,
        label: transformLabel(label) || 'Download file',
        format,
      } as DownloadOption;
    });
}

export function getPdf(
  iiifManifest: Manifest | undefined
): DownloadOption | undefined {
  const allAnnotations = iiifManifest?.items
    ?.map(item => item.annotations)
    ?.flat();
  const allItems = allAnnotations?.map(annotation => annotation?.items).flat();
  // The Annotation[] type on the Manifest, which applies to pdfItem seems incorrect
  // Temporarily using Rendering until it is fixed.
  const pdfItem = allItems?.find(item => {
    const body = (
      Array.isArray(item?.body) ? item?.body[0] : item?.body
    ) as Rendering;
    return body?.format === 'application/pdf';
  });
  const pdfItemBody = pdfItem?.body || {};
  const { id, label, format } = pdfItemBody as Rendering;
  if (id) {
    return {
      id,
      label: transformLabel(label) || 'Download file',
      format: format || '',
    };
  }
}

export function getTitle(
  label: InternationalString | string | undefined
): string {
  if (!label) return '';
  if (typeof label === 'string') return label;

  return getEnFromInternationalString(label);
}

export function getTransformedCanvases(
  iiifManifest: Manifest | undefined
): TransformedCanvas[] {
  if (iiifManifest) {
    const canvases = iiifManifest.items?.filter(
      canvas => canvas.type === 'Canvas'
    );
    return transformCanvases(canvases) || [];
  } else {
    return [];
  }
}

function getLabelString(
  label: InternationalString | null | undefined
): string | undefined {
  if (!label) {
    return label || undefined;
  } else {
    return Object.values(label).flat().join(' ');
  }
}

function getCanvasLabel(canvas: Canvas): string | undefined {
  const label = canvas.label;
  return getLabelString(label);
}

function getCanvasTextServiceId(canvas: Canvas): string | undefined {
  const textAnnotation = canvas?.annotations?.find(annotation => {
    const annotationLabel = getLabelString(annotation.label);
    return (
      annotation.type === 'AnnotationPage' &&
      annotationLabel?.startsWith('Text of page')
    );
  });
  return textAnnotation?.id;
}

// Temporary type until iiif3 types are correct
type Thumbnail = {
  service: {
    '@id': string;
    '@type': string;
    profile: string;
    width: number;
    height: number;
    sizes: { width: number; height: number }[];
  }[];
};

function getThumbnailImage(canvas: Canvas):
  | {
      width: number;
      url: string | undefined;
    }
  | undefined {
  if (!canvas.thumbnail) return;
  const thumbnail = canvas.thumbnail[0] as Thumbnail; // ContentResource which this should be, doesn't have a service property
  const thumbnailService = Array.isArray(thumbnail.service)
    ? thumbnail.service[0]
    : thumbnail.service;
  const urlTemplate =
    thumbnailService && iiifImageTemplate(thumbnailService['@id']);
  const preferredMinThumbnailHeight = 400;
  const preferredThumbnail = thumbnailService?.sizes
    ?.sort((a, b) => a.height - b.height)
    .find(dimensions => dimensions.height >= preferredMinThumbnailHeight);
  return {
    width: preferredThumbnail?.width || 30,
    url:
      urlTemplate &&
      urlTemplate({
        size: `${preferredThumbnail ? `${preferredThumbnail.width},` : 'max'}`,
      }),
  };
}

type BodyService = {
  '@type': string;
  service: Service | Service[];
};

// Temporary types, as the provided AnnotationBody doesn't seem to be correct
type Body = {
  service: BodyService;
};

function getImageService(canvas: Canvas): BodyService | undefined {
  const items = canvas?.items;
  const AnnotationPages = items?.[0].items;
  const AnnotationBodies = AnnotationPages?.map(
    annotationPage => annotationPage.body as Body
  ).flat();
  const BodiesServices = AnnotationBodies?.map(body => body?.service).flat();
  const imageService = BodiesServices?.find(
    service => service?.['@type'] === 'ImageService2'
  );
  return imageService;
}

function getImageServiceId(
  imageService: BodyService | undefined
): string | undefined {
  return imageService?.['@id'];
}

function getImageAuthCookieService(
  imageService: BodyService | undefined
): Service | undefined {
  const imageCookieService = Array.isArray(imageService?.service)
    ? imageService?.service?.find(s => s['@type'] === 'AuthCookieService1')
    : imageService?.service?.['@type'] === 'AuthCookieService1'
    ? imageService?.service
    : undefined;
  return imageCookieService;
}

// We don't know at the top-level of a manifest whether any of the canvases contain images that are open access.
// The top-level only holds information about whether the item contains _any_ images with an authService.
// N.B. this will be changed in the future: https://github.com/wellcomecollection/platform/issues/5630
// Individual images hold information about their own authService (if it has one).
// So we check if any canvas _doesn't_ have an authService, and treat the whole item as open access if that's the case.
// This allows us to determine whether or not to show the viewer at all.
// N.B. the individual items within the viewer won't display if they are restricted.
export function checkIsAnyImageOpen(
  transformedCanvases: TransformedCanvas[] | undefined
): boolean {
  return Boolean(
    transformedCanvases?.some(canvas => !canvas.hasRestrictedImage)
  );
}

export function getIIIFMetadata(
  manifest: Manifest,
  label: string
): MetadataItem | undefined {
  return (manifest.metadata || []).find(
    data => getEnFromInternationalString(data.label) === label
  );
}

export function getIIIFPresentationCredit(
  manifest: Manifest | undefined
): string | undefined {
  if (!manifest) return;
  const attribution = getIIIFMetadata(manifest, 'Attribution and usage');
  const maybeValueWithBrTags =
    attribution?.value && getEnFromInternationalString(attribution.value);

  return maybeValueWithBrTags?.split('<br />')[0];
}

function getChoiceBody(
  body?: AnnotationBody | AnnotationBody[]
): ChoiceBody | undefined {
  const isChoiceBody =
    typeof body !== 'string' && !Array.isArray(body) && body?.type === 'Choice';

  return isChoiceBody ? body : undefined;
}

function getExternalWebResourceBody(
  body?: AnnotationBody | AnnotationBody[]
): ExternalWebResource | undefined {
  const isExternalWebResource =
    typeof body !== 'string' &&
    !Array.isArray(body) &&
    (body?.type === 'Video' ||
      body?.type === 'Sound' ||
      body?.type === 'Image' ||
      body?.type === 'Text');
  return isExternalWebResource ? body : undefined;
}

export function getVideo(manifest: Manifest | undefined): Video | undefined {
  if (!manifest) return;
  const videoChoiceBody = getChoiceBody(
    manifest.items?.[0]?.items?.[0]?.items?.[0]?.body
  );
  const maybeVideo = getExternalWebResourceBody(videoChoiceBody?.items?.[0]);
  const thumbnailImageResourceBody = getExternalWebResourceBody(
    manifest.placeholderCanvas?.items?.[0]?.items?.[0]?.body
  );
  const thumbnail = thumbnailImageResourceBody?.id;
  const annotationPage = manifest.items?.[0]?.annotations?.[0].items?.[0]?.body;
  const annotations = getExternalWebResourceBody(annotationPage);

  return maybeVideo?.type === 'Video'
    ? { ...maybeVideo, thumbnail, annotations }
    : undefined;
}

export function getSearchService(
  manifest: Manifest | undefined
): Service | undefined {
  const searchService = manifest?.service?.find(
    service => service?.['@type'] === 'SearchService1'
  );
  return searchService || undefined;
}

export function getFirstCollectionManifestLocation(
  iiifManifest: Manifest
): string | undefined {
  return iiifManifest.items?.filter(c => c.type === 'Manifest')?.find(m => m.id)
    ?.id;
}

export function hasPdfDownload(manifest: Manifest): boolean {
  // e.g. https://iiif.wellcomecollection.org/presentation/v3/b21466154_0001 We
  // have to check `type === 'Text'` to narrow the type enough for TS to know
  // that `format` will be a `string`
  return (
    Boolean(getPdf(manifest)) ||
    !!manifest.rendering?.find(
      r => r.type === 'Text' && r.format === 'application/pdf'
    )
  );
}

export function getClickThroughService(
  manifest: Manifest | undefined
): AuthClickThroughServiceWithPossibleServiceArray | undefined {
  return manifest?.services?.find(
    s => s.profile === 'http://iiif.io/api/auth/1/clickthrough'
  ) as AuthClickThroughServiceWithPossibleServiceArray | undefined;
}

const restrictedAuthServiceUrl =
  'https://iiif.wellcomecollection.org/auth/restrictedlogin';

function isImageRestricted(canvas: Canvas): boolean {
  const imageService = getImageService(canvas);
  const imageAuthCookieService = getImageAuthCookieService(imageService);
  if (imageAuthCookieService?.['@id'] === restrictedAuthServiceUrl) {
    return true;
  } else {
    return false;
  }
}

export function getRestrictedLoginService(
  manifest: Manifest | undefined
): AuthExternalService | undefined {
  if (!manifest) return;
  return manifest?.services?.find(service => {
    const typedService = service as AuthExternalService;
    return typedService['@id'] === restrictedAuthServiceUrl;
  }) as AuthExternalService;
}

export function getTokenService(
  clickThroughService:
    | AuthClickThroughServiceWithPossibleServiceArray
    | AuthExternalService
    | undefined
): AuthAccessTokenService | undefined {
  if (!clickThroughService?.service) return;
  return Array.isArray(clickThroughService?.service)
    ? clickThroughService?.service.find(
        s => s?.profile === 'http://iiif.io/api/auth/1/token'
      )
    : clickThroughService?.service;
}

type checkModalParams = {
  clickThroughService:
    | AuthClickThroughServiceWithPossibleServiceArray
    | undefined;
  restrictedService: AuthExternalService | undefined;
  isAnyImageOpen: boolean;
};

export function checkModalRequired(params: checkModalParams): boolean {
  const { clickThroughService, restrictedService, isAnyImageOpen } = params;
  if (clickThroughService) {
    return true;
  } else if (restrictedService) {
    return !isAnyImageOpen;
  } else {
    return false;
  }
}

export function checkIsTotallyRestricted(
  restrictedAuthService: AuthExternalService | undefined,
  isAnyImageOpen: boolean
): boolean {
  return Boolean(restrictedAuthService && !isAnyImageOpen);
}

function transformCanvas(canvas: Canvas): TransformedCanvas {
  const imageService = getImageService(canvas);
  const imageServiceId = getImageServiceId(imageService);
  const hasRestrictedImage = isImageRestricted(canvas);
  const label = getCanvasLabel(canvas);
  const textServiceId = getCanvasTextServiceId(canvas);
  const thumbnailImage = getThumbnailImage(canvas);
  const { id, width, height } = canvas;
  return {
    id,
    width,
    height,
    imageServiceId,
    hasRestrictedImage,
    label,
    textServiceId,
    thumbnailImage,
  };
}

export function transformCanvases(canvases: Canvas[]): TransformedCanvas[] {
  return canvases.map(canvas => transformCanvas(canvas));
}

export function groupStructures(
  items: TransformedCanvas[],
  structures: Range[]
): Range[] {
  const clonedStructures = cloneDeep(structures);
  return clonedStructures.reduce(
    (acc, structure) => {
      if (!structure.items) return acc;

      const [lastCanvasInRange] = structure.items.slice(-1);
      const [firstCanvasInRange] = structure.items;
      const firstCanvasIndex = items.findIndex(
        canvas => canvas.id === firstCanvasInRange.id
      );

      if (
        getEnFromInternationalString(acc.previousLabel) ===
          getEnFromInternationalString(structure.label) &&
        firstCanvasIndex === acc.previousLastCanvasIndex + 1
      ) {
        acc.groupedArray[acc.groupedArray.length - 1].items.push(
          lastCanvasInRange
        );
      } else if (structure.items.length > 0) {
        acc.groupedArray.push(structure);
      }
      acc.previousLabel = structure.label;
      acc.previousLastCanvasIndex = items.findIndex(
        canvas => canvas.id === lastCanvasInRange.id
      );
      return acc;
    },
    {
      previousLastCanvasIndex: null,
      previousLabel: { none: '' },
      groupedArray: [],
    }
  ).groupedArray;
}
