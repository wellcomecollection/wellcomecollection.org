// @flow
export type LicenseType = | 'CC0' | 'CC-BY' | 'CC-BY-NC' | 'CC-BY-NC-ND' | 'PDM' | 'copyright-not-cleared';
export type License = {|
  subject?: string;
  licenseType: LicenseType;
|};
// Need to clarify what the API will deliver, 2 examples currently show CC BY-4.0 and CC BY-NC
