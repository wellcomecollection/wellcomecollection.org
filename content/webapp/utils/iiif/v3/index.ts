import { Audio, Video } from '@weco/content/services/iiif/types/manifest/v3';
import {
  BornDigitalStatus,
  DownloadOption,
  TransformedCanvas,
  AuthClickThroughServiceWithPossibleServiceArray,
} from '@weco/content/types/manifest';
import {
  AnnotationPage,
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
  SpecificationBehaviors,
} from '@iiif/presentation-3';
import { isNotUndefined, isString } from '@weco/common/utils/type-guards';
import { getThumbnailImage } from './canvas';

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
): string | undefined {
  const stringAtIndex1 = getEnFromInternationalString(internationalString, {
    index: 1,
  });
  const stringAtIndex0 = getEnFromInternationalString(internationalString, {
    index: 0,
  });

  return stringAtIndex1 === itemTitle ? stringAtIndex0 : stringAtIndex1;
}

// TODO: rename this to something like getDisplayLabel since the key of interest
// can be either 'en' or 'none'
export function getEnFromInternationalString(
  internationalString: InternationalString,
  indexProps?: { index: number }
): string | undefined {
  const index = indexProps?.index || 0;
  const label =
    internationalString?.en?.[index] || internationalString?.none?.[index];

  return label !== '-' ? label : undefined;
}

export function transformLabel(
  label: InternationalString | string | undefined
): string | undefined {
  if (typeof label === 'string' || label === undefined) return label;

  return getEnFromInternationalString(label);
}

// It appears that iiif-manifests for born digital items can exist without the items property
// e.g. https://iiif.wellcomecollection.org/presentation/collections/archives/SA/SRH/B/41/2
// I'm not sure this should be the case, but am doing this temporarily so works/items pages won't error/break
export type BornDigitalManifest = Omit<Manifest, 'items'> & {
  items?: Canvas[];
};

export function getAudio(manifest: Manifest | BornDigitalManifest): Audio {
  const canvases = manifest.items?.filter(item => item.type === 'Canvas');
  const firstEnCanvas = canvases?.find(c => c?.label?.en);
  const title = firstEnCanvas?.label
    ? getEnFromInternationalString(firstEnCanvas.label)
    : '';
  const audioTypes = ['Audio', 'Sound'];
  const sounds =
    (canvases
      ?.map(c => {
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
    }[]) || [];

  const placeholderCanvasItems = manifest.placeholderCanvas?.items?.find(
    i => i.type === 'AnnotationPage'
  );
  const placeholderCanvasAnnotation = placeholderCanvasItems?.items?.find(
    i => i.type === 'Annotation'
  );
  const thumbnail = placeholderCanvasAnnotation?.body as ContentResource;
  const transcript = manifest.rendering?.find(
    i => i?.['format'] === 'application/pdf' //eslint-disable-line
  );

  return { title, sounds, thumbnail, transcript };
}

type Rendering = {
  id?: string;
  format?: string;
  label?: string | InternationalString;
};

export function getDownloadOptionsFromManifest(
  iiifManifest: Manifest
): DownloadOption[] {
  // The ContentResource type on the Manifest, which applies to the iiifManifest.rendering seems incorrect
  // Temporarily adding this until it is fixed.
  const rendering = (iiifManifest.rendering as Rendering[]) || [];
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
  iiifManifest: Manifest | BornDigitalManifest
): DownloadOption | undefined {
  // There are two different ways to find PDFs in a manifest:
  //
  //    - Before the DLCS image server upgrades in May 2023, the manifests has
  //      PDF resources at `items[0].annotations[0].items[0].body`
  //    - After the DLCS image server upgrades, new manifests will have the
  //      PDFs at `items[0].rendering[0]`.
  //
  // See discussion here: https://wellcome.slack.com/archives/CBT40CMKQ/p1683121718005049
  //
  const renderingFromItem = iiifManifest.items
    ?.flatMap(item => item.rendering)
    .filter(isNotUndefined)
    .find(r => r.type === 'Text' && r.format === 'application/pdf');

  const renderingFromAnnotations = iiifManifest.items
    ?.flatMap(item => item.annotations)
    .flatMap(annotation => annotation?.items)
    .filter(isNotUndefined)
    .map(
      item => (Array.isArray(item.body) ? item.body[0] : item.body) as Rendering
    )
    .find(body => body?.format === 'application/pdf');

  const rendering = renderingFromItem || renderingFromAnnotations || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id, label, format } = rendering as any;

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

  return getEnFromInternationalString(label) || '';
}

export function getTransformedCanvases(
  iiifManifest: Manifest
): TransformedCanvas[] {
  const canvases = iiifManifest.items?.filter(
    canvas => canvas.type === 'Canvas'
  );

  return canvases?.map(transformCanvas) || [];
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
  return Array.isArray(imageService?.service)
    ? imageService?.service?.find(s => s['@type'] === 'AuthCookieService1')
    : imageService?.service?.['@type'] === 'AuthCookieService1'
    ? imageService?.service
    : undefined;
}

