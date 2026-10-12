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
import ItemViewerContextRefactored, {
  defaultItemViewerContext as defaultItemViewerContextRefactored,
  ItemViewerContextProps as ItemViewerContextPropsRefactored,
} from '@weco/content/contexts/ItemViewerContext/refactored';
import { hasRestrictedItem } from '@weco/content/utils/iiif/v3';
import { getCurrentCanvas } from '@weco/content/views/pages/works/work/work.helpers';

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
// Legacy's context (and the feature-flag switch between it and refactored's)
// is gone - RFC 086 phase 7. `useRefactoredContext` and
// `RenderWithRefactoredContextOptions` below are now redundant rather than
// meaningful, kept only so existing call sites don't all need editing in the
// same change; a follow-up tidies them away.

// isRefactoredContext is excluded from overrides: it's still on the context
// type (removing it is also follow-up work), but a test should never need to
// set it itself.
type ItemViewerContextOverridesRefactored = Partial<
  Omit<ItemViewerContextPropsRefactored, 'isRefactoredContext'>
>;

function createMockRefactoredItemViewerContext(
  overrides: ItemViewerContextOverridesRefactored = {}
): ItemViewerContextPropsRefactored {
  // A single-image manifest is the most common baseline; override as needed.
  const transformedManifest =
    overrides.transformedManifest ?? createMockManifest();
  const query = overrides.query ?? defaultItemViewerContextRefactored.query;
  const canvasIndexById =
    overrides.canvasIndexById ??
    defaultItemViewerContextRefactored.canvasIndexById;

  const totalCanvases = transformedManifest.canvases.length;
  const currentCanvas = getCurrentCanvas({
    transformedManifest,
    canvasIndexById,
    canvasNumber: query.canvas,
  });

  return {
    ...defaultItemViewerContextRefactored,
    transformedManifest,
    // Mirrors how the real provider (IIIFViewer.tsx) derives these, so tests
    // overriding transformedManifest/query still get sensible defaults without
    // having to pass each one by hand. Anything derived from the manifest that
    // goes on the context needs adding here too, or tests that override the
    // manifest will silently fall back to the default context's value.
    currentCanvas,
    isCurrentCanvasRestricted: currentCanvas
      ? hasRestrictedItem(currentCanvas)
      : false,
    totalCanvases,
    hasMultipleCanvases: totalCanvases > 1,
    mainImageService: { '@id': currentCanvas?.imageServiceId },
    ...overrides,
  };
}

type CommonRenderWithContextOptions = {
  appContext?: Partial<AppContextProps>;
  userContext?: Partial<UserContextProps>;
  kioskContext?: Partial<KioskContextType>;
} & Omit<RenderOptions, 'wrapper'>;

export type RenderWithContextOptions = CommonRenderWithContextOptions & {
  // No longer meaningful - every context is refactored-shaped now. Kept so
  // existing call sites still compile; a follow-up removes it and updates them.
  useRefactoredContext?: boolean;
  contextProps?: ItemViewerContextOverridesRefactored;
};

// Was a narrower view onto RenderWithContextOptions for refactored-only
// tests; identical to it now, kept as an alias for existing imports.
export type RenderWithRefactoredContextOptions = RenderWithContextOptions;

export type RenderWithContextResult = RenderResult & {
  contextValue: ItemViewerContextPropsRefactored;
};

export function renderWithContext(
  ui: ReactElement,
  options: RenderWithContextOptions = {}
): RenderWithContextResult {
  const contextValue = createMockRefactoredItemViewerContext(
    options.contextProps
  );

  const {
    contextProps,
    useRefactoredContext,
    appContext,
    userContext,
    kioskContext,
    ...renderOptions
  } = options;
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
            <ItemViewerContextRefactored.Provider value={contextValue}>
              {children}
            </ItemViewerContextRefactored.Provider>
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
