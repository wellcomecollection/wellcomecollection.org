import { CollectionVenueDocument as RawCollectionVenueDocument } from '@weco/common/prismicio-types';
import { ServerData } from '@weco/common/server-data/types';
import {
  emptyGlobalAlert,
  emptyPopupDialog,
  emptyPrismicQuery,
} from '@weco/common/services/prismic/documents';

export async function init(): Promise<void> {
  // we avoid writing to the filesystem so we can run this in CI
}

export function clear(): void {
  // We do nothing here as we haven't created any timeouts
}

export async function getServerData(): Promise<ServerData> {
  return {
    toggles: {},
    prismic: {
      globalAlert: emptyGlobalAlert(),
      popupDialog: emptyPopupDialog(),
      collectionVenues: emptyPrismicQuery<RawCollectionVenueDocument>(),
    },
    consentStatus: {
      analytics: false,
      marketing: false,
    },
  };
}
