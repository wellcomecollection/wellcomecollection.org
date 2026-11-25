import { SiteSection } from '@weco/common/model/site-section';
import { GuidesDocumentDataBodySlice } from '@weco/common/prismicio-types';

import { Format } from './format';
import { GenericContentFields } from './generic-content-fields';
import { Link } from './link';

export type Guide = GenericContentFields<GuidesDocumentDataBodySlice> & {
  type: 'guides';
  uid: string;
  format?: Format;
  onThisPage: Link[];
  datePublished?: Date;
  siteSection?: SiteSection;
  showOnThisPage: boolean;
};
