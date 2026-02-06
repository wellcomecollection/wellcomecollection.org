import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';
import {
  PagesDocumentDataBodySlice,
  EditorialImageSlice as RawEditorialImageSlice,
  SeriesDocument as RawSeriesDocument,
  StandfirstSlice as RawStandfirstSlice,
  WebcomicSeriesDocument as RawWebcomicSeriesDocument,
} from '@weco/common/prismicio-types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { ArticleScheduleItem } from '@weco/content/types/article-schedule-items';
import { Series, SeriesBasic } from '@weco/content/types/series';
import { getSeriesColor } from '@weco/content/utils/colors';

import {
  asText,
  asTitle,
  isGenericDocWithMetaDescription,
  isGenericDocWithPromo,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import { transformContributors } from './contributors';
import { transformImagePromo } from './images';
import { transformSeasonsFromRelationshipGroup } from './seasons';

export function transformWebcomicSeries(
  doc: RawWebcomicSeriesDocument
): Series {
  const { data } = doc;
  const promo = isGenericDocWithPromo(doc)
    ? transformImagePromo(data.promo)
    : undefined;

  const primaryPromo =
    isGenericDocWithPromo(doc) && data.promo.length > 0
      ? data.promo
          .filter((slice: RawEditorialImageSlice) => slice.primary.image)
          .find(_ => _)
      : undefined;

  const image: ImageType | undefined = primaryPromo
    ? transformImage(primaryPromo.primary.image)
    : undefined;

  const metadataDescription = isGenericDocWithMetaDescription(doc)
    ? asText(data.metadataDescription)
    : undefined;

  const contributors = transformContributors(doc);

  return {
    type: 'series',
    id: doc.id,
    uid: doc.uid,
    title: data?.title ? asTitle(data.title) : '',
    promo,
    image,
    metadataDescription,
    contributors,
    // We don't have data for the following on RawWebcomicSeriesDocument
    // but adding them in here so we can return the Series type
    labels: [],
    schedule: [],
    seasons: [],
    items: [],
    untransformedBody: [] as prismic.SliceZone<PagesDocumentDataBodySlice>,
  };
}

export function transformSeries(document: RawSeriesDocument): Series {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const untransformedBody = data.body || [];
  const untransformedStandfirst = untransformedBody.find(
    (slice: PagesDocumentDataBodySlice) => slice.slice_type === 'standfirst'
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
  const seasons = transformSeasonsFromRelationshipGroup(
    transformSingleLevelGroup(data.seasons, 'season')
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
