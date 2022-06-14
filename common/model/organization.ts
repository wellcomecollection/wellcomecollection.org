import type { OpeningHoursDay, SpecialOpeningHours } from './opening-hours';
import { objToJsonLd } from '../utils/json-ld';

type PostalAddress = {
  addressLocality: string;
  postalCode: string;
  streetAddress: string;
  addressCountry?: string;
};

export type Organization = {
  name: string;
  url: string;
  logo: { url: string };
  sameAs: string[];
  openingHoursSpecification: OpeningHoursDay[];
  specialOpeningHoursSpecification?: SpecialOpeningHours[];
  address: PostalAddress;
  alternateUrl?: string;
  publicAccess: boolean;
  isAccessibleForFree: boolean;
  telephone: string;
  displayTelephone: string;
};

export const wellcomeCollectionAddress = {
  addressLocality: 'London',
  postalCode: 'NW1 2BE',
  streetAddress: '183 Euston Road',
  addressCountry: 'UK',
  addressMap:
    'https://www.google.co.uk/maps/dir//Wellcome+Collection,+Euston+Road,+London/@51.5258128,-0.136211,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x48761b25f10b008f:0xed51ac6f865b038a!2m2!1d-0.133945!2d51.525851',
};

export const wellcomeCollectionGallery: Organization = {
  name: 'Wellcome Collection',
  url: 'https://wellcomecollection.org',
  logo: {
    url: 'https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png',
  },
  sameAs: [
    'https://twitter.com/ExploreWellcome',
    'https://www.facebook.com/wellcomecollection',
    'https://www.instagram.com/wellcomecollection/',
    'https://www.youtube.com/user/WellcomeCollection',
    'https://soundcloud.com/wellcomecollection',
    'https://www.tripadvisor.co.uk/Attraction_Review-g186338-d662065-Reviews-Wellcome_Collection-London_England.html',
  ],
  openingHoursSpecification: [],
  address: objToJsonLd(
    wellcomeCollectionAddress,
    'PostalAddress',
    false
  ) as PostalAddress,
  isAccessibleForFree: true,
  publicAccess: true,
  telephone: '+4420 7611 2222',
  displayTelephone: '+44 (0)20 7611 2222',
};
