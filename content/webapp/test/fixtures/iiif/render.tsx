import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';

import AppContext, {
  appContextDefaults,
  AppContextProps,
} from '@weco/common/contexts/AppContext';
import KioskContext, {
  defaultKioskContext,
  KioskContextType,
} from '@weco/common/contexts/KioskContext';
import UserContext, {
  defaultUserContext,
  UserContextProps,
} from '@weco/common/contexts/UserContext';
import theme from '@weco/common/views/themes/default';
import {
  defaultItemViewerContext,
  ItemViewerContextLegacy,
  ItemViewerContextProps,
  ItemViewerContextRefactored,
} from '@weco/content/contexts/ItemViewerContext';

import { createMockManifest } from './transformed-manifest';

// Test harness for IIIF viewer components.
//
// Components in the viewer read derived state from ItemViewerContext and also
// consult AppContext (isFullSupportBrowser), UserContext
// (userIsStaffWithRestricted, which drives restricted-access behaviour), and
// KioskContext (isKiosk, which affects PDF viewer choice and other kiosk-specific
// behavior). `renderWithContext` wires all of these up with sensible defaults
// so a test only has to declare the values relevant to the scenario it characterises.

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
  kioskContext?: Partial<KioskContextType>;
  // When true, wraps with ItemViewerContextRefactored.Provider instead of
  // ItemViewerContextLegacy.Provider. Use in refactored viewer tests that
  // mock useFeatureFlags to return { itemViewerRefactor: true }.
  useRefactoredContext?: boolean;
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
    kioskContext,
    useRefactoredContext = false,
    ...renderOptions
  }: RenderWithContextOptions = {}
): RenderWithContextResult {
  const contextValue = createMockItemViewerContext(contextProps);
  const appValue: AppContextProps = { ...appContextDefaults, ...appContext };
  const userValue: UserContextProps = {
    ...defaultUserContext,
    ...userContext,
  };
  const kioskValue: KioskContextType = {
    ...defaultKioskContext,
    ...kioskContext,
  };

  const ItemViewerContext = useRefactoredContext
    ? ItemViewerContextRefactored
    : ItemViewerContextLegacy;

  const Wrapper: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={appValue}>
        <KioskContext.Provider value={kioskValue}>
          <UserContext.Provider value={userValue}>
            <ItemViewerContext.Provider value={contextValue}>
              {children}
            </ItemViewerContext.Provider>
          </UserContext.Provider>
        </KioskContext.Provider>
      </AppContext.Provider>
    </ThemeProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    contextValue,
  };
}