// We don't know at the top-level of a manifest whether any of the canvases contain images that are open access.
// The top-level only holds information about whether the item contains _any_ images with an authService.
// N.B. this will be changed in the future: https://github.com/wellcomecollection/platform/issues/5630
// Individual images hold information about their own authService (if it has one).
// So we check if any canvas _doesn't_ have an authService, and treat the whole item as open access if that's the case.
// This allows us to determine whether or not to show the viewer at all.
// N.B. the individual items within the viewer won't display if they are restricted.
export function checkIsAnyImageOpen(
  transformedCanvases: TransformedCanvas[]
): boolean {
  return transformedCanvases.some(canvas => !canvas.hasRestrictedImage);
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
  manifest: Manifest
): string | undefined {
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

export function getVideo(manifest: Manifest): Video | undefined {
  const body = manifest.items?.[0]?.items?.[0]?.items?.[0]?.body;

  const videoChoiceBody = getChoiceBody(body);

  // A video can appear in the "body" in two ways:
  //
  //    - As a ChoiceBody with multiple items, for example if the video is
  //      available in multiple formats or resolutions.
  //    - As an ExternalWebResource with type "Video", if the video is only
  //      available in a single format/resolution.
  //
  // See the test cases for this function for examples of both.
  const maybeVideo = videoChoiceBody
    ? getExternalWebResourceBody(videoChoiceBody.items?.[0])
    : getExternalWebResourceBody(body);

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

export function getSearchService(manifest: Manifest): Service | undefined {
  return manifest.service?.find(
    service => service?.['@type'] === 'SearchService1'
  );
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
  manifest: Manifest
): AuthClickThroughServiceWithPossibleServiceArray | undefined {
  return manifest.services?.find(
    s => s.profile === 'http://iiif.io/api/auth/1/clickthrough'
  ) as AuthClickThroughServiceWithPossibleServiceArray | undefined;
}

const restrictedAuthServiceUrls = [
  'https://iiif.wellcomecollection.org/auth/restrictedlogin',
  'https://iiif-test.wellcomecollection.org/auth/restrictedlogin',
];

function isImageRestricted(canvas: Canvas): boolean {
  const imageService = getImageService(canvas);
  const imageAuthCookieService = getImageAuthCookieService(imageService);
  return restrictedAuthServiceUrls.some(
    url => imageAuthCookieService?.['@id'] === url
  );
}

export function getRestrictedLoginService(
  manifest: Manifest
): AuthExternalService | undefined {
  return manifest.services?.find(service => {
    const typedService = service as AuthExternalService;
    return restrictedAuthServiceUrls.some(url => typedService['@id'] === url);
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

export function groupStructures(
  items: TransformedCanvas[],
  structures: Range[]
): Range[] {
  return structures.reduce(
    (acc, structure) => {
      if (!structure.items) return acc;

      const [lastCanvasInRange] = structure.items.slice(-1);
      const [firstCanvasInRange] = structure.items;
      const firstCanvasIndex = items.findIndex(
        canvas =>
          !isString(firstCanvasInRange) && canvas.id === firstCanvasInRange.id
      );

      if (
        getEnFromInternationalString(acc.previousLabel) ===
          getEnFromInternationalString(structure.label) &&
        acc.previousLastCanvasIndex &&
        firstCanvasIndex === acc.previousLastCanvasIndex + 1
      ) {
        // We know this is okay because we'll only enter this branch if
        // `previousLastCanvasIndex` is defined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        acc.groupedArray[acc.groupedArray.length - 1].items!.push(
          lastCanvasInRange
        );
      } else if (structure.items.length > 0) {
        acc.groupedArray.push(structure);
      }
      acc.previousLabel = structure.label;
      acc.previousLastCanvasIndex = items.findIndex(
        canvas =>
          !isString(lastCanvasInRange) && canvas.id === lastCanvasInRange.id
      );
      return acc;
    },
    {
      previousLastCanvasIndex: null,
      previousLabel: { none: [''] },
      groupedArray: [],
    } as {
      previousLastCanvasIndex: number | null;
      previousLabel: InternationalString;
      groupedArray: Range[];
    }
  ).groupedArray;
}

export function getCollectionManifests(manifest: Manifest): Canvas[] {
  const firstLevelManifests =
    manifest.items?.filter(c => c.type === 'Manifest') || [];
  const collections =
    manifest.items?.filter(c => c.type === 'Collection') || [];
  const collectionManifests = collections
    .map(collection => {
      return (
        collection.items?.filter(
          c => c.type === ('Manifest' as AnnotationPage & { type: 'Manifest' })
        ) || []
      );
    })
    .flat();
  return [...firstLevelManifests, ...collectionManifests] as Canvas[];
}

type CustomSpecificationBehaviors = SpecificationBehaviors | 'placeholder';
// Whether something is born digital or not is determined at the canvas level within a iiifManifest
// It is therefore possible to have a iiifManifest that contains:
// - only born digital items
// - no born digital items
// - a mix of the two.
// We need to know which we have to determine the required UI.
export function getBornDigitalStatus(manifest: Manifest): BornDigitalStatus {
  const hasBornDigital = manifest?.items.some(canvas => {
    const behavior = canvas?.behavior as
      | CustomSpecificationBehaviors[]
      | undefined;
    return behavior?.includes('placeholder') || false;
  });

  const hasNonBornDigital = manifest?.items.some(canvas => {
    const behavior = canvas?.behavior as
      | CustomSpecificationBehaviors[]
      | undefined;
    return !behavior?.includes('placeholder') || false;
  });

  if (hasBornDigital && !hasNonBornDigital) {
    return 'allBornDigital';
  } else if (hasBornDigital && hasNonBornDigital) {
    return 'mixedBornDigital';
  } else {
    return 'noBornDigital';
  }
}
