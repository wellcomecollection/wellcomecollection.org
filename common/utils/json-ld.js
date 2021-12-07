import { convertImageUri } from './convert-image-uri';

export function objToJsonLd<T>(obj: T, type: string, root = true) {
  const jsonObj = JSON.parse(JSON.stringify(obj));
  const jsonLdAddition = root
    ? {
        '@context': 'http://schema.org',
        '@type': type,
      }
    : { '@type': type };
  return Object.assign({}, jsonObj, jsonLdAddition);
}

export function museumLd(museum) {
  const logo = imageLd(museum.logo);
  const newMuseum = Object.assign({}, museum, { logo });
  return objToJsonLd(newMuseum, 'Museum');
}

export function libraryLd(museum) {
  const logo = imageLd(museum.logo);
  const newMuseum = Object.assign({}, museum, { logo, image: logo });
  return objToJsonLd(newMuseum, 'Library');
}

export function breadcrumbsLd(breadcrumbs) {
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

export function webpageLd(url) {
  return objToJsonLd({ url }, 'WebPage');
}

function imageLd(image) {
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
