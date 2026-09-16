import {
  Annotation,
  AnnotationBody,
  AuthAccessService2,
  AuthAccessService2_Active as AuthAccessService2Active,
  AuthAccessService2_External as AuthAccessService2External,
  AuthAccessTokenService2,
  Canvas,
  ChoiceBody,
  Collection,
  CollectionItems,
  ContentResource,
  ImageService,
  InternationalString,
  Manifest,
  MetadataItem,
  Range,
  RangeItems,
  SearchService,
  Service,
  TechnicalProperties,
} from '@iiif/presentation-3';

import { pluralize } from '@weco/common/utils/grammar';
import { isNotUndefined, isString } from '@weco/common/utils/type-guards';
import {
  allowedManifestAccessRequirements,
  Auth,
  CustomContentResource,
  CustomSpecificationBehaviors,
  DownloadOption,
  IIIFItemProps,
  ItemsStatus,
  ManifestAccessRequirement,
  ServiceWithMetadata,
  TransformedCanvas,
} from '@weco/content/types/manifest';

import { getOriginal, getThumbnailImage } from './canvas';

/** Whether an item is a Choice, i.e. alternative representations to pick between. */
export const isChoiceBody = (
  item: IIIFItemProps | undefined
): item is ChoiceBody => {
  return Boolean(
    item && typeof item !== 'string' && 'type' in item && item.type === 'Choice'
  );
};

/**
 * The label distinguishing one part of a multi-volume work from another, e.g.
 * 'Copy 1' or 'Volume 1'. It can sit at either position in the label array,
 * with the item title in the other, so we pick whichever isn't the title.
 *
 * Interim: the label is expected to settle at the second position across all
 * manifests, at which point this function can go.
 */
export function getMultiVolumeLabel(
  internationalString: InternationalString,
  itemTitle: string
): string | undefined {
  const stringAtIndex1 = getPreferredDisplayLabel(internationalString, {
    index: 1,
  });
  const stringAtIndex0 = getPreferredDisplayLabel(internationalString, {
    index: 0,
  });

  return stringAtIndex1 === itemTitle ? stringAtIndex0 : stringAtIndex1;
}

/**
 * The label at `index`, preferring English. A label of '-' means "no label"
 * in our manifests and comes back undefined.
 */
export function getPreferredDisplayLabel(
  internationalString: InternationalString,
  indexProps?: { index: number }
): string | undefined {
  const index = indexProps?.index || 0;
  const label =
    internationalString?.en?.[index] || internationalString?.none?.[index];

  return label !== '-' ? label : undefined;
}

/** A label as a plain string, whether it arrives as one or as an international string. */
export function transformLabel(
  label: InternationalString | string | undefined
): string | undefined {
  if (typeof label === 'string' || label === undefined) return label;

  return getPreferredDisplayLabel(label);
}

/**
 * How to describe a work's contents in the UI, pluralised - "3 volumes",
 * "12 images", "5 PDF files". Anything mixed falls back to "file".
 */
export function getFileTypeLabel(
  collectionManifestsCount: number | undefined,
  canvasCount: number,
  hasNonStandardItems: boolean,
  canvases?: TransformedCanvas[]
): string {
  // If this is a multi-manifest collection, prefer volumes label
  if (collectionManifestsCount && collectionManifestsCount > 0)
    return pluralize(collectionManifestsCount, 'volume');

  // Check if all items are PDFs
  const allPdfs =
    canvases?.every(canvas => shouldTreatAsPDFCanvas(canvas)) || false;
  if (allPdfs) return pluralize(canvasCount, 'PDF file');

  // Non-standard items should be treated as generic files
  if (hasNonStandardItems) return pluralize(canvasCount, 'file');

  // Count distinct standard file types to detect mixed content
  const hasVideo = hasItemType(canvases, 'Video');
  const hasAudio =
    hasItemType(canvases, 'Sound') || hasItemType(canvases, 'Audio');
  const hasPdfs =
    canvases?.some(canvas => shouldTreatAsPDFCanvas(canvas)) || false;
  const hasImages = hasItemType(canvases, 'Image');

  const typeCount = [hasVideo, hasAudio, hasPdfs, hasImages].filter(
    Boolean
  ).length;

  // Mixed content -> generic 'file'
  if (typeCount > 1) return pluralize(canvasCount, 'file');

  // Single specific type
  if (hasVideo) return pluralize(canvasCount, 'video file');
  if (hasAudio) return pluralize(canvasCount, 'audio file');
  if (hasPdfs) return pluralize(canvasCount, 'PDF file');
  if (hasImages) return pluralize(canvasCount, 'image');

  return pluralize(canvasCount, 'image');
}

