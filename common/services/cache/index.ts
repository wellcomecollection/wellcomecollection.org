/* eslint-disable @typescript-eslint/no-var-requires */
import { TogglesResp } from '@weco/toggles';
import { CollectionOpeningTimes } from '../../model/opening-hours';
import { parseCollectionVenues } from '../prismic/opening-times';

// This appears to be nested in various confusing ways hence the inheritance
export interface OpeningTimes extends CollectionOpeningTimes {
  collectionOpeningTimes: CollectionOpeningTimes;
}

export const toggles: TogglesResp = require('./.cache/toggles.json');
export const openingTimes: OpeningTimes = parseCollectionVenues(
  require('./.cache/openingTimes.json')
);
