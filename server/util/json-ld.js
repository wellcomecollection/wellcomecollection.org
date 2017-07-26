import {wellcomeCollection} from '../model/organization';

export function objToJsonLd<T>(obj: T, type: string, root: boolean = true) {
  const jsonObj = JSON.parse(JSON.stringify(obj));
  const jsonLdAddition = root ? {
    '@context': 'http://schema.org',
    '@type': type
  } : { '@type': type };
  return Object.assign({}, jsonObj, jsonLdAddition);
}

export function contentLd(content) {
  return objToJsonLd({
    headline: content.headline,
    author: content.author && personLd(content.author),
    image: imageLd(content.thumbnail),
    datePublished: content.datePublished,
    dateModified: content.datePublished,
    publisher: orgLd(wellcomeCollection)
  }, 'Article');
}

export function museumLd(museum) {
  const openingHoursSpecification = museum.openingHoursSpecification.map(ohs => {
    return {
      dayOfWeek: ohs.dayOfWeek,
      closes: ohs.closes,
      opens: ohs.opens
    };
  });
  const newMuseum = Object.assign({}, museum, {openingHoursSpecification, logo: imageLd(museum.logo)});
  delete newMuseum.twitterHandle;
  return objToJsonLd(newMuseum, 'Museum');
}

function orgLd(org) {
  return org && objToJsonLd({
    name: org.name,
    url: org.url,
    logo: imageLd(org.logo),
    sameAs: org.sameAs
  }, 'Organization');
}

function personLd(person) {
  return person && objToJsonLd({
    name: person.name,
    description: person.description,
    image: person.image
  }, 'Person');
}

function imageLd(image) {
  return image && objToJsonLd({
    url: image.contentUrl || image.url,
    width: image.width,
    height: image.height
  }, 'ImageObject');
}
