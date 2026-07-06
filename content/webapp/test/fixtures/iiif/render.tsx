import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';

import AppContext, {
  appContextDefaults,
  AppContextProps,
} from '@weco/common/contexts/AppContext';
import UserContext, {
  defaultUserContext,
  UserContextProps,
} from '@weco/common/contexts/UserContext';
import theme from '@weco/common/views/themes/default';
import ItemViewerContext, {
  defaultItemViewerContext,
  ItemViewerContextProps,
} from '@weco/content/contexts/ItemViewerContext';

import { createMockManifest } from './transformed-manifest';

// Test harness for IIIF viewer components.
//
// Components in the viewer read derived state from ItemViewerContext and also
// consult AppContext (isFullSupportBrowser) and UserContext
// (userIsStaffWithRestricted, which drives restricted-access behaviour).
// `renderWithContext` wires all of these up with sensible defaults so a test
// only has to declare the values relevant to the scenario it characterises.
//
// KioskContext is intentionally left at its createContext default: it only
// affects viewer height styling, not the behaviour these tests pin down.

export function createMockItemViewerContext(
  overrides: Partial<ItemViewerContextProps> = {}
): ItemViewerContextProps {
  return {
    ...defaultItemViewerContext,
    // A single-image manifest is the most common baseline; override as needed.
    transformedManifest: createMockManifest(),
    ...overrides,
  };
}

export type RenderWithContextOptions = {
  contextProps?: Partial<ItemViewerContextProps>;
  appContext?: Partial<AppContextProps>;
  userContext?: Partial<UserContextProps>;
} & Omit<RenderOptions, 'wrapper'>;

export type RenderWithContextResult = RenderResult & {
  contextValue: ItemViewerContextProps;
};

export function renderWithContext(
  ui: ReactElement,
  {
    contextProps,
    appContext,
    userContext,
    ...renderOptions
  }: RenderWithContextOptions = {}
): RenderWithContextResult {
  const contextValue = createMockItemViewerContext(contextProps);
  const appValue: AppContextProps = { ...appContextDefaults, ...appContext };
  const userValue: UserContextProps = {
    ...defaultUserContext,
    ...userContext,
  };

  const Wrapper: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={appValue}>
        <UserContext.Provider value={userValue}>
          <ItemViewerContext.Provider value={contextValue}>
            {children}
          </ItemViewerContext.Provider>
        </UserContext.Provider>
      </AppContext.Provider>
    </ThemeProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    contextValue,
  };
}
