import * as prismic from '@prismicio/client';

import { ExploreMoreDocumentDataSlicesSlice } from '@weco/common/prismicio-types';

export type ExploreMore = {
  id: string;
  uid: string;
  title: string;
  description?: prismic.RichTextField;
  slices: prismic.SliceZone<ExploreMoreDocumentDataSlicesSlice>;
};
