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

export function workLd(content) {
  const creators = (content.creators || []).map(c => {
    return {
      '@type': 'Person',
      name: c.label,
    };
  });

  const keywords = content.subjects.map(s => s.label).join(',');

  return objToJsonLd(
    {
      additionalType: null, // TODO: needs API
      locationCreated: null, // TODO: needs API
      genre: null, // TODO: needs API
      datePublished: null, // TODO: needs API
      dateCreated: null, // TODO: needs API
      dateModified: null, // TODO: needs API
      alternativeHeadline: null, // TODO: needs API
      publishedBy: null, // TODO: needs API
      creator: creators,
      keywords: keywords,
      name: content.title,
      description: content.description,
      image: content.imgLink,
      thumbnailUrl: content?.thumbnail?.url,
      license: content?.thumbnail?.license?.url,
    },
    'CreativeWork'
  );
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

function orgLd(org) {
  return (
    org &&
    objToJsonLd(
      {
        name: org.name,
        url: org.url,
        logo: imageLd(org.logo),
        sameAs: org.sameAs,
      },
      'Organization'
    )
  );
}

function personLd(person) {
  return (
    person &&
    objToJsonLd(
      {
        name: person.name,
        description: person.description,
        image: person.image,
      },
      'Person'
    )
  );
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