/** A rendering item reshaped into a download option, with a fallback label. */
function convertToDownloadOption(item: RenderingWithId): DownloadOption {
  return {
    id: item.id,
    label: transformLabel(item.label) || 'Download file',
    format: item.format || '',
  };
}

type Rendering = {
  id?: string;
  format?: string;
  label?: string | InternationalString;
};

// A download option's id is used as both its href and its dedupe key, so we
// only convert items that actually have one.
type RenderingWithId = Rendering & { id: string };

/** Download options with duplicate ids removed, keeping the first of each. */
export function deduplicateDownloadOptions(
  options: DownloadOption[]
): DownloadOption[] {
  const seen = new Set<string>();

  return options.filter(option => {
    if (seen.has(option.id)) return false;
    seen.add(option.id);
    return true;
  });
}

/** Whole-work downloads offered by a manifest, minus formats we don't serve. */
export function getDownloadOptionsFromManifestRendering(
  manifestRendering: Manifest['rendering']
): DownloadOption[] {
  // The ContentResource type on the Manifest, which applies to the iiifManifest.rendering seems incorrect
  // Temporarily adding this until it is fixed.
  const rendering = (manifestRendering as Rendering[]) || [];
  return rendering
    .filter((item): item is RenderingWithId => {
      const { id, format } = item;
      // Removing application/zip (for now?) as we haven't had these before
      // and the example I've seen is 404ing:
      // (Work) https://wellcomecollection.org/works/mg56yqa4 ->
      // (Catalogue response) https://api.wellcomecollection.org/catalogue/v2/works/mg56yqa4?include=items ->
      // (V3 Manifest) https://iiif.wellcomecollection.org/presentation/v3/b10326947
      // (rendering - application/zip) https://api.wellcomecollection.org/text/v1/b10326947.zip (returns 404)
      // For details of why we remove text/plain see https://github.com/wellcomecollection/wellcomecollection.org/issues/7592
      return (
        Boolean(id) && format !== 'application/zip' && format !== 'text/plain'
      );
    })
    .map(convertToDownloadOption);
}

/** Per-canvas downloads, flattening any choices into their alternatives. */
export function getDownloadOptionsFromCanvasRenderingAndSupplementing(
  canvas: TransformedCanvas
): DownloadOption[] {
  return [...canvas.rendering, ...canvas.supplementing]
    .flatMap(item => (isChoiceBody(item) ? item.items : [item]))
    .filter((item): item is ContentResource => typeof item !== 'string')
    .filter((item): item is ContentResource & { id: string } =>
      Boolean(item.id)
    )
    .map(convertToDownloadOption);
}

/** The canvases of a manifest, transformed for our own use. A collection has none of its own. */
export function getTransformedCanvases(
  iiifManifest: Manifest | Collection
): TransformedCanvas[] {
  if (isCollection(iiifManifest)) return [];
  const canvases = iiifManifest.items?.filter(
    canvas => canvas.type === 'Canvas'
  );

  return canvases?.map(transformCanvas) || [];
}

/** Every value of an international string joined into a single string, across all languages. */
export function getLabelString(
  label: InternationalString | null | undefined
): string | undefined {
  if (!label) {
    return label || undefined;
  } else {
    return Object.values(label).flat().join(' ');
  }
}

