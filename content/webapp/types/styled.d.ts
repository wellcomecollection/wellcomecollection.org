import 'styled-components';
import theme from '@weco/common/views/themes/default';

type ThemeInterface = typeof theme;

declare module 'styled-components' {
  // Augmenting DefaultTheme with our theme type
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ThemeInterface {}
}
