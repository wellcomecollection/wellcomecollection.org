// @flow
import title from './parts/title';
import promo from './parts/promo';
import body from './parts/body';
import timestamp from './parts/timestamp';

const SeasonPage = {
  Season: {
    title: title,
    start: timestamp('Start date'),
    end: timestamp('End date'),
    body,
  },
  Promo: {
    promo,
  },
};

export default SeasonPage;
