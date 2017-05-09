import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';
import {getCohorts} from '../services/cohorts-lookup';

export const intervalCache = new IntervalCache()
       .every('flags', 1000 * 60 * 5, getFlags, {})
       .every('cohorts', 1000 * 60 * 5, getCohorts, {});
