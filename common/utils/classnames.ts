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

export function cssGrid(sizes: SizeMap): string {
  const base = 'css-grid__cell';
  const modifierClasses = Object.keys(sizes).map(key => {
    const size = sizes[key];
    const modifier = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `${base}--${modifier}${size}`;
  });

  return [base].concat(modifierClasses).join(' ');
}

// int(r|b) = Inter(regular|bold); wb = Wellcome Bold; lr = Lettera Regular
type FontFamily = 'intr' | 'intb' | 'wb' | 'lr';
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

// TODO remove all the checks for . when we get rid of font-[color] classes
// https://github.com/wellcomecollection/wellcomecollection.org/issues/8418
type ClassNames = string[] | Record<string, boolean>;
export function classNames(classNames: ClassNames): string {
  if (Array.isArray(classNames)) {
    const newClassNames = classNames;
    classNames.map(className => {
      if (className.includes('.'))
        newClassNames[className] = className.replace('.', '-');
    });
    return newClassNames.join(' ');
  } else {
    let newClassNames = {};
    Object.keys(classNames).map(k => {
      newClassNames = {
        ...newClassNames,
        [k.includes('.') ? k.replace('.', '-') : k]: classNames[k],
      };
    });
    return conditionalClassNames(newClassNames);
  }
}

function conditionalClassNames(obj: Record<string, boolean>): string {
  return Object.keys(obj)
    .map(key => {
      if (obj[key]) {
        return key;
      }
    })
    .filter(Boolean)
    .join(' ');
}
