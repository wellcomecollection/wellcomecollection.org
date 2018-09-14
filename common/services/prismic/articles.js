// @flow
import {getDocument} from './api';
import type {PrismicDocument, HTMLString} from './types';
import {
  parseGenericFields,
  parseSingleLevelGroup,
  parseLabelType
} from './parsers';
import type {LabelField} from '../../model/label-field';
import type {GenericContentFields} from '../../model/generic-content-fields';

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

type ArticleSeries = {|
  type: 'article-series',
  id: string,
  title: ?string,
  description: ?HTMLString
|}

// TODO: 0_0 -> move this to /model
export type ArticleV2 = {|
  type: 'articles',
  ...GenericContentFields,
  format: ?LabelField,
  summary: ?HTMLString,
  datePublished: Date,
  series: ArticleSeries[]
|}

export function parseArticle(document: PrismicDocument): ArticleV2 {
  return {
    type: 'articles',
    ...parseGenericFields(document),
    format: document.data.format && parseLabelType(document.data.format.data),
    summary: document.data.summary,
    datePublished: new Date(document.first_publication_date),
    series: parseSingleLevelGroup(document.data.series, 'series').map(series => {
      return {
        type: 'article-series',
        id: series.id,
        title: series.data.name,
        description: series.data.description
      };
    })
  };
}

export async function getArticle(req: Request, id: string): Promise<?ArticleV2> {
  const document = await getDocument(req, id, { graphQuery });
  return document && document.type === 'articles' ? parseArticle(document) : null;
}
