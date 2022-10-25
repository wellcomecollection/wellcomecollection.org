import {
  AuthService,
  AuthServiceService,
} from '../../../services/iiif/types/manifest/v2';
import { Audio, Video } from '../../../services/iiif/types/manifest/v3';
import {
  AnnotationBody,
  ChoiceBody,
  ContentResource,
  ExternalWebResource,
  IIIFExternalWebResource,
  InternationalString,
  Manifest,
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
