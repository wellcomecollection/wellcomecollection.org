import {
  theme as designSystemTheme,
  TypographySizeKey,
} from '@wellcometrust/wellcome-design-system/theme';

const validCompositeTypographyClasses: Set<string> = (() => {
  const t = designSystemTheme.typography;
  const sizes: TypographySizeKey[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const valid = new Set<string>();

  for (const [cat, weights] of [
    ['body', t.body],
    ['display', t.display],
    ['caption', t.caption],
    ['label', t.label],
  ] as [string, Record<string, Record<string, unknown>>][]) {
    for (const [weight, sv] of Object.entries(weights)) {
      for (const size of sizes) {
        if (sv[size]) valid.add(`type-${cat}-${size}-${weight}`);
      }
    }
  }

  for (const family of ['sans', 'brand'] as const) {
    for (const [weight, sv] of Object.entries(t.heading[family]) as [
      string,
      Record<string, unknown>,
    ][]) {
      for (const size of sizes) {
        if (sv[size]) valid.add(`type-heading-${size}-${weight}-${family}`);
      }
    }
  }

  return valid;
})();

// int(r|m|sb|b) = Inter(regular|medium|semi-bold|bold); wb = Wellcome Bold; lr = Lettera Regular
type FontFamily = 'sans' | 'sans-bold' | 'brand' | 'brand-bold' | 'mono';
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

export function compositeTypography(
  category: 'body' | 'caption' | 'display' | 'label' | 'heading',
  size: TypographySizeKey,
  weight: 'regular' | 'strong',
  family?: 'sans' | 'brand'
): string {
  const className =
    category === 'heading'
      ? `type-heading-${size}-${weight}-${family ?? 'sans'}`
      : `type-${category}-${size}-${weight}`;

  if (
    process.env.NODE_ENV !== 'production' &&
    !validCompositeTypographyClasses.has(className)
  ) {
    console.warn(`compositeTypography: no class generated for "${className}"`);
  }

  return className;
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
