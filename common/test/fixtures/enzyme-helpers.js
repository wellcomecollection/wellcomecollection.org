// @flow
import { type Node } from 'react';
import { ThemeProvider } from 'styled-components';
import { type ReactWrapper, type ShallowWrapper, mount, shallow } from 'enzyme';
import theme from '../../views/themes/default';
import { act } from 'react-dom/test-utils';

export function mountWithTheme(Component: Node) {
  return mount<Node>(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
}

export function shallowWithTheme(Component: Node) {
  return shallow<Node>(
    <ThemeProvider theme={theme}>{Component}</ThemeProvider>
  );
}

export function updateWrapperAsync(
  wrapper: ReactWrapper<Node> | ShallowWrapper<Node>
) {
  return act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();
  });
}
