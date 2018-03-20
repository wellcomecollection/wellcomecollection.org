// @flow
// TODO: Flow utility types don't currently support creating a union type from an array
// If this issue gets resolved we should update: https://github.com/facebook/flow/issues/961
export const licenseTypeArray = ['CC-0', 'CC-BY', 'CC-BY-NC', 'CC-BY-NC-ND', 'PDM', 'copyright-not-cleared'];
export type LicenseType = | 'CC-0' | 'CC-BY' | 'CC-BY-NC' | 'CC-BY-NC-ND' | 'PDM' | 'copyright-not-cleared';
export type License = {|
  subject?: string;
  licenseType: LicenseType;
|};
// Need to clarify what the API will deliver, 2 examples currently show CC BY-4.0 and CC BY-NC
