// @flow
import Prismic from 'prismic-javascript';
import {london} from '../../utils/format-date';
import {getDocument} from './api';
import {getArticles} from './articles';
import {parseGenericFields, isStructuredText, asText} from './parsers';
import type {PrismicDocument, PrismicQueryOpts} from './types';
import type {ArticleSeries} from '../../model/article-series';
import type {Article} from '../../model/articles';

export function parseArticleSeries(document: PrismicDocument): ArticleSeries {
  const {data} = document;
  const genericFields = parseGenericFields(document);
  const standfirst = genericFields.standfirst || data.description || null;
  const color = data.color;
  const schedule = data.schedule ? data.schedule
    .filter(({title}) => isStructuredText(title))
    .map((item, i) => {
      return {
        type: 'article-schedule-items',
        id: `${document.id}_${i}`,
        title: asText(item.title),
        publishDate: london(item.publishDate).toDate(),
        partNumber: i + 1,
        color
      };
    }) : [];
  const labels = [{ url: null, text: schedule.length > 0 ? 'Serial' : 'Series' }];

  return {
    ...genericFields,
    type: 'article-series',
    labels,
    schedule,
    standfirst,
    color: data.color,
    items: []
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
  // GOTCHA: This is for body squabbles where we have the `webcomics` type.
  // This will have to remain like this until we figure out how to migrate it.
  const seriesField = id === 'WleP3iQAACUAYEoN'
    ? 'my.webcomics.series.series' : 'my.articles.series.series';
  const articles = await getArticles(req, {
    page: opts.page || 1,
    predicates: [Prismic.Predicates.at(seriesField, id)],
    ...opts
  });

  if (articles && articles.results && articles.results.length > 0) {
    const series = articles.results[0].series.find(series => series.id === id);
    // GOTCHA: We should hopefully be good here, as we only ever use this for serials,
    // which are 6 parts long
    const reverse = series && series.schedule.length > 0;
    const articleList = reverse ? articles.results.slice().reverse() : articles.results;
    const trimmedSchedule = series && series.schedule.slice(articles.results.length);
    const items = [
      ...articleList || [],
      ...trimmedSchedule || []
    ];
    const seriesWithItems = {
      ...series,
      items: items.map(item => {
        return item.type === 'article-schedule-item' || item.type === 'articles' ? {
          ...item,
          color: series && series.color
        } : item;
      })
    };

    return series && {
      series: seriesWithItems,
      articles: articleList
    };
  } else {
    // TODO: (perf) we shouldn't really be doing two calls here, but it's for
    // when a series has no events attached.
    const document = await getDocument(req, id, {});
    return document && { series: parseArticleSeries(document), articles: [] };
  }
}
