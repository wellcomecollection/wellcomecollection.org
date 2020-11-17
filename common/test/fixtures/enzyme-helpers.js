// @flow
import { type Node } from 'react';
import { ThemeProvider } from 'styled-components';
import { type ReactWrapper, type ShallowWrapper, mount, shallow } from 'enzyme';
import theme from '../../views/themes/default';
import { act } from 'react-dom/test-utils';
// $FlowFixMe (tsx)
import GlobalAlertContext from '../../views/components/GlobalAlertContext/GlobalAlertContext';
// $FlowFixMe (ts);
import PopupDialogContext from '../../views/components/PopupDialogContext/PopupDialogContext';
// $FlowFixMe (tsx)
import OpeningTimesContext from '../../views/components/OpeningTimesContext/OpeningTimesContext.js';
import { openingTimes } from '../../test/fixtures/components/opening-times.js';

export function mountWithTheme(Component: Node) {
  return mount<Node>(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
}

export function shallowWithTheme(Component: Node) {
  return shallow<Node>(
    <ThemeProvider theme={theme}>{Component}</ThemeProvider>
  );
}

function themeAndContexts(Component: Node) {
  return (
    <ThemeProvider theme={theme}>
      <OpeningTimesContext.Provider value={openingTimes}>
        <GlobalAlertContext.Provider value={{ isShown: false }}>
          <PopupDialogContext.Provider value={{ isShown: false }}>
            {Component}
          </PopupDialogContext.Provider>
        </GlobalAlertContext.Provider>
      </OpeningTimesContext.Provider>
    </ThemeProvider>
  );
}

export function shallowWithThemeAndContexts(Component: Node) {
  return shallow<Node>(themeAndContexts(Component));
}

export function mountWithThemeAndContexts(Component: Node) {
  return mount<Node>(themeAndContexts(Component));
}

export function updateWrapperAsync(
  wrapper: ReactWrapper<Node> | ShallowWrapper<Node>
) {
  return act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();
  });
}
