import { Series, SeriesBasic } from '../../../types/series';
import { SeriesPrismicDocument } from '../types/series';
import {
  asTitle,
  transformGenericFields,
  transformSingleLevelGroup,
  transformTimestamp,
} from '.';
import { transformSeason } from './seasons';
import { ArticleScheduleItem } from '../../../types/article-schedule-items';
import { SeasonPrismicDocument } from '../types/seasons';
import { isNotUndefined } from '@weco/common/utils/array';
import { transformContributors } from './contributors';

export function transformSeries(document: SeriesPrismicDocument): Series {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const standfirst = genericFields.standfirst || undefined;
  const color = data.color || undefined;
  const schedule: ArticleScheduleItem[] = data.schedule
    ? (data.schedule
        .map((item, i) => {
          const title = asTitle(item.title);

          return title.length > 0
            ? {
                type: 'article-schedule-items',
                id: `${document.id}_${i}`,
                title,
                publishDate: transformTimestamp(item.publishDate),
                partNumber: i + 1,
                color,
              }
            : undefined;
        })
        .filter(item => isNotUndefined(item)) as ArticleScheduleItem[])
    : [];
  const labels = [{ text: schedule.length > 0 ? 'Serial' : 'Series' }];
  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => transformSeason(season as SeasonPrismicDocument)
  );
  const contributors = transformContributors(document);

  return {
    ...genericFields,
    type: 'series',
    labels,
    schedule,
    standfirst,
    color,
    items: [],
    seasons,
    contributors,
  };
}

export function transformSeriesToSeriesBasic(series: Series): SeriesBasic {
  return (({ id, title, color, schedule }) => ({
    id,
    title,
    color,
    schedule,
  }))(series);
}
