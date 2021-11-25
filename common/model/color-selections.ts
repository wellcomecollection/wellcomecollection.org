export const ColorSelections = {
  Turquoise: 'turquoise',
  Teal: 'teal',
  Red: 'red',
  Green: 'green',
  Purple: 'purple',
} as const;

export type ColorSelection =
  typeof ColorSelections[keyof typeof ColorSelections];
