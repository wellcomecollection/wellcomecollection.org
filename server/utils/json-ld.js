import type {EventPromo, Event} from '../content-model/events';
import {wellcomeCollection, wellcomeCollectionAddress} from '../../common/model/organization';
import {convertImageUri} from '../filters/convert-image-uri';

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
    author: (content.author && content.author.map(a => a.person).map(personLd)) || 'unknown',
    image: content.promo && imageLd(content.promo.image),
    datePublished: content.datePublished,
    dateModified: content.datePublished,
    publisher: orgLd(wellcomeCollection),
    mainEntityOfPage: `https://wellcomecollection.org${content.url}`
  }, 'Article');
}

export function exhibitionLd(exhibition) {
  return objToJsonLd({
    name: exhibition.title,
    description: exhibition.safeDescription.val,
    image: exhibition.featuredImage && convertImageUri(exhibition.featuredImage.contentUrl, 1920, false),
    location: {
      '@type': 'Place',
      name: 'Wellcome Collection',
      address: objToJsonLd(wellcomeCollectionAddress, 'PostalAddress', false)
    },
    startDate: exhibition.start,
    endDate: exhibition.end,
    url: `https://wellcomecollection.org/exhibitions/${exhibition.id}`,
    isAccessibleForFree: true
  }, 'ExhibitionEvent');
}

export function exhibitionPromoLd(exhibitionPromo) {
  return objToJsonLd({
    name: exhibitionPromo.title,
    description: exhibitionPromo.description,
    image: exhibitionPromo.image.contentUrl && convertImageUri(exhibitionPromo.image.contentUrl, 1920, false),
    location: {
      '@type': 'Place',
      name: 'Wellcome Collection',
      address: objToJsonLd(wellcomeCollectionAddress, 'PostalAddress', false)
    },
    startDate: exhibitionPromo.start,
    endDate: exhibitionPromo.end,
    url: `https://wellcomecollection.org/exhibitions/${exhibitionPromo.id}`,
    isAccessibleForFree: true
  }, 'ExhibitionEvent');
}

export function workLd(content) {
  const creators = content.creators.map(c => {
    return {
      '@type': 'Person',
      name: c.label
    };
  });

  const keywords = content.subjects.map(s => s.label)
    .join(',');

  return objToJsonLd({
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
    thumbnailUrl: content.thumbnail && content.thumbnail.url,
    license: content.thumbnail && content.thumbnail.license.url
  }, 'CreativeWork');
}

export function museumLd(museum) {
  const logo = imageLd(museum.logo);
  const newMuseum = Object.assign({}, museum, {logo});
  delete newMuseum.twitterHandle;
  return objToJsonLd(newMuseum, 'Museum');
}

export function eventLd(event: Event) {
  return event.times.map(eventTime => {
    // I don't like it, but mutation seems the easiest way here >.<
    const eventWith1Time = Object.assign({}, event);
    eventWith1Time.times = [eventTime];
    return eventWith1Time;
  }).map(event => {
    return objToJsonLd({
      name: event.title,
      // TODO: This is not always at Wellcome, but we don't collect that yet
      location: {
        '@type': 'Place',
        name: 'Wellcome Collection',
        address: objToJsonLd(wellcomeCollectionAddress, 'PostalAddress', false)
      },
      startDate: event.times.map(time => time.range.startDateTime),
      endDate: event.times.map(time => time.range.endDateTime),
      description: event.description,
      image: event.promo && event.promo.image && convertImageUri(event.promo.image.contentUrl, 1920, false)
    }, 'Event');
  });
}

export function eventPromoLd(eventPromo: EventPromo) {
  return objToJsonLd({
    name: eventPromo.title,
    location: {
      '@type': 'Place',
      name: 'Wellcome Collection',
      address: objToJsonLd(wellcomeCollectionAddress, 'PostalAddress', false)
    },
    startDate: eventPromo.start,
    endDate: eventPromo.end,
    description: eventPromo.description,
    image: eventPromo && convertImageUri(eventPromo.image.contentUrl, 1920, false)
  }, 'Event');
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
    url: convertImageUri(image.contentUrl || image.url, 1200),
    width: image.width,
    height: image.height
  }, 'ImageObject');
}
