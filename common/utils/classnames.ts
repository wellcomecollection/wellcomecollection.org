// int(r|m|sb|b) = Inter(regular|medium|semi-bold|bold); wb = Wellcome Bold; lr = Lettera Regular
type FontFamily = 'sans' | 'sans-bold' | 'brand' | 'mono';
type FontSize = -2 | -1 | 0 | 1 | 2 | 4 | 5;

export function fontFamily(family: FontFamily): string {
  return `font-${family}`;
}

export function fontSize(size: FontSize): string {
  return `font-size-f${size}`;
}

export function font(family: FontFamily, size: FontSize): string {
  return `${fontFamily(family)} ${fontSize(size)}`;
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
