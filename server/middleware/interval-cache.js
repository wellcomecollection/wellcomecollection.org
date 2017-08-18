import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';
import {getLatestTweets} from '../services/twitter';
import {getTotalWorks} from '../services/wellcomecollection-api';

function getTweets() {
  return getLatestTweets(4);
}

const fiveMinutes = 1000 * 60 * 5;
const oneDay = 1000 * 60 * 60 * 24;

const cache = new IntervalCache()
  .every('flags', fiveMinutes, getFlags, [])
  .every('tweets', fiveMinutes, getTweets, {})
  .every('totalWorks', oneDay, getTotalWorks, {});

export function intervalCache() {
  return (ctx, next) => {
    ctx.intervalCache = cache;
    return next();
  };
}
