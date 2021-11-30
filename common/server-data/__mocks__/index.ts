import {
  emptyPopupDialog,
  emptyPrismicQuery,
} from '../../services/prismic/query';
import { ServerData } from '../types';

export async function init() {
  // we avoid writing to the filesystem so we can run this in CI
}

export function clear() {
  // We do nothing here as we haven't created any timeouts
}

export async function getServerData(): Promise<ServerData> {
  return {
    toggles: {},
    prismic: {
      collectionVenues: emptyPrismicQuery(),
      popupDialog: emptyPopupDialog(),
    },
  };
}
