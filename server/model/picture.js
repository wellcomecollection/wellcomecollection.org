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
  title?: ?string;
  author?: ?string;
  source?: ?{name?: ?string, link?: ?string};
  license?: ?LicenseType;
  copyright?: ?{
    holder?: ?string,
    link?: ?string
  };
  minWidth?: ?string; // This must have a CSS unit attached
|}

export function createPicture(data: Picture): Picture {
  return (data: Picture);
}
