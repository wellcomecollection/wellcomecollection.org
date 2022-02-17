import { Series } from '../../../types/series';
import { SeriesPrismicDocument } from '../types/series';
import {
  asText,
  isStructuredText,
  parseSingleLevelGroup,
} from '@weco/common/services/prismic/parsers';
import { transformSeason } from './seasons';
import { london } from '@weco/common/utils/dates';
import { transformGenericFields } from '.';

export function transformSeries(document: SeriesPrismicDocument): Series {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const standfirst = genericFields.standfirst || null;
  const color = data.color;
  const schedule = data.schedule
    ? data.schedule
        .filter(({ title }) => isStructuredText(title))
        .map((item, i) => {
          return {
            type: 'article-schedule-items',
            id: `${document.id}_${i}`,
            title: asText(item.title),
            publishDate: london(item.publishDate).toDate(),
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
    color: data.color,
    items: [],
    seasons,
    prismicDocument: document,
  };
}
