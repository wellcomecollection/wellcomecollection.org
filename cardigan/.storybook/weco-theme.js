export const baseFonts = {
  fontFamily:
    '-apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Lucida Grande", "Arial", sans-serif',
  color: '#010101',
  WebkitFontSmoothing: 'antialiased',
};

export const monoFonts = {
  fontFamily:
    '"Operator Mono", "Fira Code Retina", "Fira Code", "FiraCode-Retina", "Andale Mono", "Lucida Console", Consolas, Monaco, monospace',
  color: '#010101',
  WebkitFontSmoothing: 'antialiased',
};

export const wecoTheme = {
  mainBackground: '#F7F7F7 linear-gradient(to bottom right, #EEEEEE, #FFFFFF)',
  mainBorder: '1px solid #e8e8e8',
  mainBorderColor: '#e8e8e8',
  mainBorderRadius: 4,
  mainFill: 'rgba(255,255,255,0.89)',
  barFill: 'rgba(255,255,255,1)',
  barSelectedColor: '#010101',
  inputFill: '#010101',
  mainTextFace: baseFonts.fontFamily,
  mainTextColor: baseFonts.color,
  dimmedTextColor: '#010101',
  highlightColor: '#9fdaff',
  successColor: '#0edf62',
  failColor: '#ff3f3f',
  warnColor: 'orange',
  mainTextSize: 13,
  monoTextFace: monoFonts.fontFamily,
  layoutMargin: 10,
  overlayBackground:
    'linear-gradient(to bottom right, rgba(233, 233, 233, 0.6), rgba(255, 255, 255, 0.8))',
  storiesNav: {},
  brand: {
    background: 'url("https://cardigan.wellcomecollection.org/cardigan-theme/assets/images/cardigan.svg")'
  },
  brandLink: {},
  filter: {},
  treeHeader: {},
  treeMenuHeader: {},
  menuLink: {},
  activeMenuLink: {},
  treeArrow: {}
}
