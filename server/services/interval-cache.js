import IntervalCache from 'interval-cache'; // https://github.com/danneu/interval-cache
import {getFlags} from '../services/flags-lookup';
import {getGlobalAlert} from '../services/prismic';
import Raven from 'raven';

const fiveMinutes = 1000 * 60 * 5;

export const cache = new IntervalCache()
  .every('flags', fiveMinutes, getFlags, [])
  .every('globalAlert', fiveMinutes, async () => {
    try {
      const globalAlert = await getGlobalAlert();
      return globalAlert;
    } catch (err) {
      console.error(err);
      Raven.captureException(err);

      return null;
    }
  }, [])
  .start();
