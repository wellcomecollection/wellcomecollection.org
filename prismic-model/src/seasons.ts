import title from './parts/title';
import promo from './parts/promo';
import body from './parts/body';
import timestamp from './parts/timestamp';
import { CustomType } from './types/CustomType';

const Season: CustomType = {
  id: 'seasons',
  label: 'Season',
  repeatable: true,
  status: true,
  json: {
    Season: {
      title: title,
      start: timestamp('Start date'),
      end: timestamp('End date'),
      body,
    },
    Promo: {
      promo,
    },
  },
};

export default Season;
