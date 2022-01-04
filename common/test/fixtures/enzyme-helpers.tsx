import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { mount, shallow } from 'enzyme';
import theme from '../../views/themes/default';

export function mountWithTheme(Component: ReactNode) {
  return mount<ReactNode>(
    <ThemeProvider theme={theme}>{Component}</ThemeProvider>
  );
}

export function shallowWithTheme(Component: ReactNode) {
  return shallow<ReactNode>(
    <ThemeProvider theme={theme}>{Component}</ThemeProvider>
  );
}
