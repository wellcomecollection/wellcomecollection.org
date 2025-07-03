import { ParsedUrlQuery } from 'querystring';

import {
  decodeQuery,
  FromCodecMap,
  stringCodec,
} from '@weco/common/utils/routes';
import {
  WellcomeAggregation,
  WellcomeApiError,
} from '@weco/content/services/wellcome';
import {
  CatalogueResultsList,
  Image,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';

/**
 * Takes query result and checks for errors to log before returning required data.
 * @param {string} categoryName - e.g. works
 * @param queryResults - Original result from query
 */
export function getQueryWorkTypeBuckets({
  categoryName,
  queryResults,
}: {
  categoryName: string;
  queryResults: CatalogueResultsList<Work> | WellcomeApiError;
}): WorkTypes | undefined {
  if (queryResults.type === 'Error') {
    console.error(queryResults.label + ': Error fetching ' + categoryName);
  } else {
    return {
      workTypeBuckets: queryResults.aggregations?.workType.buckets,
      totalResults: queryResults.totalResults,
      requestUrl: queryResults._requestUrl,
    };
  }
}

// Creating this version of fromQuery for the overview page only
// No filters or pagination required.
const codecMap = { query: stringCodec };
type CodecMapProps = FromCodecMap<typeof codecMap>;
export const fromQuery: (params: ParsedUrlQuery) => CodecMapProps = params => {
  return decodeQuery<CodecMapProps>(params, codecMap);
};

export type WorkTypes = {
  workTypeBuckets: WellcomeAggregation['buckets'] | undefined;
  totalResults: number;
  requestUrl: string;
};
export type ImageResults = {
  totalResults: number;
  results: (Image & { src: string; width: number; height: number })[];
  requestUrl?: string;
};
