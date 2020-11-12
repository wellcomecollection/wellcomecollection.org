export const licenseTypeArray = [
  'CC-0',
  'CC-BY',
  'CC-BY-NC',
  'CC-BY-NC-ND',
  'CC-BY-ND',
  'CC-BY-SA',
  'CC-BY-NC-SA',
  'PDM',
  'OGL',
  'OPL',
  'copyright-not-cleared',
  'inc',
];
export type LicenseType =
  | 'CC-0'
  | 'CC-BY'
  | 'CC-BY-NC'
  | 'CC-BY-NC-ND'
  | 'CC-BY-ND'
  | 'CC-BY-SA'
  | 'CC-BY-NC-SA'
  | 'PDM'
  | 'OGL'
  | 'OPL'
  | 'copyright-not-cleared'
  | 'inc';

export type License = {
  subject?: string;
  licenseType: LicenseType;
};
