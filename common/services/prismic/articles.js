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
        color
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
  const {data} = document;
  const datePublished = data.publishDate || document.first_publication_date;
  const article = {
    type: 'articles',
    ...parseGenericFields(document),
    format: isDocumentLink(data.format) ? parseLabelType(data.format.data) : null,
    summary: data.summary,
    datePublished: new Date(datePublished),
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
    labels: labels.length > 0 ? labels : [{url: null, text: 'Story'}]
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