/** A canvas's label as a single string. */
function getCanvasLabel(canvas: Canvas): string | undefined {
  const label = canvas.label;
  return getLabelString(label);
}

/** The id of the annotation page holding a canvas's page text, used for search within. */
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

// Temporary types, as the provided AnnotationBody doesn't seem to be correct
type AnnotationPageBody = {
  service: BodyService;
};

/** The ImageService2 on an item, if it has one. */
export function getImageServiceFromItem(
  item: IIIFItemProps
): ImageService | undefined {
  if ('service' in item) {
    return item.service?.find(
      (s): s is ImageService => '@type' in s && s['@type'] === 'ImageService2'
    );
  }
}

/** The ImageService2 painted onto a canvas, dug out of its annotation bodies. */
function getImageServiceFromCanvas(canvas: Canvas): BodyService | undefined {
  const items = canvas?.items;
  const AnnotationPages = items?.[0].items;
  const AnnotationBodies = AnnotationPages?.map(
    annotationPage =>
      annotationPage.body as
        AnnotationPageBody | AnnotationPageBody[] | undefined
  ).flat();
  const BodiesServices = AnnotationBodies?.map(body => body?.service).flat();
  const imageService = BodiesServices?.find(
    service => service?.['@type'] === 'ImageService2'
  );
  return imageService;
}

/** An image service's id, which is the base URL for requesting image tiles. */
function getImageServiceId(
  imageService: BodyService | undefined
): string | undefined {
  return imageService?.['@id'];
}

// Temporary type until iiif3 types are correct
type BodyService = {
  '@id'?: string;
  '@type': string;
  service: Service | Service[];
};

/** The metadata entry with the given label, if the manifest has one. */
export function getIIIFMetadata(
  manifest: Manifest | Collection,
  label: string
): MetadataItem | undefined {
  return (manifest.metadata || []).find(
    data => getPreferredDisplayLabel(data.label) === label
  );
}
/**
 * The access conditions on a work, read from our access-control-hints
 * service. Falls back to ['Open'] when the manifest doesn't say.
 * @see https://github.com/wellcomecollection/platform/issues/5630
 */
export function getManifestAccessRequirements(
  manifest: Manifest | Collection
): ManifestAccessRequirement[] {
  const services = manifest.services || [];

  const accessControlHints = services.find(
    service =>
      service.profile ===
      'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints'
  ) as ServiceWithMetadata | undefined;

  if (accessControlHints?.metadata) {
    const labels = accessControlHints.metadata
      .map(item => getLabelString(item.label))
      .filter((label): label is ManifestAccessRequirement =>
        allowedManifestAccessRequirements.includes(
          label as ManifestAccessRequirement
        )
      );
    return labels.length > 0 ? labels : ['Open'];
  }

  return ['Open'];
}

/** The credit line from a manifest's 'Attribution and usage' metadata. */
export function getIIIFPresentationCredit(
  manifest: Manifest | Collection
): string | undefined {
  const attribution = getIIIFMetadata(manifest, 'Attribution and usage');
  const maybeValueWithBrTags =
    attribution?.value && getPreferredDisplayLabel(attribution.value);

  return maybeValueWithBrTags?.split('<br />')[0];
}

/** The search-within-this-item service, if the manifest offers one. */
export function getSearchService(
  manifest: Manifest | Collection
): SearchService | undefined {
  // The library's SearchService type doesn't declare the '@type' property,
  // but it is how Wellcome manifests identify their search service
  return manifest.service?.find(
    (service): service is SearchService =>
      '@type' in service && (service['@type'] as string) === 'SearchService1'
  );
}

/** The id of a collection's first manifest, e.g. volume one of a multi-volume work. */
export function getFirstCollectionManifestLocation(
  iiifManifest: Manifest | Collection
): string | undefined {
  if (isCollection(iiifManifest)) {
    return iiifManifest.items?.find(c => c.type === 'Manifest')?.id;
  }
}

