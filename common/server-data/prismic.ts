import Prismic from '@prismicio/client';
import { Handler } from './';

export const defaultValue = {
  popupDialogue: null,
  openingTimes: null,
} as const;

export type PrismicData = Record<keyof typeof defaultValue, unknown>;

export const handler: Handler<PrismicData> = {
  defaultValue,
  fetch: fetchPrismicValues,
};

const fetchers = [
  {
    key: 'popupDialogue',
    getValue: async api => {
      const document = await api.getSingle('popup-dialog');
      return document.data;
    },
  },
  {
    key: 'openingTimes',
    getValue: async api => {
      return api.query([
        Prismic.Predicates.any('document.type', ['collection-venue']),
      ]);
    },
  },
] as const;

type Key = typeof fetchers[number]['key'];

async function fetchPrismicValues(): Promise<Record<Key, unknown>> {
  // We should probably make this generic somewhere.
  // The only place we have it is JS, so leaving it ungenerified for now
  const api = await Prismic.getApi(
    'https://wellcomecollection.cdn.prismic.io/api/v2'
  );

  const valuePromises = fetchers.map(async fetcher => {
    return fetcher.getValue(api);
  });

  const values = await Promise.allSettled(valuePromises);
  const keyedValues = fetchers
    .map(fetcher => fetcher.key)
    .map((key, i) => {
      const value = values[i];

      if (value.status === 'rejected') {
        console.info(value);
        console.error(`Failed to fetch ${key} from Prismic`, value.reason);
      }

      return {
        key,
        // we use `null` over `undefined` so it will be in the JSON
        value: value.status === 'fulfilled' ? value.value : null,
      };
    })
    .reduce((acc, val) => {
      return {
        ...acc,
        [val.key]: val.value,
      };
    }, {} as Record<Key, unknown>);

  return keyedValues;
}

export default handler;
