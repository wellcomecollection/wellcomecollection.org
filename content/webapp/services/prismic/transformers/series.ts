import { Series } from '../../../types/series';
import { SeriesPrismicDocument } from '../types/series';
import { isStructuredText, transformGenericFields } from '.';
import {
  asText,
  parseSingleLevelGroup,
  parseTimestamp,
} from '@weco/common/services/prismic/parsers';
import { london } from '@weco/common/utils/format-date';
import { transformSeason } from './seasons';
import { ArticleScheduleItem } from '@weco/common/model/article-schedule-items';

export function transformSeries(document: SeriesPrismicDocument): Series {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const standfirst = genericFields.standfirst || undefined;
  const color = data.color || undefined;
  const schedule: ArticleScheduleItem[] = data.schedule
    ? data.schedule
        .filter(({ title }) => isStructuredText(title))
        .map((item, i) => {
          return {
            type: 'article-schedule-items',
            id: `${document.id}_${i}`,
            title: asText(item.title),
            publishDate: london(parseTimestamp(item.publishDate)).toDate(),
            partNumber: i + 1,
            color,
          };
        })
    : [];
  const labels = [{ text: schedule.length > 0 ? 'Serial' : 'Series' }];
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return transformSeason(season);
  });

  return {
    ...genericFields,
    type: 'series',
    labels,
    schedule,
    standfirst,
    color,
    items: [],
    seasons,
    prismicDocument: document,
  };
}
