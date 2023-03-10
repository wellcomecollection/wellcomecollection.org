import { SeriesBasic } from '@weco/content/types/series';
import { ArticleBasic } from '@weco/content/types/articles';
import { ArticleScheduleItem } from '@weco/content/types/article-schedule-items';

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
}: {
  series: SeriesBasic;
  articles: ArticleBasic[];
}): ArticleScheduleItem[] {
  // Get a list of titles that have already been published in this series.
  //
  // This may cause issues with extremely long serials, if a single page
  // of articles doesn't include all the already-published articles, but
  // as we only expect serials to have scheduled items, and serials are
  // short, it's probably not an issue.
  const publishedTitles = articles.map(art => art.title);

  return series.schedule.filter(item => !publishedTitles.includes(item.title));
}
