// @flow
import Prismic from 'prismic-javascript';
import {getDocument, getDocuments} from './api';
import {parseBody, parseImagePromo, parseTitle, parseTimestamp} from './parsers';
import type {Page} from '../../model/pages';
import type {PrismicDocument} from './types';
import {pagesFields, eventSeriesFields} from './fetch-links';

export function parsePage(document: PrismicDocument): Page {
  const {data} = document;

  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  const siteSection = document.tags
    .filter(tag => ['visit-us', 'what-we-do'].indexOf(tag) !== -1)[0];

  // TODO: (drupal migration) Just deal with normal promo once we deprecate the
  // drupal stuff
  const promo = data.promo && parseImagePromo(data.promo);
  const drupalPromoImage = data.drupalPromoImage && data.drupalPromoImage.url ? data.drupalPromoImage : null;
  const drupalisedPromo = drupalPromoImage ? {
    caption: promo && promo.caption,
    image: {
      contentUrl: data.drupalPromoImage.url,
      width: data.drupalPromoImage.width,
      height: data.drupalPromoImage.height
    }
  } : promo;

  const body = data.body ? parseBody(data.body) : [];

  return {
    type: 'pages',
    id: document.id,
    title: data.title ? parseTitle(data.title) : 'TITLE MISSING',
    body: body,
    promo: drupalisedPromo,
    datePublished: data.datePublished && parseTimestamp(data.datePublished),
    siteSection: siteSection,
    drupalPromoImage: drupalPromoImage,
    drupalNid: data.drupalNid,
    drupalPath: data.drupalPath
  };
}

export async function getPage(req: Request, id: string): Promise<?Page> {
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
