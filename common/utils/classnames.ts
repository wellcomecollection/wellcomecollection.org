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

// Parallel composite type class for each font(family, size) combination.
// Where there is no direct equivalent in the composite type scale, we map to the
// closest available style (e.g. font('sans', 2) and font('mono', -1)).
// Ambiguous cases (body vs label, body vs heading) default to body.
const fontCompositeMap: Partial<Record<string, string>> = {
  'sans:-2': 'type-body-sm-regular',
  'sans:-1': 'type-body-md-regular',
  'sans:0': 'type-body-lg-regular',
  'sans:1': 'type-body-xl-regular',
  'sans:2': 'type-body-xl-regular', // font('sans', 2) didn't have an exact match. This is the closest available
  'sans-bold:-2': 'type-body-sm-strong',
  'sans-bold:-1': 'type-body-md-strong',
  'sans-bold:0': 'type-body-lg-strong',
  'sans-bold:1': 'type-body-xl-strong',
  'sans-bold:2': 'type-heading-xl-strong-sans',
  'brand:0': 'type-heading-md-regular-brand',
  'brand:1': 'type-heading-lg-regular-brand',
  'brand-bold:-2': 'type-heading-xs-strong-brand',
  'brand-bold:-1': 'type-heading-sm-strong-brand',
  'brand-bold:0': 'type-heading-md-strong-brand',
  'brand-bold:1': 'type-heading-lg-strong-brand',
  'brand-bold:2': 'type-heading-xl-strong-brand',
  'brand-bold:4': 'type-heading-xxl-strong-brand',
  'brand-bold:5': 'type-display-md-strong',
  'mono:-2': 'type-caption-md-regular',
  'mono:-1': 'type-caption-md-regular', // font('mono', -1) didn't have an exact match. This is the closest available
};

export function fontFamily(family: FontFamily): string {
  return `font-${family}`;
}

export function fontSize(size: FontSize): string {
  return `font-size-f${size}`;
}

// Interim measure to allow this function to output _both_ of the possible
// typography class names. After we've QA-ed behind a toggle, I think we can
// replace calls to `font` with equivalent calls to `compositeTypography`
export function font(family: FontFamily, size: FontSize): string {
  const base = `${fontFamily(family)} ${fontSize(size)}`;
  const composite = fontCompositeMap[`${family}:${size}`];
  return composite ? `${base} ${composite}` : base;
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
    // Warn if there isn't a class for the given arguments
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
