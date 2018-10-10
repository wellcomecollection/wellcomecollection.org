// @flow
import type {OpeningHoursDay, SpecialOpeningHours} from './opening-hours';
import {galleryOpeningHours} from './opening-hours';
import {objToJsonLd} from '../utils/json-ld';
import moment from 'moment';

export type PostalAddress = {|
  addressLocality: string,
  postalCode: string,
  streetAddress: string,
  addressCountry?: string
|}

export type Organization = {|
  name: string,
  url: string,
  logo: {| url: string |},
  twitterHandle: string,
  sameAs: Array<string>,
  openingHoursSpecification: OpeningHoursDay[],
  specialOpeningHoursSpecification?: ?SpecialOpeningHours[],
  address: PostalAddress,
  alternateUrl?: string,
  publicAccess: boolean,
  isAccessibleForFree: boolean,
  telephone: string
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
  logo: {
    url: 'https://wellcomecollection.org/assets/icons/apple-touch-icon.png'
  },
  twitterHandle: 'ExploreWellcome',
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
  openingHoursSpecification: galleryOpeningHours.regular.map(
    openingHoursDay =>  {
      const specObject = objToJsonLd(openingHoursDay, 'OpeningHoursSpecification', false);
      delete specObject.note;
      return specObject;
    }
  ),
  specialOpeningHoursSpecification: galleryOpeningHours.exceptional && galleryOpeningHours.exceptional.map(
    openingHoursDate => {
      const specObject = {
        opens: openingHoursDate.opens,
        closes: openingHoursDate.closes,
        validFrom: moment(openingHoursDate.overrideDate).format('DD MMMM YYYY'),
        validThrough: moment(openingHoursDate.overrideDate).format('DD MMMM YYYY')
      };
      return objToJsonLd(specObject, 'OpeningHoursSpecification', false);
    }
  ),
  address: objToJsonLd(wellcomeCollectionAddress, 'PostalAddress', false),
  isAccessibleForFree: true,
  publicAccess: true,
  telephone: '+4420 7611 2222'
};