/** Whether an item sits behind the restricted-login access service. */
export function isItemRestricted(
  item: ChoiceBody | ContentResource | CustomContentResource
): boolean {
  if (isChoiceBody(item)) return false;
  if (!('service' in item) || !item.service) return false;

  const itemsServices = item.service.map(s => {
    if ('type' in s && s.type === 'AuthProbeService2') {
      return s.service.find(service => service.type === 'AuthAccessService2');
    }
    return undefined;
  });

  return itemsServices.some(s => {
    return (
      s?.id ===
      'https://iiif.wellcomecollection.org/auth/v2/access/restrictedlogin'
    );
  });
}

/**
 * The probe service id for a painting, which the viewer calls to find out
 * whether the current user may see it. Undefined when it isn't restricted.
 */
export function getProbeServiceId(
  painting: ChoiceBody | ContentResource | CustomContentResource
): string | undefined {
  if (isChoiceBody(painting) || !('service' in painting) || !painting.service)
    return undefined;
  const probe = (painting.service as { type: string; id: string }[]).find(
    s => s.type === 'AuthProbeService2'
  );
  return probe?.id;
}

type AuthServices = {
  active?: TransformedAuthService;
  external?: TransformedAuthService;
};

/** The active and external access services already transformed onto a manifest. */
export function getAuthServices({
  auth,
}: {
  auth?: Auth;
}): AuthServices | undefined {
  return {
    active: auth?.activeAccessService,
    external: auth?.externalAccessService,
  };
}

/** The src for the hidden iframe that collects an access token, if there's a token service. */
export function getIframeTokenSrc({
  workId,
  origin,
  auth,
}: {
  workId: string;
  origin?: string;
  auth: Auth | undefined;
}): string | undefined {
  if (auth?.tokenService) {
    return `${auth.tokenService.id}?messageId=${workId}&origin=${origin}`;
  }
}

type checkModalParams = {
  userIsStaffWithRestricted: boolean;
  auth?: Auth;
};

/**
 * Whether to show the access modal before letting someone view an item.
 * Always for 'Open with advisory'; for restricted files unless the user is
 * staff with restricted access or the manifest also marks them as 'Open'.
 */
export function checkModalRequired(params: checkModalParams): boolean {
  const { userIsStaffWithRestricted, auth } = params;

  if (!auth?.accessRequirements?.length) {
    return false;
  }

  // Open with advisory always requires modal for clickthrough
  if (auth.accessRequirements.includes('Open with advisory')) {
    return true;
  }

  // Restricted files require modal unless user is staff, except if 'Open' is also present
  if (
    auth.accessRequirements.includes('Restricted files') &&
    !auth.accessRequirements.includes('Open')
  ) {
    return !userIsStaffWithRestricted;
  }

  // Open content doesn't need modal
  return false;
}

/** Every annotation across a set of annotation pages with the given motivation. */
export function getAnnotationsOfMotivation(
  items: Canvas['items'],
  motivation: TechnicalProperties['motivation']
): Annotation[] {
  return ((
    items?.map(annotationPage => {
      return annotationPage.items?.filter(
        item => item.motivation === motivation
      );
    }) || []
  ).flat() || []) as Annotation[];
}

/** An annotation's body as an array, whether it holds one, many or none. */
function convertAnnotationBodyToArray(
  annotationBody: Annotation['body']
): AnnotationBody[] {
  if (!annotationBody) return [];
  if (Array.isArray(annotationBody)) {
    return annotationBody;
  } else {
    return [annotationBody];
  }
}

/** The content of an annotation, dropping bodies that are bare string references. */
export function getDisplayData(
  annotation: Annotation
): (ChoiceBody | ContentResource)[] {
  const annotationBodyArray = convertAnnotationBodyToArray(annotation?.body);
  return annotationBodyArray
    ?.map(body => {
      if (typeof body === 'object' && 'type' in body) {
        return body;
      } else {
        return undefined;
      }
    })
    .filter(Boolean) as (ChoiceBody | ContentResource)[];
}

