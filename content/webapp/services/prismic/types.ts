import {
  FilledImageFieldImage,
  KeyTextField,
  RichTextField,
  Slice,
  SliceZone,
  RTHeading1Node,
  PrismicDocument,
  AnyRegularField,
  GroupField,
  RelationField,
  FilledLinkToDocumentField,
} from '@prismicio/types';
import { Body } from './prismic-body';

/**
 * This allows as to get the DataInterface from PrismicDocuments when we
 * Need them for `RelationField`s e.g.
 * type Doc = PrismicDocument<{ title: RichTextField }>
 * type DataInterface = InferDataInterface<Doc> // { title: RichTextField }
 * RelationField<'formats', 'en-gb', DataInterface>
 */
export type InferDataInterface<T> = T extends PrismicDocument<
  infer DataInterface
>
  ? DataInterface
  : never;

/**
 * This is a convenience type for what the generic DataInterface type extend in @prismicio/types
 */
export type DataInterface = Record<
  string,
  AnyRegularField | GroupField | SliceZone
>;

type Dimension = {
  width: number;
  height: number;
};

export type Crop = '32:15' | '16:9' | 'square';

// Currently the Prismic types only allow you to specify 1 image
type ThumbnailedImageField<Thumbnails extends Record<string, Dimension>> =
  FilledImageFieldImage & {
    [Property in keyof Thumbnails]?: FilledImageFieldImage;
  };

export type Image = ThumbnailedImageField<{
  '32:15': {
    width: 3200;
    height: 1500;
  };
  '16:9': {
    width: 3200;
    height: 1800;
  };
  square: {
    width: 3200;
    height: 3200;
  };
}>;

type Promo = { caption: RichTextField; image: Image; link: KeyTextField };
type PromoSliceZone = SliceZone<Slice<'editorialImage', Promo>>;

export type CommonPrismicData = {
  title: [RTHeading1Node];
  body: Body;
  promo: PromoSliceZone;
  metadataDescription: KeyTextField;
};

// Guards
export function isFilledLinkToDocument<T, L, D extends DataInterface>(
  field: RelationField<T, L, D>
): field is FilledLinkToDocumentField<T, L, D> {
  return 'isBroken' in field && field.isBroken === false;
}
