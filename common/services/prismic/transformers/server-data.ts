import * as prismic from '@prismicio/client';
import { ServerData, SimplifiedServerData } from '../../../server-data/types';
import { InferDataInterface } from '../types';
import {
  PopupDialogPrismicDocument,
  GlobalAlertPrismicDocument,
  CollectionVenuePrismicDocument,
} from '../documents';
import { ResultsLite } from '../../../server-data/prismic';

// We don't want to add the raw prismic data to the ServerDataContext
// It gets included in the __NEXT_DATA__ script tag and adds unnecessary page weight
export function simplifyServerData(
  serverData: ServerData
): SimplifiedServerData {
  return {
    ...serverData,
    prismic: {
      globalAlert: simplifyGlobalAlert(serverData.prismic.globalAlert),
      popupDialog: simplifyPopupDialog(serverData.prismic.popupDialog),
      collectionVenues: simplifyCollectionVenues(
        serverData.prismic.collectionVenues
      ),
    },
  };
}

function simplifyGlobalAlert(doc: GlobalAlertPrismicDocument): {
  data: InferDataInterface<GlobalAlertPrismicDocument>;
} {
  return { data: doc.data };
}

function simplifyPopupDialog(doc: PopupDialogPrismicDocument): {
  data: InferDataInterface<PopupDialogPrismicDocument>;
} {
  return {
    data: doc.data,
  };
}

function simplifyCollectionVenues(
  doc: prismic.Query<CollectionVenuePrismicDocument>
): ResultsLite {
  return {
    results: doc.results.map(doc => {
      const id = doc.id;
      const {
        title,
        order,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        modifiedDayOpeningTimes,
      } = doc.data;
      return {
        id,
        data: {
          title,
          order,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
          modifiedDayOpeningTimes,
        },
      };
    }),
  };
}
