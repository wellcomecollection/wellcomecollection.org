import * as prismic from '@prismicio/client';

import {
  SeasonsDocument as RawSeasonsDocument,
  SeriesDocument as RawSeriesDocument,
  StandfirstSlice as RawStandfirstSlice,
} from '@weco/common/prismicio-types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { ArticleScheduleItem } from '@weco/content/types/article-schedule-items';
import { Series, SeriesBasic } from '@weco/content/types/series';
import { getSeriesColor } from '@weco/content/utils/colors';

import { asTitle, transformGenericFields, transformSingleLevelGroup } from '.';
import { transformContributors } from './contributors';
import { transformSeason } from './seasons';

export function transformSeries(document: RawSeriesDocument): Series {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const untransformedBody = data.body || [];
  const untransformedStandfirst = untransformedBody.find(
    (slice: prismic.Slice) => slice.slice_type === 'standfirst'
  ) as RawStandfirstSlice | undefined;
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
    season => transformSeason(season as RawSeasonsDocument)
  );
  const contributors = transformContributors(document);

  return {
    ...genericFields,
    type: 'series',
    uid: document.uid,
    labels,
    schedule,
    untransformedStandfirst,
    color,
    items: [],
    seasons,
    contributors,
  };
}

export function transformSeriesToSeriesBasic(series: Series): SeriesBasic {
  return (({
    id,
    uid,
    type,
    title,
    labels,
    color,
    schedule,
    promo,
    image,
  }) => ({
    id,
    uid,
    type,
    title,
    labels,
    color,
    schedule,
    promo,
    image,
  }))(series);
}
