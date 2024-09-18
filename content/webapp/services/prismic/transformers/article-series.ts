import { ArticleScheduleItem } from '@weco/content/types/article-schedule-items';
import { ArticleBasic } from '@weco/content/types/articles';
import { SeriesBasic } from '@weco/content/types/series';

type ArticleSeriesProps = {
  series: SeriesBasic;
  articles: ArticleBasic[];
};

/** Get a list of all the scheduled items in this series that haven't
 * been published yet.
 *
 * This is used for serials, which are usually 6 parts long -- although
 * the articles aren't published all at once, the Editorial team will put
 * "scheduled items" on the series in Prismic, so readers can see the titles
 * of upcoming articles.
 */
export function getScheduledItems({
  series,
  articles,
}: ArticleSeriesProps): ArticleScheduleItem[] {
  // Get a list of titles that have already been published in this series.
  //
  // This may cause issues with extremely long serials, if a single page
  // of articles doesn't include all the already-published articles, but
  // as we only expect serials to have scheduled items, and serials are
  // short, it's probably not an issue.
  const publishedTitles = articles.map(art => art.title);

  return series.schedule.filter(item => !publishedTitles.includes(item.title));
}

/** Given a list of articles in a series, put them in the right order.
 *
 *    - If this is part of a serial (e.g. Finding Audrey Amiss), then they go
 *      in ascending schedule order -- from earliest published to latest published.
 *
 *    - If this is part of an ongoing series (e.g. Inside Our Collections), then they
 *      go in descending publication order.
 *
 */
export function sortSeriesItems({
  series,
  articles,
}: ArticleSeriesProps): ArticleBasic[] {
  if (series.schedule.length > 0) {
    const scheduleTitles = series.schedule
      .sort((a, b) => a.partNumber - b.partNumber)
      .map(item => item.title);

    return articles.sort(
      (a, b) =>
        scheduleTitles.indexOf(a.title) - scheduleTitles.indexOf(b.title)
    );
  } else {
    return articles.sort(
      (a, b) => a.datePublished.valueOf() - b.datePublished.valueOf()
    );
  }
}
