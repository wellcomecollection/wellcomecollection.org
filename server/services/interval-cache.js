import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';
import {getLatestTweets} from '../services/twitter';

function getTweets() {
  return getLatestTweets(4);
}

const fiveMinutes = 1000 * 60 * 5;
export const cache = new IntervalCache()
  .every('flags', fiveMinutes, getFlags, [])
  .every('tweets', fiveMinutes, getTweets, {})
  .start();
