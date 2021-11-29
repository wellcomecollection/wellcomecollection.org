// @flow
// These colours should match those available to editors in the Prismic model
// see: https://github.com/wellcomecollection/wellcomecollection.org/blob/main/prismic-model/src/series.ts#L22
export const ColorSelections = {
  Green: 'green',
  Purple: 'purple',
  Red: 'red',
  Teal: 'teal',
};

export type ColorSelection = $Values<typeof ColorSelections>;
