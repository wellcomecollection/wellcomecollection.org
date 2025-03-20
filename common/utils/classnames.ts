export type SizeMap = Record<string, number>;

export function grid(sizes: SizeMap): string {
  const base = 'grid__cell';
  const modifierClasses = Object.keys(sizes).map(key => {
    const size = sizes[key];
    const modifier = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `${base}--${modifier}${size}`;
  });

  return [base].concat(modifierClasses).join(' ');
}

// int(r|m|sb|b) = Inter(regular|medium|semi-bold|bold); wb = Wellcome Bold; lr = Lettera Regular
type FontFamily = 'intr' | 'intm' | 'intsb' | 'intb' | 'wb' | 'lr';
type FontSize = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type FontSizeAll = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type FontSizeOverrides = {
  small?: FontSizeAll;
  medium?: FontSizeAll;
  large?: FontSizeAll;
};

export function font(
  family: FontFamily,
  size: FontSize,
  overrides?: FontSizeOverrides
): string {
  const overrideClasses =
    overrides &&
    Object.keys(overrides).reduce((acc, key) => {
      return overrides[key]
        ? acc.concat(` font-size-override-${key}-${overrides[key]}`)
        : '';
    }, '');
  return `font-${family} font-size-${size} ${overrideClasses || ''}`;
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
