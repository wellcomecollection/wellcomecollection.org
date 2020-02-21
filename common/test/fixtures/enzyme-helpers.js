// @flow
import { type Node } from 'react';
import { ThemeProvider } from 'styled-components';
import { mount } from 'enzyme';
import theme from '../../views/themes/default';

export function mountWithTheme(Component: Node) {
  return mount<Node>(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
}
