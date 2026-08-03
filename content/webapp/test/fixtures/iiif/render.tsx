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
import ItemViewerContextLegacy, {
  defaultItemViewerContext as defaultItemViewerContextLegacy,
  ItemViewerContextProps as ItemViewerContextPropsLegacy,
} from '@weco/content/contexts/ItemViewerContext/legacy';
import ItemViewerContextRefactored, {
  defaultItemViewerContext as defaultItemViewerContextRefactored,
  ItemViewerContextProps as ItemViewerContextPropsRefactored,
} from '@weco/content/contexts/ItemViewerContext/refactored';

import { createMockManifest } from './transformed-manifest';

// Test harness for IIIF viewer components.
//
// Components in the viewer read derived state from ItemViewerContext and also
// consult AppContext (isFullSupportBrowser), UserContext
// (userIsStaffWithRestricted, which drives restricted-access behaviour), and
// KioskContext (isKiosk, which affects PDF viewer choice and other kiosk-specific
// behavior). `renderWithContext` wires all of these up with sensible defaults
// so a test only has to declare the values relevant to the scenario it characterises.
//
// This imports legacy's and refactored's context modules directly (rather
// than the feature-flag-aware barrel), so each Provider below is always given
// a value matching its own shape — the two are expected to diverge as the
// item-viewer-refactor migration progresses.

// isRefactoredContext is excluded from overrides: it's the discriminant that
// decides which Provider wraps the tree below, so it must only ever come
// from the matching default, never from a test-supplied override.
type ItemViewerContextOverridesLegacy = Partial<
  Omit<ItemViewerContextPropsLegacy, 'isRefactoredContext'>
>;
type ItemViewerContextOverridesRefactored = Partial<
  Omit<ItemViewerContextPropsRefactored, 'isRefactoredContext'>
>;

export function createMockItemViewerContext(
  overrides: ItemViewerContextOverridesLegacy = {}
): ItemViewerContextPropsLegacy {
  return {
    ...defaultItemViewerContextLegacy,
    // A single-image manifest is the most common baseline; override as needed.
    transformedManifest: createMockManifest(),
    ...overrides,
  };
}

export function createMockRefactoredItemViewerContext(
  overrides: ItemViewerContextOverridesRefactored = {}
): ItemViewerContextPropsRefactored {
  return {
    ...defaultItemViewerContextRefactored,
    // A single-image manifest is the most common baseline; override as needed.
    transformedManifest: createMockManifest(),
    ...overrides,
  };
}

export type RenderWithContextOptions = {
  contextProps?:
    ItemViewerContextOverridesLegacy | ItemViewerContextOverridesRefactored;
  appContext?: Partial<AppContextProps>;
  userContext?: Partial<UserContextProps>;
  kioskContext?: Partial<KioskContextType>;
  // When true, wraps with ItemViewerContextRefactored.Provider (given a
  // refactored-shaped context value) instead of ItemViewerContextLegacy.Provider.
  // Use in refactored viewer tests that mock useFeatureFlags to return
  // { itemViewerRefactor: true }.
  useRefactoredContext?: boolean;
} & Omit<RenderOptions, 'wrapper'>;

// Narrows contextProps to the refactored context's own shape (rather than
// RenderWithContextOptions' generic legacy-or-refactored union), so a stale
// field name is caught at compile time instead of being silently dropped.
// For use in refactored viewer tests that always pass useRefactoredContext: true.
export type RenderWithRefactoredContextOptions = Omit<
  RenderWithContextOptions,
  'contextProps' | 'useRefactoredContext'
> & {
  contextProps?: ItemViewerContextOverridesRefactored;
};

export type RenderWithContextResult = RenderResult & {
  contextValue: ItemViewerContextPropsLegacy | ItemViewerContextPropsRefactored;
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
  const contextValue = useRefactoredContext
    ? createMockRefactoredItemViewerContext(
        contextProps as ItemViewerContextOverridesRefactored
      )
    : createMockItemViewerContext(
        contextProps as ItemViewerContextOverridesLegacy
      );
  const appValue: AppContextProps = { ...appContextDefaults, ...appContext };
  const userValue: UserContextProps = {
    ...defaultUserContext,
    ...userContext,
  };
  const kioskValue: KioskContextType = {
    ...defaultKioskContext,
    ...kioskContext,
  };

  const Wrapper: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={appValue}>
        <KioskContext.Provider value={kioskValue}>
          <UserContext.Provider value={userValue}>
            {contextValue.isRefactoredContext ? (
              <ItemViewerContextRefactored.Provider value={contextValue}>
                {children}
              </ItemViewerContextRefactored.Provider>
            ) : (
              <ItemViewerContextLegacy.Provider value={contextValue}>
                {children}
              </ItemViewerContextLegacy.Provider>
            )}
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