/**
 * A canvas reduced to what the viewer needs - label, thumbnail, image and
 * probe service ids, and its painting, original, rendering and supplementing
 * content separated out.
 */
export function transformCanvas(canvas: Canvas): TransformedCanvas {
  const label = getCanvasLabel(canvas);
  const textServiceId = getCanvasTextServiceId(canvas);
  const thumbnailImage = getThumbnailImage(canvas);
  const { id, type, width, height } = canvas; // TODO if/when we use IIIFItem to render images, we should get width/height from each painting

  // Resources associated with a Canvas by an Annotation that has the motivation value painting
  // must be presented to the user as the representation of the Canvas.
  // This is what we use for displayData.
  const paintings = getAnnotationsOfMotivation(canvas.items || [], 'painting');
  const painting = paintings.map(getDisplayData).flat();
  // A rendering item with a behavior value that includes 'original'
  // will be present when something is considered Born Digital, this is what we'll need
  // in order to offer a download of the original file.
  const original = getOriginal(canvas.rendering || []);
  // Resources associated with a Canvas by an Annotation that has the motivation value supplementing
  // may be presented to the user as part of the representation of the Canvas, or
  // may be presented in a different part of the user interface.
  // We need to do this for two reasons:
  // 1) to find the pdfs that are ingested via Goobi.
  // (N.B. pdfs ingested via Archivematica follow the Born Digital pattern)
  // 2) they can provide alternative content such as transcriptions for Videos
  const supplementings = getAnnotationsOfMotivation(
    canvas.annotations || [],
    'supplementing'
  );
  const supplementing = supplementings.map(getDisplayData).flat();

  const imageService = getImageServiceFromCanvas(canvas);
  const imageServiceId = getImageServiceId(imageService);
  const probeServiceId = painting.map(p => getProbeServiceId(p)).find(Boolean);

  return {
    id,
    type,
    width,
    height,
    imageServiceId,
    probeServiceId,
    label,
    textServiceId,
    thumbnailImage,
    painting,
    original,
    rendering: canvas.rendering || [],
    supplementing,
    metadata: canvas.metadata || [],
  };
}

/**
 * Ranges sharing a label across consecutive canvases merged into one, so a
 * contents list shows a single link per section instead of one per page.
 * Many older digitised works have a separate range per page.
 */
