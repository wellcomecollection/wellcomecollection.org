import Prismic from '@prismicio/client';
import ResolvedApi from '@prismicio/client/types/ResolvedApi';
import { Handler } from './';

export const defaultValue = {
  popupDialogue: null,
  openingTimes: null,
} as const;

type Key = keyof typeof defaultValue;
export type PrismicData = Record<Key, unknown>;

export const handler: Handler<PrismicData> = {
  defaultValue,
  fetch: fetchPrismicValues,
};

const fetchers: Record<Key, (api: ResolvedApi) => unknown> = {
  popupDialogue: async api => {
    const document = await api.getSingle('popup-dialog');
    return document.data;
  },

  openingTimes: async api => {
    return api.query([
      Prismic.Predicates.any('document.type', ['collection-venue']),
    ]);
  },
};

async function fetchPrismicValues(): Promise<Record<Key, unknown>> {
  // We should probably make this generic somewhere.
  // The only place we have it is JS not TS, so leaving it ungenerified for now
  const api = await Prismic.getApi(
    'https://wellcomecollection.cdn.prismic.io/api/v2'
  );

  const keys = Object.keys(fetchers);
  const values = await Promise.allSettled(
    Object.values(fetchers).map(fetcher => fetcher(api))
  );

  const zipped = keys.reduce((acc, key, i) => {
    const result = values[i];
    // we use `null` over `undefined` so it will be in the JSON
    const value = result.status === 'fulfilled' ? result.value : null;

    if (result.status === 'rejected') {
      console.error(`Failed to fetch ${keys[i]} from Prismic`, result.reason);
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  return zipped as PrismicData;
}

export default handler;
