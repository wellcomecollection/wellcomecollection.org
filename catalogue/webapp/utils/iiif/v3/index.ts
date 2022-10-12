import {
  AudioV3,
  AuthService,
  AuthServiceService,
} from '../../../services/iiif/types/manifest/v2'; // TODO move model to v2 and v3 folders
import {
  ContentResource,
  IIIFExternalWebResource,
  Manifest,
  Service as ServiceV3,
} from '@iiif/presentation-3';
import { isNotUndefined } from '@weco/common/utils/array';

export function getTokenServiceV3( // TODO rename - lose V3
  authServiceId: string,
  services?: ServiceV3[] // TODO rename - lose V3
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

export function getAudioV3(manifest: Manifest): AudioV3 {
  // TODO rename just audio Audio
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