export function groupRanges(
  items: TransformedCanvas[],
  ranges: Range[]
): Range[] {
  return ranges.reduce(
    (acc, range) => {
      if (!range.items) return acc;

      const [lastCanvasInRange] = range.items.slice(-1);
      const [firstCanvasInRange] = range.items;
      const firstCanvasIndex = items.findIndex(
        canvas =>
          !isString(firstCanvasInRange) && canvas.id === firstCanvasInRange.id
      );

      if (
        getPreferredDisplayLabel(acc.previousLabel) ===
          getPreferredDisplayLabel(range.label) &&
        acc.previousLastCanvasIndex &&
        firstCanvasIndex === acc.previousLastCanvasIndex + 1
      ) {
        acc.groupedArray[acc.groupedArray.length - 1].items!.push(
          lastCanvasInRange
        );
      } else if (range.items.length > 0) {
        acc.groupedArray.push(range);
      }
      acc.previousLabel = range.label;
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

/** Whether an item of a range is a canvas rather than a nested range. */
export const isCanvas = (
  rangeItem: TransformedCanvas | RangeItems
): rangeItem is TransformedCanvas | Canvas => {
  return typeof rangeItem === 'object' && rangeItem.type === 'Canvas';
};

/** Whether an item of a range is itself a range. */
export const isRange = (
  rangeItem: TransformedCanvas | RangeItems
): rangeItem is Range => {
  return typeof rangeItem === 'object' && rangeItem.type === 'Range';
};

/** Whether a canvas has been through {@link transformCanvas} already. */
export const isTransformedCanvas = (
  canvas: TransformedCanvas | Canvas
): canvas is TransformedCanvas => {
  return Boolean(canvas && 'painting' in canvas);
};

/** Whether any canvas paints an item of the given type, looking inside choices. */
export function hasItemType(
  canvases: TransformedCanvas[] | undefined,
  type: string
): boolean {
  return (
    canvases?.some(canvas => {
      return canvas?.painting.some(item => {
        if (isChoiceBody(item)) {
          return item.items.some(item => {
            if (typeof item !== 'string') {
              return item.type === type;
            } else {
              return false;
            }
          });
        } else {
          return item.type === type;
        }
      });
    }) || false
  );
}

/** Whether any canvas has a PDF among its original files. */
export function hasOriginalPdf(canvases?: TransformedCanvas[]): boolean {
  return (
    canvases?.some(canvas => {
      return canvas?.original.some(item => {
        return 'format' in item && item.format === 'application/pdf';
      });
    }) || false
  );
}

/**
 * Whether a canvas should get PDF treatment in the UI (PDF viewer/download
 * rather than image/video) - true for a born-digital PDF original (even if
 * its painting is an Image preview), or a PDF supplement with no paintings.
 */
export function shouldTreatAsPDFCanvas(canvas?: TransformedCanvas): boolean {
  if (!canvas) return false;

  const hasPDFSupplement = canvas?.supplementing.some(supplement => {
    if (isChoiceBody(supplement)) {
      return supplement.items.some(item => {
        if (typeof item !== 'string')
          return 'format' in item ? item.format === 'application/pdf' : false;

        return false;
      });
    } else {
      return supplement && 'format' in supplement
        ? supplement.format === 'application/pdf'
        : false;
    }
  });

  const hasPaintings = canvas.painting?.length > 0;

  // 1. Born digital PDFs require a look at originals as their format is "Image"
  // 2. Because Videos could also have PDF supplements,
  //    we only want it to return true if it has no paintings.
  return hasOriginalPdf([canvas]) || (hasPDFSupplement && !hasPaintings);
}

/** Whether a canvas or item is audio. Our manifests use both 'Sound' and 'Audio'. */
export function isAudioCanvas(
  canvas?: TransformedCanvas | IIIFItemProps
): boolean {
  if (!canvas) return false;
  return canvas.type === 'Sound' || canvas.type === 'Audio';
}

/** Whether this is a collection rather than a single manifest, e.g. a multi-volume work. */
export function isCollection(
  manifest: Manifest | Collection
): manifest is Collection {
  return manifest.type === 'Collection';
}

// Skip anything under /presentation/[vN/]collections/ (genre, contributor and
// similar aggregations); they are never rendered, so fetching them is wasted work.
const aggregationCollectionPath = /\/presentation\/(v\d+\/)?collections\//;

/** The id of the manifest this one belongs to, ignoring aggregation collections. */
export function getParentManifestUrl(
  manifest: Manifest | Collection
): string | undefined {
  return manifest.partOf?.find(
    p => typeof p.id === 'string' && !aggregationCollectionPath.test(p.id)
  )?.id;
}

/**
 * The files to offer for download from a canvas, taking the first of these
 * that has anything: born-digital originals, rendering, painting,
 * supplementing. Supplementing catches PDFs added before the May 2023 DLCS
 * changes; after that date they follow the born-digital pattern and appear in
 * `original` instead.
 * @see https://github.com/wellcomecollection/docs/blob/main/rfcs/046-born-digital-iiif/README.md
 */
export function getOriginalFiles(
  canvas: TransformedCanvas
): (ContentResource | CustomContentResource | ChoiceBody)[] {
  const downloadData =
    canvas.original.length > 0
      ? canvas.original
      : canvas.rendering.length > 0
        ? canvas.rendering
        : canvas.painting.length > 0
          ? canvas.painting
          : canvas.supplementing;
  return downloadData || [];
}

/** A canvas's file size, if its metadata records one. */
export function getFileSize(canvas: TransformedCanvas): string | undefined {
  const fileSizeMeta = canvas.metadata.find(
    metadata => getLabelString(metadata.label) === 'File size'
  );
  return fileSizeMeta ? getLabelString(fileSizeMeta.value) : undefined;
}

/**
 * Every manifest within a collection, flattening any nested collections.
 * A manifest has no child manifests, so returns an empty array for one.
 */
export function getCollectionManifests(
  manifest: Manifest | Collection
): CollectionItems[] {
  if (manifest.type === 'Collection') {
    return manifest.items.flatMap(item =>
      item.type === 'Manifest' ? item : getCollectionManifests(item)
    );
  } else {
    return [];
  }
}

/**
 * Whether a manifest holds only standard IIIF content (images, audio, video),
 * only non-standard content (anything else - text streams, binary documents,
 * marked with a 'placeholder' behaviour), or a mix. The viewer needs a
 * different interface for each.
 * @see https://github.com/wellcomecollection/docs/tree/main/rfcs/046-born-digital-iiif
 */
export function getItemsStatus(manifest: Manifest | Collection): ItemsStatus {
  const hasStandard = manifest?.items.some(canvas => {
    const behavior = canvas?.behavior as
      CustomSpecificationBehaviors[] | undefined;
    return !behavior?.includes('placeholder');
  });

  const hasNonStandard = manifest?.items.some(canvas => {
    const behavior = canvas?.behavior as
      CustomSpecificationBehaviors[] | undefined;
    return behavior?.includes('placeholder');
  });

  if (!hasStandard && hasNonStandard) {
    return 'noStandard';
  } else if (hasStandard && hasNonStandard) {
    return 'mixedStandardAndNonStandard';
  } else {
    return 'allStandard';
  }
}

/**
 * Whether any canvas holds something other than a plain image - audio, video,
 * a PDF, or an original file to download. An image-only work gets a simpler
 * viewer interface.
 *
 * Items can report a type of Image and still be non-standard - see
 * https://wellcomecollection.org/works/c4ujea53/items and its manifest
 * https://iiif.wellcomecollection.org/presentation/PPDBL/A/1/41. Those are
 * caught by the original-files check rather than the type check.
 */
export function hasNonImagesOrOriginals(
  canvases: TransformedCanvas[] | undefined
): boolean {
  const isNonImage = (p: ChoiceBody | ContentResource) => p.type !== 'Image';
  const hasNonImage = canvases?.some(c => {
    return (
      c.rendering.some(isNonImage) ||
      c.painting.some(isNonImage) ||
      c.supplementing.some(isNonImage) ||
      c.original.length > 0
    );
  });
  return !!hasNonImage;
}

/** A manifest's ranges, i.e. its table of contents. A collection has none. */
export function getStructures(manifest: Manifest | Collection): Range[] {
  if (isCollection(manifest)) {
    return [];
  } else {
    return manifest.structures || [];
  }
}

/**
 * The Auth 2 access services on a manifest.
 * @see https://iiif.io/api/auth/2.0/#access-service-description
 */
export function getAuthAccessServices(
  manifest: Manifest | Collection
): AuthAccessService2[] {
  return (manifest.services || []).filter(
    (s): s is AuthAccessService2 =>
      'type' in s && s.type === 'AuthAccessService2'
  );
}

/**
 * The access service for content held outside the viewer, e.g. available only
 * in the library.
 * @see https://iiif.io/api/auth/2.0/#external-interaction-pattern
 */
export function getExternalAuthAccessService(
  services: AuthAccessService2[]
): AuthAccessService2External | undefined {
  return services.find(s => s.profile === 'external') as
    AuthAccessService2External | undefined;
}

// Docs (https://iiif.io/api/auth/2.0/#profile) say the profile value should be active, but before the Auth 2 spec was finalised the value was interactive and we have still have manifests with this value. N.B. the values will update if the manifest is regenerated.
type AuthAccessService2WithInteractiveProfile = Omit<
  AuthAccessService2Active,
  'profile'
> & {
  profile: AuthAccessService2['profile'] | 'interactive';
};

/**
 * The access service the user can act on, i.e. log in to.
 * @see https://iiif.io/api/auth/2.0/#active-interaction-pattern
 */
export function getActiveAuthAccessService(
  services: AuthAccessService2WithInteractiveProfile[]
): AuthAccessService2WithInteractiveProfile | undefined {
  return services.find(
    s => s.profile === 'active' || s.profile === 'interactive'
  ) as AuthAccessService2WithInteractiveProfile | undefined;
}

/**
 * The token service nested inside an access service, which exchanges a login
 * for a token the viewer can send with image requests. Handles both a single
 * service and an array: it's unclear whether v2 allows both, but v1 token
 * services needed the check, so it's here to be safe.
 * @see https://iiif.io/api/auth/2.0/#access-token-service-description
 */
export function getV2TokenService(
  accessService: AuthAccessService2 | undefined
): AuthAccessTokenService2 | undefined {
  const authServiceArray = Array.isArray(accessService?.service)
    ? accessService?.service
    : [accessService?.service];
  return authServiceArray.find(s => s?.type === 'AuthAccessTokenService2') as
    AuthAccessTokenService2 | undefined;
}

export type TransformedAuthService = {
  id: string;
  label?: string;
  description?: string;
};

/** An external access service reduced to the id, label and note the UI shows. */
export function transformExternalAccessService(
  service:
    | (AuthAccessService2External & { note?: InternationalString }) // We can have a note on this type in the manifest
    | undefined
): TransformedAuthService | undefined {
  if (!service) return;
  return {
    id: service.id,
    label: getLabelString(service.label),
    description: getLabelString(service.note),
  };
}

/** An active access service reduced to the id, label and note the UI shows. */
export function transformActiveAccessService(
  service: AuthAccessService2WithInteractiveProfile | undefined
): TransformedAuthService | undefined {
  if (!service) return;
  return {
    id: service.id,
    label: getLabelString(service.label),
    description: getLabelString(service.note),
  };
}

/** A token service reduced to its id. */
export function transformTokenService(
  service: AuthAccessTokenService2 | undefined
): TransformedAuthService | undefined {
  if (!service) return;
  return {
    id: service.id,
  };
}

/** Download options for the video and audio painted on a canvas. */
export const getVideoAudioDownloadOptions = (canvas?: TransformedCanvas) => {
  if (!canvas || !canvas?.painting) return [];

  const formatItemInfo = (item: IIIFItemProps): DownloadOption => ({
    format: ('format' in item && item.format) || '',
    id: ('id' in item && item.id) || '',
    label:
      item.type === 'Video'
        ? 'This video'
        : isAudioCanvas(item)
          ? 'This audio'
          : '',
  });

  const finalOptions: (DownloadOption | undefined)[] = [];

  if (canvas?.painting?.some(painting => isChoiceBody(painting))) {
    canvas.painting
      .filter(painting => isChoiceBody(painting))
      .forEach(({ items }) => {
        items.forEach(item => {
          const externalResourceItem = item as IIIFItemProps;

          if (
            externalResourceItem.type !== 'Video' &&
            !isAudioCanvas(externalResourceItem)
          )
            return undefined;

          finalOptions.push(formatItemInfo(externalResourceItem));
        });
      });
  } else {
    canvas.painting.forEach(item => {
      if (item.type !== 'Video' && !isAudioCanvas(item)) return undefined;

      finalOptions.push(formatItemInfo(item));
    });
  }

  return finalOptions.flat().filter(Boolean).filter(isNotUndefined) || [];
};

/** Whether any of a canvas's painting, original or supplementing items is restricted. */
export function hasRestrictedItem(canvas: TransformedCanvas): boolean {
  return (
    (canvas.painting?.some(item => isItemRestricted(item)) ?? false) ||
    (canvas.original?.some(original => isItemRestricted(original)) ?? false) ||
    (canvas.supplementing?.some(supp => isItemRestricted(supp)) ?? false)
  );
}
