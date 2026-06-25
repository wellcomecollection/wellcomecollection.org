import * as prismic from '@prismicio/client';

import { PlacesDocumentDataBodySlice } from '@weco/common/prismicio-types';

import { GenericContentFields } from './generic-content-fields';

export type Place = GenericContentFields<PlacesDocumentDataBodySlice> & {
  id: string;
  title: string;
  level: number;
  capacity?: number;
  information?: prismic.RichTextField;
};

export type PlaceBasic = {
  title: string;
};
