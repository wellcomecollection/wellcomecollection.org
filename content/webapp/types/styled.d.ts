import 'styled-components';
import { ThemeInterface } from '@weco/common/views/themes/default';

declare module 'styled-components' {
  // Augmenting DefaultTheme with our theme type
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ThemeInterface {}
}
