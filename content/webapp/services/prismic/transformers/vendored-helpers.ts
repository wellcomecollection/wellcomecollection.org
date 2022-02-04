// This file vendors some helper functions from a newer version of the
// prismic-helpers library.
//
// At time of writing (February 2022), we're using v2.0.0-beta3 of the
// prismic-helpers library, and there are some useful functions available
// in newer versions -- but I want to finish refactoring everything before
// we start changing the version of the client library.
//
// TODO: Upgrade the library; replace these functions with the upstream versions.
//
// Everything in this file is copyright Prismic, used under the terms of the
// Apache license.

import type {
  AnyRegularField,
  GroupField,
  LinkField,
  SliceZone,
} from '@prismicio/types';

/**
 * Determines if a Link field is filled.
 *
 * @param field - Link field to check.
 *
 * @returns `true` if `field` is filled, `false` otherwise.
 *
 * From https://github.com/prismicio/prismic-helpers/blob/b7c404126ff8cce47b2afd408a2ff901a9ebb1fd/src/isFilled.ts#L103-L121
 */
export const link = <
  TypeEnum = string,
  LangEnum = string,
  DataInterface extends Record<
    string,
    AnyRegularField | GroupField | SliceZone
  > = never
>(
  field: LinkField<TypeEnum, LangEnum, DataInterface>
): field is LinkField<TypeEnum, LangEnum, DataInterface, 'filled'> => {
  return 'id' in field || 'url' in field;
};
