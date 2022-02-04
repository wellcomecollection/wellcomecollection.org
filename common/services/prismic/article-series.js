// $FlowFixMe
import { london } from '../../utils/format-date';
import {
  parseGenericFields,
  isStructuredText,
  asText,
  parseSingleLevelGroup,
} from './parsers';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
import type { PrismicDocument } from './types';
import type { ArticleSeries } from '../../model/article-series';

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
            publishDate: london(item.publishDate).toDate(),
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
    prismicDocument: document,
  };
}
