import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';
import { getLatestTweets } from '../services/twitter';
import { getLatestInstagramPosts } from '../services/instagram';

function getTweets() {
  return getLatestTweets(4);
}

function getInstagramPosts() {
  return getLatestInstagramPosts(10);
}

const fiveMinutes = 1000 * 60 * 5;
const cache = new IntervalCache()
  .every('flags', fiveMinutes, getFlags, {})
  .every('tweets', fiveMinutes, getTweets, {})
  .every('instagramPosts', fiveMinutes, getInstagramPosts, {})

export function intervalCache() {
  return (ctx, next) => {
    ctx.intervalCache = cache;
    return next();
  };
}
