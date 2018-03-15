import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';

const fiveMinutes = 1000 * 60 * 5;
export const cache = new IntervalCache()
  .every('flags', fiveMinutes, getFlags, [])
  .start();
