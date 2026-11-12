// Assumes 1rem = 16px (the browser default)
export const remToPx = (remValue: string): number => parseFloat(remValue) * 16;
