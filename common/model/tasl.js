// @flow
import type {LicenseType} from './license';

export type Tasl = {|
  title: ?string,
  author: ?string,
  sourceName: ?string,
  sourceLink: ?string,
  license: ?LicenseType,
  copyrightHolder: ?string,
  copyrightLink: ?string
|}
