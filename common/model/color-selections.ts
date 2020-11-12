export const ColorSelections = {
  Turquoise: 'turquoise',
  Red: 'red',
  Green: 'green',
  Purple: 'purple',
} as const;

export type ColorSelection = typeof ColorSelections[keyof typeof ColorSelections];
