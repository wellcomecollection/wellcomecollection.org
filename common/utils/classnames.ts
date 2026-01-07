// int(r|m|sb|b) = Inter(regular|medium|semi-bold|bold); wb = Wellcome Bold; lr = Lettera Regular
type FontFamily = 'sans' | 'sans-bold' | 'brand' | 'mono';
type FontSize = -2 | -1 | 0 | 1 | 2 | 4 | 5;

export function font(family: FontFamily, size: FontSize): string;
export function font(family: FontFamily): string;
export function font(family: undefined, size: FontSize): string;
export function font(family?: FontFamily, size?: FontSize): string {
  if (family === undefined && size === undefined) {
    throw new Error('font() requires at least one argument');
  }

  const familyClass = family ? `font-${family}` : '';
  const sizeClass = size !== undefined ? `font-size-f${size}` : '';

  return [familyClass, sizeClass].filter(Boolean).join(' ');
}

type ClassNames = string[] | Record<string, boolean>;
export function classNames(classNames: ClassNames): string {
  if (Array.isArray(classNames)) {
    return classNames.join(' ');
  } else {
    return conditionalClassNames(classNames);
  }
}

function conditionalClassNames(obj: Record<string, boolean>): string {
  return Object.keys(obj)
    .map(key => {
      if (obj[key]) {
        return key;
      }
      return false;
    })
    .filter(Boolean)
    .join(' ');
}
