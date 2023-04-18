import {
  maybeStringCodec,
  stringCodec,
  numberCodec,
  csvCodec,
  FromCodecMap,
  quotedCsvCodec,
} from '@weco/common/utils/routes';

export type ImagesProps = FromCodecMap<typeof codecMap>;

const codecMap = {
  query: stringCodec,
  page: numberCodec,
  'locations.license': csvCodec,
  'source.genres.label': quotedCsvCodec,
  'source.subjects.label': quotedCsvCodec,
  'source.contributors.agent.label': quotedCsvCodec,
  color: maybeStringCodec,
};
