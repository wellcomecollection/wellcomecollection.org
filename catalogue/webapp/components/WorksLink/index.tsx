import {
  stringCodec,
  numberCodec,
  csvCodec,
  maybeStringCodec,
  quotedCsvCodec,
  FromCodecMap,
} from '@weco/common/utils/routes';

const codecMap = {
  query: stringCodec,
  page: numberCodec,
  workType: csvCodec,
  'items.locations.locationType': csvCodec,
  availabilities: csvCodec,
  languages: csvCodec,
  'genres.label': quotedCsvCodec,
  'subjects.label': quotedCsvCodec,
  'contributors.agent.label': quotedCsvCodec,
  sort: maybeStringCodec,
  sortOrder: maybeStringCodec,
  'partOf.title': maybeStringCodec,
  'production.dates.from': maybeStringCodec,
  'production.dates.to': maybeStringCodec,
};

export type WorksProps = FromCodecMap<typeof codecMap>;
