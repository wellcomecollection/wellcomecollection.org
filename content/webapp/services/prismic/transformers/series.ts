import * as prismic from '@prismicio/client';
import { Series, SeriesBasic } from '../../../types/series';
import {
  StandfirstSlice,
  SeriesDocument,
  SeasonsDocument,
} from '@weco/common/prismicio-types';
import { asTitle, transformGenericFields, transformSingleLevelGroup } from '.';
import { transformSeason } from './seasons';
import { ArticleScheduleItem } from '../../../types/article-schedule-items';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { transformContributors } from './contributors';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { getSeriesColor } from '@weco/content/utils/colors';

export function transformSeries(document: SeriesDocument): Series {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const standfirst = genericFields.standfirst || undefined;
  const untransformedBody = data.body || [];
  const untransformedStandfirst = untransformedBody.find(
    (slice: prismic.Slice) => slice.slice_type === 'standfirst'
  ) as StandfirstSlice | undefined;
  const color = getSeriesColor(data.color || undefined);
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
    season => transformSeason(season as SeasonsDocument)
  );
  const contributors = transformContributors(document);

  return {
    ...genericFields,
    type: 'series',
    labels,
    schedule,
    standfirst,
    untransformedStandfirst,
    color,
    items: [],
    seasons,
    contributors,
  };
}

export function transformSeriesToSeriesBasic(series: Series): SeriesBasic {
  return (({ id, type, title, labels, color, schedule, promo, image }) => ({
    id,
    type,
    title,
    labels,
    color,
    schedule,
    promo,
    image,
  }))(series);
}
