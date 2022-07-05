import { Query } from '@prismicio/types';
import { Series } from '../../../types/series';
import { isNotUndefined } from '@weco/common/utils/array';
import { ArticleBasic } from '../../../types/articles';
import { ArticlePrismicDocument } from '../types/articles';
import { transformArticle, transformArticleToArticleBasic } from './articles';
import { transformQuery } from './paginated-results';

type ArticleSeriesWithArticles = {
  series: Series;
  articles: ArticleBasic[];
};

export const transformArticleSeries = (
  seriesId: string,
  articleQuery: Query<ArticlePrismicDocument>
): ArticleSeriesWithArticles | undefined => {
  // TODO: This function is quite confusing.  Refactor it and add
  // more helpful comments.

  const articles = transformQuery(articleQuery, transformArticle).results.map(
    transformArticleToArticleBasic
  );

  // This should never happen in practice -- an article series without
  // any articles should return a 404 before we call this function --
  // but we drop a warning log here in case it does happen.
  if (articles.length === 0) {
    console.warn(`Asked to transform series ${seriesId} without any articles`);
    return undefined;
  }

  const series = articles[0].series.find(series => series.id === seriesId);

  // GOTCHA: We should hopefully be good here, as we only ever use this for serials,
  // which are 6 parts long
  const titles = articles.map(article => article.title);

  const schedule =
    series && series.schedule.length > 0
      ? series.schedule.map(scheduleItem => {
          const index = titles.indexOf(scheduleItem.title);
          if (index !== -1 && articles[index]) {
            return articles[index];
          }

          return scheduleItem;
        })
      : [];

  if (isNotUndefined(series)) {
    const seriesWithItems: Series = {
      ...series,
      // Add some colour
      items:
        schedule.length > 0
          ? schedule.map(item => {
              return item.type === 'article-schedule-items' ||
                item.type === 'articles'
                ? ({
                    ...item,
                    color: series && series.color,
                  } as ArticleBasic)
                : item;
            })
          : articles,
    };

    return (
      series && {
        articles,
        series: seriesWithItems,
      }
    );
  } else {
    return undefined;
  }
};
