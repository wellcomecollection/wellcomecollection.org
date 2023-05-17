import {
  PrismicDocument,
  ContentRelationshipField,
  FilledContentRelationshipField,
  FilledLinkToWebField,
  LinkField,
  AnyRegularField,
  GroupField,
  SliceZone,
} from '@prismicio/client';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import * as prismic from '@prismicio/client';

/**
 * This is a convenience type for what the generic DataInterface type extend in @prismicio/types
 */
export type DataInterface = Record<
  string,
  AnyRegularField | GroupField | SliceZone
>;
/**
 * This allows us to get the DataInterface from PrismicDocuments when we
 * Need them for `ContentRelationshipField`s e.g.
 * type Doc = PrismicDocument<{ title: RichTextField }>
 * type DataInterface = InferDataInterface<Doc> // { title: RichTextField }
 * ContentRelationshipField<'formats', 'en-gb', DataInterface>
 */
export type InferDataInterface<T> = T extends PrismicDocument<
  infer DataInterface
>
  ? DataInterface
  : never;

// This is the type we want to convert prismic
// to as it mirrors the catalogue API
export type PaginatedResults<T> = {
  currentPage: number;
  results: T[];
  pageSize: number;
  totalResults: number;
  totalPages: number;
};

// Guards
export function isFilledLinkToDocument<T, L, D extends DataInterface>(
  field: ContentRelationshipField<T, L, D> | undefined
): field is FilledContentRelationshipField<T, L, D> {
  return isNotUndefined(field) && 'id' in field && field.isBroken === false;
}

export function isFilledLinkToDocumentWithData<T, L, D extends DataInterface>(
  field: ContentRelationshipField<T, L, D> | undefined
): field is FilledContentRelationshipField<T, L, D> & { data: DataInterface } {
  return isFilledLinkToDocument(field) && 'data' in field;
}

export function isFilledLinkToWebField(
  field: LinkField
): field is FilledLinkToWebField {
  return (
    prismic.isFilled.link(field) && field.link_type === 'Web' && 'url' in field
  );
}

export function isFilledLinkToMediaField(
  field: LinkField
): field is FilledLinkToWebField {
  return (
    prismic.isFilled.link(field) &&
    field.link_type === 'Media' &&
    'url' in field
  );
}
