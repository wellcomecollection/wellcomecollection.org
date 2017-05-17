import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';
import {getCohorts} from '../services/cohorts-lookup';

const fiveMinutes = 1000 * 60 * 5;
const cache = new IntervalCache()
  .every('flags', fiveMinutes, getFlags, {})
  .every('cohorts', fiveMinutes, getCohorts, {});

export function intervalCache() {
  return (ctx, next) => {
    ctx.intervalCache = cache;
    return next();
  };
}
