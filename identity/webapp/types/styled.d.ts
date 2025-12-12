import 'styled-components';
import theme from '@weco/common/views/themes/default';

type ThemeInterface = typeof theme;

declare module 'styled-components' {
  export type DefaultTheme = ThemeInterface;
}
