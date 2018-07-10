// The easiest way to end up with scss keys in quotes is to use
// dynamic object keys from vars containing the extra quotes
const fontFamilyBase = `'font-family-base'`;
const fontFamilySubset = `'font-family-subset'`;
const fontFamilyWeb = `'font-family-web'`;
const fontSize = `'font-size'`;
const letterSpacing = `'letter-spacing'`;
const lineHeight = `'line-height'`;
const fontWeight = `'font-weight'`;

// The extra-extra quotes are needed because we output the values in a scss map.
// We unquote the value in the font mixin
const wellcomeBoldBase = `"'Arial Black', Gadget, sans-serif"`;
const wellcomeBoldSubset = `"'Wellcome Bold Web Subset'"`;
const wellcomeBold = `"'Wellcome Bold Web'"`;

const helveticaNeueLightBase = `"'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, sans-serif"`;
const helveticaNeueLight = `"'Helvetica Neue Light Web'"`;

const helveticaNeueMediumBase = `"'HelveticaNeue-Medium', 'Helvetica Neue Medium', 'Arial Black', Gadget, sans-serif"`;
const helveticaNeueMedium = `"'Helvetica Neue Medium Web'"`;

const letteraRegularBase = `"'Courier New', Courier, Monospace"`;
const letteraRegular = `"'Lettera Regular Web'"`;

const fonts = {
  [`'WB1'`]: {
    [fontFamilyBase]: wellcomeBoldBase,
    [fontFamilySubset]: wellcomeBoldSubset,
    [fontFamilyWeb]: wellcomeBold,
    [fontSize]: `90px`,
    [lineHeight]: `120px`
  },
  [`'WB2'`]: {
    [fontFamilyBase]: wellcomeBoldBase,
    [fontFamilySubset]: wellcomeBoldSubset,
    [fontFamilyWeb]: wellcomeBold,
    [fontSize]: `60px`,
    [lineHeight]: `78px`
  },
  [`'WB3'`]: {
    [fontFamilyBase]: wellcomeBoldBase,
    [fontFamilySubset]: wellcomeBoldSubset,
    [fontFamilyWeb]: wellcomeBold,
    [fontSize]: `44px`,
    [lineHeight]: `60px`
  },
  [`'WB4'`]: {
    [fontFamilyBase]: wellcomeBoldBase,
    [fontFamilySubset]: wellcomeBoldSubset,
    [fontFamilyWeb]: wellcomeBold,
    [fontSize]: `33px`,
    [lineHeight]: `42px`
  },
  [`'WB5'`]: {
    [fontFamilyBase]: wellcomeBoldBase,
    [fontFamilySubset]: wellcomeBoldSubset,
    [fontFamilyWeb]: wellcomeBold,
    [fontSize]: `22px`,
    [lineHeight]: `32px`
  },
  [`'WB6'`]: {
    [fontFamilyBase]: wellcomeBoldBase,
    [fontFamilySubset]: wellcomeBoldSubset,
    [fontFamilyWeb]: wellcomeBold,
    [fontSize]: `19px`,
    [lineHeight]: `28px`
  },
  [`'WB7'`]: {
    [fontFamilyBase]: wellcomeBoldBase,
    [fontFamilySubset]: wellcomeBoldSubset,
    [fontFamilyWeb]: wellcomeBold,
    [fontSize]: `15px`,
    [lineHeight]: `24px`
  },
  [`'HNM1'`]: {
    [fontFamilyBase]: helveticaNeueMediumBase,
    [fontFamilyWeb]: helveticaNeueMedium,
    [fontSize]: `36px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `48px`
  },
  [`'HNM2'`]: {
    [fontFamilyBase]: helveticaNeueMediumBase,
    [fontFamilyWeb]: helveticaNeueMedium,
    [fontSize]: `26px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `38px`
  },
  [`'HNM3'`]: {
    [fontFamilyBase]: helveticaNeueMediumBase,
    [fontFamilyWeb]: helveticaNeueMedium,
    [fontSize]: `20px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `30px`
  },
  [`'HNM4'`]: {
    [fontFamilyBase]: helveticaNeueMediumBase,
    [fontFamilyWeb]: helveticaNeueMedium,
    [fontSize]: `16px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `24px`
  },
  [`'HNM5'`]: {
    [fontFamilyBase]: helveticaNeueMediumBase,
    [fontFamilyWeb]: helveticaNeueMedium,
    [fontSize]: `14px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `20px`
  },
  [`'HNM6'`]: {
    [fontFamilyBase]: helveticaNeueMediumBase,
    [fontFamilyWeb]: helveticaNeueMedium,
    [fontSize]: `12px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `18px`
  },
  [`'HNL1'`]: {
    [fontFamilyBase]: helveticaNeueLightBase,
    [fontFamilyWeb]: helveticaNeueLight,
    [fontWeight]: `normal`,
    [fontSize]: `36px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `48px`
  },
  [`'HNL2'`]: {
    [fontFamilyBase]: helveticaNeueLightBase,
    [fontFamilyWeb]: helveticaNeueLight,
    [fontWeight]: `normal`,
    [fontSize]: `26px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `38px`
  },
  [`'HNL3'`]: {
    [fontFamilyBase]: helveticaNeueLightBase,
    [fontFamilyWeb]: helveticaNeueLight,
    [fontWeight]: `normal`,
    [fontSize]: `20px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `30px`
  },
  [`'HNL4'`]: {
    [fontFamilyBase]: helveticaNeueLightBase,
    [fontFamilyWeb]: helveticaNeueLight,
    [fontWeight]: `normal`,
    [fontSize]: `16px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `24px`
  },
  [`'HNL5'`]: {
    [fontFamilyBase]: helveticaNeueLightBase,
    [fontFamilyWeb]: helveticaNeueLight,
    [fontWeight]: `normal`,
    [fontSize]: `14px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `20px`
  },
  [`'HNL6'`]: {
    [fontFamilyBase]: helveticaNeueLightBase,
    [fontFamilyWeb]: helveticaNeueLight,
    [fontWeight]: `normal`,
    [fontSize]: `12px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `18px`
  },
  [`'HNL7'`]: {
    [fontFamilyBase]: helveticaNeueLightBase,
    [fontFamilyWeb]: helveticaNeueLight,
    [fontWeight]: `normal`,
    [fontSize]: `11px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `18px`
  },
  [`'LR1'`]: {
    [fontFamilyBase]: letteraRegularBase,
    [fontFamilyWeb]: letteraRegular,
    [fontSize]: `18px`,
    [letterSpacing]: `0.02em`,
    [lineHeight]: `24px`
  },
  [`'LR2'`]: {
    [fontFamilyBase]: letteraRegularBase,
    [fontFamilyWeb]: letteraRegular,
    [fontSize]: `14px`,
    [lineHeight]: `24px`
  },
  [`'LR3'`]: {
    [fontFamilyBase]: letteraRegularBase,
    [fontFamilyWeb]: letteraRegular,
    [fontSize]: `12px`,
    [lineHeight]: `18px`
  }
};

module.exports = fonts;
