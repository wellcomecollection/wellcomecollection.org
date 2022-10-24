import {
  AuthService,
  AuthServiceService,
} from '../../../services/iiif/types/manifest/v2';
import { Audio } from '../../../services/iiif/types/manifest/v3';
import {
  ContentResource,
  IIIFExternalWebResource,
  InternationalString,
  Manifest,
  MetadataItem,
  Service,
} from '@iiif/presentation-3';
import { isNotUndefined } from '@weco/common/utils/array';

function getEnFromInternationalString(
  internationalString: InternationalString
): string {
  return internationalString?.['en']?.[0] || '';
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

export function getTitle(label: InternationalString | string): string {
  if (typeof label === 'string') return label;

  return getEnFromInternationalString(label);
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
