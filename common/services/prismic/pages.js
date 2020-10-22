// @flow
import Prismic from 'prismic-javascript';
import { getDocument, getDocuments } from './api';
import { parseTimestamp, parseGenericFields, parseOnThisPage } from './parsers';
import type { Page } from '../../model/pages';
import type { PrismicDocument } from './types';
import {
  pagesFields,
  collectionVenuesFields,
  eventSeriesFields,
  exhibitionFields,
  teamsFields,
  eventsFields,
  cardsFields,
  eventFormatsFields,
  articleFormatsFields,
  labelsFields,
} from './fetch-links';

export function parsePage(document: PrismicDocument): Page {
  const { data } = document;
  const genericFields = parseGenericFields(document);

  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  const siteSection = document.tags.find(tag =>
    ['visit-us', 'what-we-do', 'collections'].includes(tag)
  );

  // TODO: (drupal migration) Just deal with normal promo once we deprecate the
  // drupal stuff
  const promo = genericFields.promo;
  const drupalPromoImage =
    data.drupalPromoImage && data.drupalPromoImage.url
      ? data.drupalPromoImage
      : null;
  const drupalisedPromo = drupalPromoImage
    ? {
        caption: promo && promo.caption,
        image: {
          contentUrl: data.drupalPromoImage.url,
          width: data.drupalPromoImage.width,
          height: data.drupalPromoImage.height,
        },
      }
    : null;

  return {
    type: 'pages',
    ...genericFields,
    onThisPage: parseOnThisPage(data.body),
    showOnThisPage: data.showOnThisPage || false,
    promo: promo && promo.image ? promo : drupalisedPromo,
    datePublished: data.datePublished && parseTimestamp(data.datePublished),
    siteSection: siteSection,
    drupalPromoImage: drupalPromoImage,
    drupalNid: data.drupalNid,
    drupalPath: data.drupalPath,
  };
}

export async function getPage(
  req: ?Request,
  id: string,
  memoizedPrismic: ?Object
): Promise<?Page> {
  const page = await getDocument(
    req,
    id,
    {
      fetchLinks: pagesFields.concat(
        eventSeriesFields,
        collectionVenuesFields,
        exhibitionFields,
        teamsFields,
        eventsFields,
        cardsFields,
        eventFormatsFields,
        articleFormatsFields,
        labelsFields
      ),
    },
    memoizedPrismic
  );

  if (page) {
    return parsePage(page);
  }
}

export async function getPageFromDrupalPath(
  req: Request,
  path: string
): Promise<?Page> {
  const pages = await getDocuments(
    req,
    [Prismic.Predicates.at('my.pages.drupalPath', path)],
    {
      fetchLinks: pagesFields.concat(eventSeriesFields),
    }
  );

  if (pages.results.length > 0) {
    return parsePage(pages.results[0]);
  }
}
