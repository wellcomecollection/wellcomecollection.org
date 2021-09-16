// @flow
import Prismic from 'prismic-javascript';
// $FlowFixMe (ts)
import { londonDjs } from '../../utils/dates';
import { getDocument, getDocuments } from './api';
import { getArticles } from './articles';
import {
  parseGenericFields,
  isStructuredText,
  asText,
  parseSingleLevelGroup,
} from './parsers';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
import type {
  PrismicDocument,
  PrismicQueryOpts,
  PaginatedResults,
} from './types';
import type { ArticleSeries } from '../../model/article-series';
import type { Article } from '../../model/articles';
import { seasonsFields } from './fetch-links';

export function parseArticleSeries(document: PrismicDocument): ArticleSeries {
  const { data } = document;
  const genericFields = parseGenericFields(document);
  const standfirst = genericFields.standfirst || data.description || null;
  const color = data.color;
  const schedule = data.schedule
    ? data.schedule
        .filter(({ title }) => isStructuredText(title))
        .map((item, i) => {
          return {
            type: 'article-schedule-items',
            id: `${document.id}_${i}`,
            title: asText(item.title),
            publishDate: londonDjs(item.publishDate).toDate(),
            partNumber: i + 1,
            color,
          };
        })
    : [];
  const labels = [{ text: schedule.length > 0 ? 'Serial' : 'Series' }];
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });

  return {
    ...genericFields,
    type: 'series',
    labels,
    schedule,
    standfirst,
    color: data.color,
    items: [],
    seasons,
  };
}

type ArticleSeriesProps = {|
  id: string,
  ...PrismicQueryOpts,
|};
type ArticleSeriesWithArticles = {|
  series: ArticleSeries,
  articles: Article[],
|};

export async function getArticleSeries(
  req: ?Request,
  { id, ...opts }: ArticleSeriesProps,
  memoizedPrismic: ?Object
): Promise<?ArticleSeriesWithArticles> {
  // GOTCHA: This is for body squabbles where we have the `webcomics` type.
  // This will have to remain like this until we figure out how to migrate it.
  // We should be creating new webcomics as an article with comic format,
  // and adding a article-series to it.
  const seriesField =
    id === 'WleP3iQAACUAYEoN' || id === 'X8D9qxIAACIAcKSf'
      ? 'my.webcomics.series.series'
      : 'my.articles.series.series';
  const articles = await getArticles(
    req,
    {
      page: opts.page || 1,
      predicates: [Prismic.Predicates.at(seriesField, id)],
      ...opts,
    },
    memoizedPrismic
  );

  if (articles && articles.results && articles.results.length > 0) {
    const series = articles.results[0].series.find(series => series.id === id);
    // GOTCHA: We should hopefully be good here, as we only ever use this for serials,
    // which are 6 parts long
    const titles = articles.results.map(article => article.title);
    const schedule =
      series && series.schedule.length > 0
        ? series.schedule.map(scheduleItem => {
            const index = titles.indexOf(scheduleItem.title);
            if (index !== -1 && articles.results[index]) {
              return articles.results[index];
            }

            return scheduleItem;
          })
        : [];

    const seriesWithItems = {
      ...series,
      // Add some colour
      items:
        schedule.length > 0
          ? schedule.map(item => {
              return item.type === 'article-schedule-item' ||
                item.type === 'articles'
                ? {
                    ...item,
                    color: series && series.color,
                  }
                : item;
            })
          : articles.results,
    };

    return (
      series && {
        series: seriesWithItems,
        articles: articles.results,
      }
    );
  } else {
    // TODO: (perf) we shouldn't really be doing two calls here, but it's for
    // when a series has no events attached.
    const document = await getDocument(
      req,
      id,
      {
        fetchLinks: seasonsFields,
      },
      memoizedPrismic
    );
    return document && { series: parseArticleSeries(document), articles: [] };
  }
}

type Order = 'desc' | 'asc';
type GetMultipleArticleSeriesProps = {|
  predicates?: Prismic.Predicates[],
  order?: Order,
  page?: number,
|};

export async function getMultipleArticleSeries(
  req: ?Request,
  {
    predicates = [],
    order = 'desc',
    page = 1,
  }: GetMultipleArticleSeriesProps = {},
  memoizedPrismic: ?Object
): Promise<PaginatedResults<ArticleSeries>> {
  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.any('document.type', ['series'])].concat(predicates),
    {
      page,
    },
    memoizedPrismic
  );

  const articleSeries: ArticleSeries[] =
    paginatedResults.results.map(parseArticleSeries);

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: articleSeries,
  };
}
