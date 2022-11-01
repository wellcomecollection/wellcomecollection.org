import {
  AuthService,
  AuthServiceService,
} from '../../../services/iiif/types/manifest/v2'; // TODO v3
import { Audio } from '../../../services/iiif/types/manifest/v3';
import {
  ContentResource,
  IIIFExternalWebResource,
  Manifest,
  Service,
  InternationalString,
} from '@iiif/presentation-3';
import { isNotUndefined } from '@weco/common/utils/array';
import { DownloadOption } from '../../../types/manifest';

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

export function getEnFromInternationalString(
  internationalString: InternationalString,
  index = 0
): string {
  return internationalString?.['en']?.[index] || '';
}

export function transformLabel(
  label: InternationalString | string | undefined
): string | undefined {
  if (typeof label === 'string' || label === undefined) return label;

  return getEnFromInternationalString(label);
}

export function getTokenService(
  authServiceId: string,
  services?: Service[]
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

export function getAudio(manifest: Manifest): Audio {
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
  // Temporarily using Rendering this until it is fixed.
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

export function getTitle(label: InternationalString | string): string {
  if (typeof label === 'string') return label;

  return getEnFromInternationalString(label);
}

export function getSearchService(
  manifest: Manifest | undefined
): Service | undefined {
  const searchService = manifest?.service?.find(
    service => service['@type'] === 'SearchService1'
  );
  return searchService || undefined;
}
