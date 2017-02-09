// @flow
import {type OpeningHours, galleryOpeningHours} from './opening-hours';
import {objToJsonLd} from '../util/json-ld';

export type Organization = {|
  name: string;
  url: string;
  logo: string;
  twitterHandle: string;
  sameAs: Array<string>;
  openingHoursSpecification: OpeningHours;
  address: PostalAddress;
|}

type PostalAddress = {|
  addressLocality: string;
  postalCode: string;
  streetAddress: string;
|}

export const wellcomeCollectionAddress = {
  addressLocality: 'London',
  postalCode: 'NW1 2BE',
  streetAddress: '183 Euston Road',
  addressCountry: 'UK'
};

export const wellcomeCollection: Organization = {
  name: 'Wellcome Collection',
  url: 'https://wellcomecollection.org',
  logo: 'https://wellcomecollection.org/client/icons/apple-touch-icon.png',
  twitterHandle: '@ExploreWellcome',
  sameAs: [
    'https://twitter.com/ExploreWellcome',
    'https://www.facebook.com/wellcomecollection',
    'https://www.instagram.com/wellcomecollection/',
    'https://www.youtube.com/user/WellcomeCollection',
    'https://soundcloud.com/wellcomecollection',
    'https://www.tripadvisor.co.uk/Attraction_Review-g186338-d662065-Reviews-Wellcome_Collection-London_England.html'
  ],
  // TODO: This should be done elsewhere as it's not adhering to the type
  // Annoyingly, but good for time - this is still passing in Flow.
  openingHoursSpecification: galleryOpeningHours.map(
    openingHoursDay => objToJsonLd(openingHoursDay, 'OpeningHoursSpecification', false)
  ),
  address: objToJsonLd(wellcomeCollectionAddress, 'PostalAddress', false)
};
