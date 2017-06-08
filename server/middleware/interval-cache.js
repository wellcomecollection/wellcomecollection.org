import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';

const fiveMinutes = 1000 * 60 * 5;
const cache = new IntervalCache().every('flags', fiveMinutes, getFlags, {});

export function intervalCache() {
  return (ctx, next) => {
    ctx.intervalCache = cache;
    return next();
  };
}
