import { convertImageUri } from './convert-image-uri';
import { Organization } from '../model/organization';
import { BreadcrumbItems } from '../model/breadcrumbs';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';

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

export function museumLd(museum: Organization): JsonLdObj {
  return objToJsonLd(
    {
      ...museum,
      logo: imageLd(museum.logo),
    },
    'Museum'
  );
}

export function libraryLd(library: Organization) {
  return objToJsonLd(
    {
      ...library,
      logo: imageLd(library.logo),
    },
    'Library'
  );
}

export function breadcrumbsLd(breadcrumbs: BreadcrumbItems) {
  return objToJsonLd(
    {
      itemListElement: breadcrumbs.items.map(({ url, text }, i) => {
        return objToJsonLd(
          {
            position: i,
            name: text,
            item: `https://wellcomecollection.org${url}`,
          },
          'ListItem',
          false
        );
      }),
    },
    'BreadcrumbList'
  );
}

type WebpageProps = {
  url: string;
};

export function webpageLd(url: WebpageProps) {
  return objToJsonLd({ url }, 'WebPage');
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
