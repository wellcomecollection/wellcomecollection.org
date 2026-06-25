import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import { StandfirstSlice as RawStandfirstSlice } from '@weco/common/prismicio-types';

import { ImagePromo } from './image-promo';

/** Minimal shape satisfied by all Prismic REST v2 body slices. */
export type PrismicBodySlice = {
  slice_type: string;
  id: string;
};

/** Extracts the body slice union from a Prismic document type. */
export type BodySliceOf<T> = T extends { data: { body: (infer S)[] } }
  ? S
  : never;

/** Fields shared by every content type. `TSlice` defaults to the minimal `PrismicBodySlice`. */
export type GenericContentFields<
  TSlice extends PrismicBodySlice = PrismicBodySlice,
> = {
  id: string;
  title: string;
  promo?: ImagePromo;
  untransformedBody: TSlice[];
  untransformedStandfirst?: RawStandfirstSlice;
  image?: ImageType;
  metadataDescription?: string;
  labels: Label[];
};
