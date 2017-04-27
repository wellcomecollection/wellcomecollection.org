import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';

export const intervalCache = new IntervalCache().every('flags', 1000 * 10 * 60 * 5, () => getFlags(), {});
