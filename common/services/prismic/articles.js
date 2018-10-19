// @flow
import Prismic from 'prismic-javascript';
import {london} from '../../utils/format-date';
import {getDocument, getDocuments} from './api';
import {
  parseGenericFields,
  parseSingleLevelGroup,
  parseLabelType,
  isDocumentLink,
  checkAndParseImage,
  asText
} from './parsers';
import {parseMultiContent} from './multi-content';
import {parseArticleSeries} from './article-series';
import type {Article} from '../../model/articles';
import type {MultiContent} from '../../model/multi-content';
import type {
  PrismicDocument,
  PaginatedResults,
  PrismicQueryOpts
} from './types';

const graphQuery = `{
  webcomics {
    ...webcomicsFields
    series {
      series {
        ...seriesFields
      }
    }
    contributors {
      ...contributorsFields
      role {
        ...roleFields
      }
      contributor {
        ... on people {
          ...peopleFields
        }
      }
    }
    promo {
      ... on editorialImage {
        non-repeat {
          caption
          image
        }
      }
    }
  }
  articles {
    ...articlesFields
    format {
      ...formatFields
    }
    contributors {
      ...contributorsFields
      role {
        ...roleFields
      }
      contributor {
        ... on people {
          ...peopleFields
        }
        ... on organisations {
          ...organisationsFields
        }
      }
    }
    series {
      series {
        ...seriesFields
        schedule {
          ...scheduleFields
        }
        contributors {
          ...contributorsFields
          role {
            ...roleFields
          }
          contributor {
            ... on people {
              ...peopleFields
            }
            ... on organisations {
              ...organisationsFields
            }
          }
        }
        promo {
          ... on editorialImage {
            non-repeat {
              caption
              image
            }
          }
        }
      }
    }
    outroResearchItem {
      ... on events {
        title
      }
      ... on exhibitions {
        title
      }
      ... on books {
        title
      }
      ... on articles {
        title
      }
      ... on series {
        title
      }
      ... on event-series {
        title
      }
    }
    outroReadItem {
      ... on events {
        title
      }
      ... on exhibitions {
        title
      }
      ... on books {
        title
      }
      ... on articles {
        title
      }
      ... on series {
        title
      }
      ... on event-series {
        title
      }
    }
    outroVisitItem {
      ... on events {
        title
      }
      ... on exhibitions {
        title
      }
      ... on books {
        title
      }
      ... on articles {
        title
      }
      ... on series {
        title
      }
      ... on event-series {
        title
      }
    }
    promo {
      ... on editorialImage {
        non-repeat {
          caption
          image
        }
      }
    }
  }
}`.replace(/\n(\s+)/g, '\n');

function parseContentLink(document: PrismicDocument): ?MultiContent {
  if (!document || document.isBroken !== false) {
    return;
  }

  const parsedDocuments = parseMultiContent([document]);
  return parsedDocuments.length > 0 ? parsedDocuments[0] : null;
}

function parseArticleDoc(document: PrismicDocument): Article {
  const {data} = document;
  const datePublished = data.publishDate || document.first_publication_date || undefined;
  const article = {
    type: 'articles',
    ...parseGenericFields(document),
    format: isDocumentLink(data.format) ? parseLabelType(data.format) : null,
    datePublished: london(datePublished).toDate(),
    series: parseSingleLevelGroup(data.series, 'series').map(series => {
      return parseArticleSeries(series);
    })
  };
  const labels = [
    article.format ? {url: null, text: article.format.title || ''} : null,
    article.series.find(series => series.schedule.length > 0) ? {url: null, text: 'Serial'} : null
  ].filter(Boolean);

  return {
    ...article,
    labels: labels.length > 0 ? labels : [{url: null, text: 'Story'}],
    outroResearchLinkText: asText(data.outroResearchLinkText),
    outroResearchItem: parseContentLink(data.outroResearchItem),
    outroReadLinkText: asText(data.outroReadLinkText),
    outroReadItem: parseContentLink(data.outroReadItem),
    outroVisitLinkText: asText(data.outroVisitLinkText),
    outroVisitItem: parseContentLink(data.outroVisitItem)
  };
}

function parseWebcomicDoc(document: PrismicDocument): Article {
  const {data} = document;
  const datePublished = data.publishDate || document.first_publication_date;
  const article = {
    type: 'articles',
    ...parseGenericFields(document),
    format: {
      id: 'W7d_ghAAALWY3Ujc',
      title: 'Comic',
      description: null
    },
    datePublished: new Date(datePublished),
    series: parseSingleLevelGroup(data.series, 'series').map(series => {
      return parseArticleSeries(series);
    })
  };
  const labels = [
    article.format ? {url: null, text: article.format.title || ''} : null,
    article.series.find(series => series.schedule.length > 0) ? {url: null, text: 'Serial'} : null
  ].filter(Boolean);
  const body = data.image ? [
    {
      type: 'imageGallery',
      weight: 'standalone',
      value: {
        title: null,
        items: [{
          image: checkAndParseImage(data.image),
          caption: null
        }]
      }
    },
    ...article.body
  ] : article.body;

  return {
    ...article,
    body,
    labels: labels.length > 0 ? labels : [{url: null, text: 'Story'}],
    outroResearchLinkText: null,
    outroResearchItem: null,
    outroReadLinkText: null,
    outroReadItem: null,
    outroVisitLinkText: null,
    outroVisitItem: null
  };
}

export function parseArticle(document: PrismicDocument): Article {
  if (document.type === 'webcomics') {
    return parseWebcomicDoc(document);
  } else {
    return parseArticleDoc(document);
  }
}

export async function getArticle(req: ?Request, id: string): Promise<?Article> {
  const document = await getDocument(req, id, { graphQuery });
  return document && (document.type === 'articles' || document.type === 'webcomics') ? parseArticle(document) : null;
}

type ArticleQueryProps = {|
  predicates: Prismic.Predicates[],
  ...PrismicQueryOpts
|}

export async function getArticles(req: ?Request, {
  predicates = [],
  ...opts
}: ArticleQueryProps): Promise<PaginatedResults<Article>> {
  const orderings = '[my.articles.publishDate, my.webcomics.publishDate, document.first_publication_date desc]';
  const paginatedResults = await getDocuments(req, [
    Prismic.Predicates.any('document.type', ['articles', 'webcomics'])
  ].concat(predicates), {
    orderings,
    graphQuery,
    ...opts
  });

  const articles = paginatedResults.results.map(doc => {
    const article = parseArticle(doc);
    return article;
  });

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: articles
  };
}
