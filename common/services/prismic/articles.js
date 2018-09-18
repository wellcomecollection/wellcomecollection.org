// @flow
import Prismic from 'prismic-javascript';
import {getDocument, getDocuments} from './api';
import type {PrismicDocument} from './types';
import {
  parseGenericFields,
  parseSingleLevelGroup,
  parseLabelType,
  isDocumentLink
} from './parsers';
import {parseArticleSeries} from './article-series';
import type {Article} from '../../model/articles';

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

export async function getArticle(req: Request, id: string): Promise<?Article> {
  const document = await getDocument(req, id, { graphQuery });
  return document && document.type === 'articles' ? parseArticle(document) : null;
}

type ArticleQueryProps = {|
  page: number,
  predicates: Prismic.Predicates[],
  order: 'asc' | 'desc'
|}

export async function getArticles(req: Request, {
  page = 1,
  predicates = [],
  order = 'desc'
}: ArticleQueryProps) {
  const orderings = '[my.articles.publishDate, my.webcomics.publishDate, document.first_publication_date desc]';
  const paginatedResults = await getDocuments(req, [
    Prismic.Predicates.at('document.type', 'articles')
  ].concat(predicates), {
    orderings,
    page,
    graphQuery
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
