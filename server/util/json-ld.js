// @flow
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
    author: personLd(content.author),
    image: imageLd(content.thumbnail),
    datePublished: content.datePublished,
    dateModified: content.datePublished,
    publisher: museumLd(wellcomeCollection)
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
  const newOrg = Object.assign({}, museum, {openingHoursSpecification});
  delete newOrg.twitterHandle;
  return objToJsonLd(newOrg, 'Museum');
}

function personLd(person) {
  return objToJsonLd({
    name: person.name,
    description: person.description,
    image: person.image
  }, 'Person');
}

function imageLd(image) {
  return objToJsonLd({
    url: image.contentUrl,
    width: image.width,
    height: image.height
  }, 'ImageObject');
}

function openingHoursLd(oh) {

}

