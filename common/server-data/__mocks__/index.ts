import {
  CollectionVenuePrismicDocument,
  emptyGlobalAlert,
  emptyPopupDialog,
  emptyPrismicQuery,
} from '../../services/prismic/documents';
import { ServerData } from '../types';

export async function init(): Promise<void> {
  // we avoid writing to the filesystem so we can run this in CI
}

export function clear(): void {
  // We do nothing here as we haven't created any timeouts
}

export async function getServerData(): Promise<ServerData> {
  return {
    toggles: {},
    hasAnalyticsConsent: false,
    prismic: {
      globalAlert: emptyGlobalAlert(),
      popupDialog: emptyPopupDialog(),
      collectionVenues: emptyPrismicQuery<CollectionVenuePrismicDocument>(),
    },
  };
}
