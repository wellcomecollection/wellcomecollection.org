import { convertImageUri } from './convert-image-uri';
import { Organization } from '@weco/common/model/organization';

export function objToJsonLd<T>(obj: T, type: string, root = true) {
  const jsonObj = JSON.parse(JSON.stringify(obj));
  const jsonLdAddition = root
    ? {
        '@context': 'http://schema.org',
        '@type': type,
      }
    : { '@type': type };
  return { ...jsonObj, ...jsonLdAddition };
}

export function museumLd(museum: Organization) {
  return objToJsonLd(
    {
      ...museum,
      ...imageLd(museum.logo),
    },
    'Museum'
  );
}

export function libraryLd(library: Organization) {
  return objToJsonLd(
    {
      ...library,
      ...imageLd(library.logo),
    },
    'Library'
  );
}

type Image = {
  contentUrl?: string;
  url?: string;
  width?: number;
  height?: number;
};

function imageLd(image: Image) {
  return (
    image &&
    objToJsonLd(
      {
        url: convertImageUri(image.contentUrl || image.url, 1200),
        width: image.width,
        height: image.height,
      },
      'ImageObject'
    )
  );
}
