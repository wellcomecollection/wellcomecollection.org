import { CollectionVenuePrismicDocument } from '@weco/common/services/prismic/documents';
import { FetchLinks } from '.';

export const collectionVenuesFetchLinks: FetchLinks<CollectionVenuePrismicDocument> =
  [
    'collection-venue.title',
    'collection-venue.image',
    'collection-venue.link',
    'collection-venue.linkText',
    'collection-venue.order',
    'collection-venue.monday',
    'collection-venue.tuesday',
    'collection-venue.wednesday',
    'collection-venue.thursday',
    'collection-venue.friday',
    'collection-venue.saturday',
    'collection-venue.sunday',
    'collection-venue.modifiedDayOpeningTimes',
  ];
