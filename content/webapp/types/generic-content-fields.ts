import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import {
  PagesDocumentDataBodySlice,
  StandfirstSlice as RawStandfirstSlice,
} from '@weco/common/prismicio-types';

import { ImagePromo } from './image-promo';

/**
 * The minimal structural shape all Prismic body slice types satisfy.
 *
 * TODO: Use this (plus BodySliceOf<T>) to make GenericContentFields generic,
 * so each content type carries its own slice union instead of all sharing
 * PagesDocumentDataBodySlice.  The refactoring is tracked on branch
 * `refactor/generic-content-fields` — do it there and rebase this branch on
 * top of it.
 */
export type PrismicBodySlice = { slice_type: string };

/** Extracts the element slice type from a Prismic document's body zone. */
export type BodySliceOf<T> = T extends { data: { body: (infer S)[] } }
  ? S
  : never;

export type GenericContentFields = {
  id: string;
  title: string;
  promo?: ImagePromo;
  // Currently typed against PagesDocumentDataBodySlice as the widest available
  // union; see the TODO on PrismicBodySlice above for the planned fix.
  untransformedBody: prismic.SliceZone<PagesDocumentDataBodySlice>;
  untransformedStandfirst?: RawStandfirstSlice;
  image?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
