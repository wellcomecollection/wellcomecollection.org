// @flow
import Prismic from 'prismic-javascript';
import {getDocument} from './api';
import {getArticles} from './articles';
import {parseGenericFields, isStructuredText, asText} from './parsers';
import type {PrismicDocument, PrismicQueryOpts} from './types';
import type {ArticleSeries} from '../../model/article-series';
import type {Article} from '../../model/articles';

export function parseArticleSeries(document: PrismicDocument): ArticleSeries {
  const {data} = document;
  const genericFields = parseGenericFields(document);
  const body = data.description ? [{
    type: 'text',
    weight: 'default',
    value: data.description
  }].concat(genericFields.body) : genericFields.body;
  const labels = [{ url: null, text: 'Serial' }];

  return {
    ...genericFields,
    type: 'article-series',
    labels,
    schedule: data.schedule ? data.schedule
      .filter(({title}) => isStructuredText(title))
      .map(item => {
        return {
          title: asText(item.title),
          publishDate: item.publishDate
        };
      }) : [],
    body,
    // Amazing old crap fields
    title: data.name
  };
}

type ArticleSeriesProps = {|
  id: string,
  ...PrismicQueryOpts
|}
type ArticleSeriesWithArticles = {|
  series: ArticleSeries,
  articles: Article[]
|}

export async function getArticleSeries(req: ?Request, {
  id,
  ...opts
}: ArticleSeriesProps): Promise<?ArticleSeriesWithArticles> {
  const articles = await getArticles(req, {
    page: 1,
    predicates: [Prismic.Predicates.at('my.articles.series.series', id)],
    ...opts
  });

  if (articles && articles.results.length > 0) {
    const series = articles.results[0].series.find(series => series.id === id);
    // GOTCHA: We should hopefully be good here, as we only ever use this for serials,
    // which  are 6 parts long
    const reverse = series && series.schedule.length > 0;
    const articleList = reverse ? articles.results.slice().reverse() : articles.results;

    return series && {
      series,
      articles: articleList
    };
  } else {
    // TODO: (perf) we shouldn't really be doing two calls here, but it's for
    // when a series has no events attached.
    const document = await getDocument(req, id, {});
    return document && { series: parseArticleSeries(document), articles: [] };
  }
}
