import { LicenseType } from './license';

export type Tasl = {
  title: string | null;
  author: string | null;
  sourceName: string | null;
  sourceLink: string | null;
  license: LicenseType | null;
  copyrightHolder: string | null;
  copyrightLink: string | null;
};
