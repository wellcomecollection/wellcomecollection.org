// These colours should match those available to editors in the Prismic model
// see: https://github.com/wellcomecollection/wellcomecollection.org/blob/main/prismic-model/src/series.ts#L22
export const ColorSelections = {
  Green: 'validation.green',
  Purple: 'accent.purple',
  Red: 'validation.red',
  Teal: 'accent.blue',
} as const;

export type ColorSelection =
  typeof ColorSelections[keyof typeof ColorSelections];
