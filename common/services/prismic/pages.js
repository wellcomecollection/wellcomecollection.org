// @flow
import Prismic from 'prismic-javascript';
import { getDocument, getDocuments } from './api';
import {
  parseTimestamp,
  parseGenericFields,
  parseOnThisPage,
  parseSingleLevelGroup,
  parseFormat,
} from './parsers';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
import type { Page } from '../../model/pages';
import type { SiblingsGroup } from '../../model/siblings-group';
import type { PrismicDocument, PaginatedResults } from './types';
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
  seasonsFields,
  contributorsFields,
  peopleFields,
  bookFields,
  pagesFormatsFields,
} from './fetch-links';

export function parsePage(document: PrismicDocument): Page {
  const { data } = document;
  const genericFields = parseGenericFields(document);
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });
  const landingPages = parseSingleLevelGroup(
    data.landingPages,
    'landingPage'
  ).map(page => {
    return parsePage(page);
  });
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
    format: data.format && parseFormat(data.format),
    ...genericFields,
    seasons,
    landingPages,
    onThisPage: data.body ? parseOnThisPage(data.body) : [],
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
        labelsFields,
        seasonsFields,
        contributorsFields,
        peopleFields,
        bookFields,
        pagesFormatsFields
      ),
    },
    memoizedPrismic
  );
  if (page) {
    return parsePage(page);
  }
}

type Order = 'desc' | 'asc';
type GetPagesProps = {|
  predicates?: Prismic.Predicates[],
  order?: Order,
  page?: number,
  pageSize?: number,
|};

export async function getPages(
  req: ?Request,
  {
    predicates = [],
    order = 'desc',
    page = 1,
    pageSize = 100,
  }: GetPagesProps = {},
  memoizedPrismic: ?Object
): Promise<PaginatedResults<Page>> {
  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.any('document.type', ['pages'])].concat(predicates),
    {
      page,
      pageSize,
      fetchLinks: pagesFields.concat(
        eventSeriesFields,
        collectionVenuesFields,
        exhibitionFields,
        teamsFields,
        eventsFields,
        cardsFields,
        eventFormatsFields,
        articleFormatsFields,
        labelsFields,
        seasonsFields,
        contributorsFields,
        peopleFields,
        bookFields
      ),
    },
    memoizedPrismic
  );

  const pages: Page[] = paginatedResults.results.map(parsePage);

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: pages,
  };
}

export async function getPageSiblings(
  page: Page,
  req: ?Request,
  memoizedPrismic: ?Object
): Promise<SiblingsGroup[]> {
  const relatedPagePromises = (page.landingPages &&
    page.landingPages.map(async landingPage => {
      const pagePromise = await getPages(
        req,
        {
          predicates: [
            Prismic.Predicates.at(
              'my.pages.landingPages.landingPage',
              landingPage.id
            ),
          ],
        },
        memoizedPrismic
      );
      return pagePromise;
    })) || [Promise.resolve([])];
  const relatedPages = await Promise.all(relatedPagePromises);
  const siblingsWithLandingTitle = relatedPages.map((results, i) => {
    return {
      id: page.landingPages[i].id,
      title: page.landingPages[i].title,
      siblings: results.results.filter(sibling => sibling.id !== page.id),
    };
  });
  return siblingsWithLandingTitle;
}

export async function getChildren(
  page: Page,
  req: ?Request,
  memoizedPrismic: ?Object
): Promise<SiblingsGroup> {
  const children = await getPages(
    req,
    {
      predicates: [
        Prismic.Predicates.at('my.pages.landingPages.landingPage', page.id),
      ],
    },
    memoizedPrismic
  );
  return {
    id: page.id,
    title: page.title,
    siblings: children.results || [],
  };
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
