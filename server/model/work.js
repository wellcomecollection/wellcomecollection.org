// @flow

export type Work = {|
  id: string;
  title: string;
  description: string;
  createdDate: {
    label: string,
    type: string
  };
  creators: Array<string>;
  type: string;
  identifiers?: ?Array<{
    identifierScheme: string,
    value: string,
    type: string
  }>;
  items: Array<Item>
|};

type Item = {| id: string; locations: Array<Location> |};

type LicenseType = | 'CC-BY' | 'CC-BY-NC';

type License = {|
  licenseType: LicenseType;
  label: string;
  url: string;
|};

type LocationType = | 'thumbnail-image' | 'iiif-image';

type Location = {|
  locationType: LocationType;
  url: string;
  license: License;
|};
