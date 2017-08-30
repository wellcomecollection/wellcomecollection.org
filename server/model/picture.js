// @flow
import type {LicenseType} from './license';
export type Picture = {|
  type: 'picture';
  contentUrl: ?string;
  width: ?number;
  height: ?number;
  fileType?: string;
  caption?: ?string;
  alt?: ?string;
  copyright?: ?string;
  author?: string;
  fileFormat?: string;
  url?: ?string;
  attribute?: {title: ?string, author: ?string, sourceName: ?string, sourceLink: ?string, license: LicenseType, copyrightHolder: ?string, copyrightLink: ?string};
|}

export function createPicture(data: Picture): Picture {
  return (data: Picture);
}
