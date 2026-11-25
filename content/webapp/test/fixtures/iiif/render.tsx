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
import ItemViewerContext, {
  defaultItemViewerContext,
  ItemViewerContextProps,
} from '@weco/content/contexts/ItemViewerContext';
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

type ItemViewerContextOverrides = Partial<ItemViewerContextProps>;

function createMockItemViewerContext(
  overrides: ItemViewerContextOverrides = {}
): ItemViewerContextProps {
  // A single-image manifest is the most common baseline; override as needed.
  // transformedManifest explicitly set to undefined (to model "no manifest")
  // is honoured rather than defaulted - distinct from the key being absent
  // from overrides altogether.
  const transformedManifest = Object.prototype.hasOwnProperty.call(
    overrides,
    'transformedManifest'
  )
    ? overrides.transformedManifest
    : createMockManifest();
  const query = overrides.query ?? defaultItemViewerContext.query;
  const canvasIndexById =
    overrides.canvasIndexById ?? defaultItemViewerContext.canvasIndexById;

  const totalCanvases = transformedManifest?.canvases.length ?? 0;
  const currentCanvas = getCurrentCanvas({
    transformedManifest,
    canvasIndexById,
    canvasNumber: query.canvas,
  });

  return {
    ...defaultItemViewerContext,
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

export type RenderWithContextOptions = {
  appContext?: Partial<AppContextProps>;
  userContext?: Partial<UserContextProps>;
  kioskContext?: Partial<KioskContextType>;
  contextProps?: ItemViewerContextOverrides;
} & Omit<RenderOptions, 'wrapper'>;

export type RenderWithContextResult = RenderResult & {
  contextValue: ItemViewerContextProps;
};

export function renderWithContext(
  ui: ReactElement,
  options: RenderWithContextOptions = {}
): RenderWithContextResult {
  const contextValue = createMockItemViewerContext(options.contextProps);

  const {
    contextProps,
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
