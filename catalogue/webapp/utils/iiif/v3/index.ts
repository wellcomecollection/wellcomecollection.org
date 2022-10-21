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

function getEnFromInternationalString(
  internationalString: InternationalString
): string {
  return internationalString?.['en']?.[0] || '';
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
  const transcript = manifest.rendering?.find(
    i => i?.['format'] === 'application/pdf'
  );

  return { title, sounds, thumbnail, transcript };
}

type Rendering = {
  id?: string;
  format?: string;
  label?: string | InternationalString;
}[];

export function getDownloadOptionsFromManifest(
  iiifManifest: Manifest
): DownloadOption[] {
  // The ContentResource type on the Manifest, which applies to the iiifManifest.rendering seems incorrect
  // Temporarily adding this until it is fixed.
  const rendering = (iiifManifest?.rendering as Rendering) || [];
  return (
    rendering
      .filter(({ id, format }) => {
        // I'm removing application/zip (for now?) as we haven't had these before
        // and the example I've seen is 404ing:
        // (Work) https://wellcomecollection.org/works/mg56yqa4 ->
        // (Catalogue response) https://api.wellcomecollection.org/catalogue/v2/works/mg56yqa4?include=items ->
        // (V3 Manifest) https://iiif.wellcomecollection.org/presentation/v3/b10326947
        // (rendering - application/zip) https://api.wellcomecollection.org/text/v1/b10326947.zip (returns 404)
        // For details of why we remove text/plain see https://github.com/wellcomecollection/wellcomecollection.org/issues/7592
        return id && format !== 'application/zipp' && format !== 'text/plain';
      })
      .map(({ id, format, label }) => {
        return {
          id,
          label: transformLabel(label) || 'Download file',
          format,
        } as DownloadOption;
      }) || []
  );
}
