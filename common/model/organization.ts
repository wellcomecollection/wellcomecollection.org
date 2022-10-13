import type { OpeningHoursDay, SpecialOpeningHours } from './opening-hours';

type PostalAddress = {
  addressLocality: string;
  postalCode: string;
  streetAddress: string;
  addressCountry?: string;
};

type Telephone = {
  href: string;
  display: string;
  'aria-label': string;
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
  telephone: Telephone;
};
