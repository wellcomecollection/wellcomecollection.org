// @flow
import Prismic from 'prismic-javascript';
import {getDocument, getDocuments} from './api';
import {
  parseTimestamp,
  parseGenericFields
} from './parsers';
import type {Page} from '../../model/pages';
import type {PrismicDocument} from './types';
import {pagesFields, eventSeriesFields} from './fetch-links';

export function parsePage(document: PrismicDocument): Page {
  const {data} = document;
  const genericFields = parseGenericFields(document);

  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  const siteSection = document.tags
    .filter(tag => ['visit-us', 'what-we-do'].indexOf(tag) !== -1)[0];

  // TODO: (drupal migration) Just deal with normal promo once we deprecate the
  // drupal stuff
  const promo = genericFields.promo;
  const drupalPromoImage = data.drupalPromoImage && data.drupalPromoImage.url ? data.drupalPromoImage : null;
  const drupalisedPromo = drupalPromoImage ? {
    caption: promo && promo.caption,
    image: {
      contentUrl: data.drupalPromoImage.url,
      width: data.drupalPromoImage.width,
      height: data.drupalPromoImage.height
    }
  } : null;

  return {
    type: 'pages',
    ...genericFields,
    promo: promo || drupalisedPromo,
    datePublished: data.datePublished && parseTimestamp(data.datePublished),
    siteSection: siteSection,
    drupalPromoImage: drupalPromoImage,
    drupalNid: data.drupalNid,
    drupalPath: data.drupalPath
  };
}

export async function getPage(req: ?Request, id: string): Promise<?Page> {
  const page = await getDocument(req, id, {
    fetchLinks: pagesFields.concat(eventSeriesFields)
  });

  if (page) {
    return parsePage(page);
  }
}

export async function getPageFromDrupalPath(req: Request, path: string): Promise<?Page> {
  const pages = await getDocuments(req, [Prismic.Predicates.at('my.pages.drupalPath', path)], {
    fetchLinks: pagesFields.concat(eventSeriesFields)
  });

  if (pages.results.length > 0) {
    return parsePage(pages.results[0]);
  }
}
