// @flow
import Prismic from 'prismic-javascript';
import {getDocument, getDocuments} from './api';
import {
  parseGenericFields,
  parseSingleLevelGroup,
  parseLabelType,
  isDocumentLink
} from './parsers';
import {parseArticleSeries} from './article-series';
import type {Article} from '../../model/articles';
import type {
  PrismicDocument,
  PaginatedResults,
  PrismicQueryOpts
} from './types';

const graphQuery = `{
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
        name
        description
        schedule {
          ...scheduleFields
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
    promo {
      ... on editorialImage {
        non-repeat {
          caption
          image
        }
      }
    }
  }
}`;

export function parseArticle(document: PrismicDocument): Article {
  return {
    type: 'articles',
    ...parseGenericFields(document),
    format: isDocumentLink(document.data.format) ? parseLabelType(document.data.format.data) : null,
    summary: document.data.summary,
    datePublished: new Date(document.first_publication_date),
    series: parseSingleLevelGroup(document.data.series, 'series').map(series => {
      return parseArticleSeries(series);
    })
  };
}

export async function getArticle(req: ?Request, id: string): Promise<?Article> {
  const document = await getDocument(req, id, { graphQuery });
  return document && document.type === 'articles' ? parseArticle(document) : null;
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
    Prismic.Predicates.at('document.type', 'articles')
  ].concat(predicates), {
    orderings,
    graphQuery,
    ...opts
  });

  const articles = paginatedResults.results.map(doc => {
    return parseArticle(doc);
  });

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: articles
  };
}
