# IIIF Viewer Context Refactoring - Testing Guide

**Related:** See [refactoring-iiif-viewer-context.md](./refactoring-iiif-viewer-context.md) for the main refactoring plan.

This document contains detailed test examples for the IIIF Viewer context refactoring. All tests should use proper TypeScript types.

## Phase 1 Testing

### 1.1 Context Provider Unit Tests

**File:** `content/webapp/contexts/ItemViewerContextV2/ItemViewerContextV2.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import type { FC } from 'react';

import ItemViewerContextV2, { ItemViewerContextV2Props } from './index';
import { mockDefaultContext } from './test-utils';

// Test component that displays context values
const ContextValueDisplay: FC = () => {
  const {
    currentCanvas,
    currentCanvasIndex,
    mainImageService,
    hasMultipleCanvases,
    isCurrentCanvasRestricted,
    isFirstCanvas,
    isLastCanvas,
    canNavigateNext,
    canNavigatePrevious,
    hasIiifImageService,
    isImageZoomable,
    isWorkBornDigital,
  } = ItemViewerContextV2._currentValue;

  return (
    <div>
      <div data-testid="currentCanvasIndex">{currentCanvasIndex}</div>
      <div data-testid="currentCanvasId">{currentCanvas?.id || 'none'}</div>
      <div data-testid="mainImageServiceId">{mainImageService['@id'] || 'none'}</div>
      <div data-testid="hasMultipleCanvases">{String(hasMultipleCanvases)}</div>
      <div data-testid="isCurrentCanvasRestricted">{String(isCurrentCanvasRestricted)}</div>
      <div data-testid="isFirstCanvas">{String(isFirstCanvas)}</div>
      <div data-testid="isLastCanvas">{String(isLastCanvas)}</div>
      <div data-testid="canNavigateNext">{String(canNavigateNext)}</div>
      <div data-testid="canNavigatePrevious">{String(canNavigatePrevious)}</div>
      <div data-testid="hasIiifImageService">{String(hasIiifImageService)}</div>
      <div data-testid="isImageZoomable">{String(isImageZoomable)}</div>
      <div data-testid="isWorkBornDigital">{String(isWorkBornDigital)}</div>
    </div>
  );
};

describe('ItemViewerContextV2 - Derived Canvas Data', () => {
  it('should calculate currentCanvasIndex from canvas query param', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      query: { canvas: 3, manifest: 1, page: 1, shouldScrollToCanvas: true, query: '' },
      currentCanvasIndex: 2, // canvas=3 to index 2
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('currentCanvasIndex')).toHaveTextContent('2');
  });

  it('should handle mainImageService with empty string fallback', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      currentCanvas: { id: 'canvas-1', imageServiceId: undefined },
      mainImageService: { '@id': '' },
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('mainImageServiceId')).toHaveTextContent('none');
  });

  it('should detect multiple canvases correctly', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      transformedManifest: {
        canvases: [
          { id: 'c1', label: 'Canvas 1' },
          { id: 'c2', label: 'Canvas 2' },
        ],
      },
      hasMultipleCanvases: true,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('hasMultipleCanvases')).toHaveTextContent('true');
  });

  it('should correctly identify restricted canvas', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      currentCanvas: {
        id: 'canvas-1',
        label: 'Canvas 1',
        accessConditions: [{ type: 'RestrictedAccess' }],
      },
      isCurrentCanvasRestricted: true,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('isCurrentCanvasRestricted')).toHaveTextContent('true');
  });

  it('should correctly calculate navigation booleans for first canvas', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      currentCanvasIndex: 0,
      transformedManifest: {
        canvases: [
          { id: 'c1', label: 'Canvas 1' },
          { id: 'c2', label: 'Canvas 2' },
          { id: 'c3', label: 'Canvas 3' },
        ],
      },
      hasMultipleCanvases: true,
      isFirstCanvas: true,
      isLastCanvas: false,
      canNavigateNext: true,
      canNavigatePrevious: false,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('isFirstCanvas')).toHaveTextContent('true');
    expect(screen.getByTestId('isLastCanvas')).toHaveTextContent('false');
    expect(screen.getByTestId('canNavigateNext')).toHaveTextContent('true');
    expect(screen.getByTestId('canNavigatePrevious')).toHaveTextContent('false');
  });

  it('should correctly calculate navigation booleans for last canvas', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      currentCanvasIndex: 2,
      transformedManifest: {
        canvases: [
          { id: 'c1', label: 'Canvas 1' },
          { id: 'c2', label: 'Canvas 2' },
          { id: 'c3', label: 'Canvas 3' },
        ],
      },
      hasMultipleCanvases: true,
      isFirstCanvas: false,
      isLastCanvas: true,
      canNavigateNext: false,
      canNavigatePrevious: true,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('isFirstCanvas')).toHaveTextContent('false');
    expect(screen.getByTestId('isLastCanvas')).toHaveTextContent('true');
    expect(screen.getByTestId('canNavigateNext')).toHaveTextContent('false');
    expect(screen.getByTestId('canNavigatePrevious')).toHaveTextContent('true');
  });

  it('should detect IIIF image service correctly', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      currentCanvas: {
        id: 'canvas-1',
        label: 'Canvas 1',
        imageServiceId: 'https://iiif.example.com/image/123',
      },
      hasIiifImageService: true,
      isImageZoomable: true,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('hasIiifImageService')).toHaveTextContent('true');
    expect(screen.getByTestId('isImageZoomable')).toHaveTextContent('true');
  });

  it('should detect born digital works', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      work: {
        id: 'work-1',
        title: 'Test Work',
        production: [{ type: 'BornDigital' }],
      },
      isWorkBornDigital: true,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('isWorkBornDigital')).toHaveTextContent('true');
  });
});
```

### 1.2 Mock Utilities with Types

**File:** `content/webapp/contexts/ItemViewerContextV2/test-utils.ts`

```typescript
import type { ItemViewerContextV2Props } from './index';
import type { TransformedManifest } from '@weco/content/types/manifest';
import type { WorkBasic, Work } from '@weco/content/services/wellcome/catalogue/types';
import type { CanvasRotatedImage } from '@weco/content/types/item-viewer';
import type { UiTree } from '@weco/content/views/pages/works/work/work.types';

export const mockDefaultContext: ItemViewerContextV2Props = {
  // EXISTING PROPS (unchanged)
  query: { 
    canvas: 1, 
    manifest: 1, 
    page: 1, 
    shouldScrollToCanvas: true, 
    query: '' 
  },
  work: { 
    id: 'test', 
    title: 'Test Work',
    alternativeTitles: [],
    description: undefined,
    languageId: undefined,
    thumbnail: undefined,
    referenceNumber: undefined,
    productionDates: [],
    archiveLabels: undefined,
    cardLabels: [],
    primaryContributorLabel: undefined,
    notes: [],
  } as WorkBasic & Pick<Work, 'description'>,
  transformedManifest: undefined as TransformedManifest | undefined,
  parentManifest: undefined,
  searchResults: null,
  setSearchResults: jest.fn(),
  accessToken: undefined,
  archiveTree: [] as UiTree,
  setArchiveTree: jest.fn(),
  canvasIndexById: {},
  
  // UI PROPS
  viewerRef: { current: null },
  mainAreaRef: { current: null },
  mainAreaWidth: 1000,
  mainAreaHeight: 500,
  gridVisible: false,
  setGridVisible: jest.fn(),
  isFullscreen: false,
  setIsFullscreen: jest.fn(),
  isDesktopSidebarActive: true,
  setIsDesktopSidebarActive: jest.fn(),
  isMobileSidebarActive: false,
  setIsMobileSidebarActive: jest.fn(),
  showZoomed: false,
  setShowZoomed: jest.fn(),
  showFullscreenControl: false,
  setShowFullscreenControl: jest.fn(),
  showControls: false,
  setShowControls: jest.fn(),
  rotatedImages: [] as CanvasRotatedImage[],
  setRotatedImages: jest.fn(),
  isResizing: false,
  errorHandler: undefined,
  hasOnlyRenderableImages: false,
  
  // NEW: DERIVED CANVAS DATA (Phase 1)
  currentCanvasIndex: 0,
  currentCanvas: undefined,
  mainImageService: { '@id': undefined },
  urlTemplate: undefined,
  imageUrl: undefined,
  
  // NEW: CANVAS-RELATED BOOLEANS
  hasMultipleCanvases: false,
  isCurrentCanvasRestricted: false,
  isFirstCanvas: true,
  isLastCanvas: true,
  canNavigateNext: false,
  canNavigatePrevious: false,
  
  // NEW: IMAGE SERVICE BOOLEANS
  hasIiifImageService: false,
  hasIiifImage: false,
  shouldUseIiifImageLocation: false,
  hasOnlyRenderableImages: false,
  isImageZoomable: false,
  
  // NEW: WORK TYPE BOOLEANS
  isWorkBornDigital: false,
  hasVideoContent: false,
  hasAudioContent: false,
  
  // NEW: DOWNLOAD BOOLEANS
  hasDownloadOptions: false,
  canDownloadCurrentCanvas: false,
};
```

### 1.3 Component Integration Tests

**File:** `content/webapp/views/pages/works/work/IIIFViewer/IIIFViewer.refactored.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';

import IIIFViewerRefactored from './IIIFViewer.refactored';
import type { TransformedManifest } from '@weco/content/types/manifest';
import type { WorkBasic, Work } from '@weco/content/services/wellcome/catalogue/types';

const mockRouter: NextRouter = {
  pathname: '/works/[workId]/items',
  route: '/works/[workId]/items',
  query: { workId: 'test-work', canvas: '1' },
  asPath: '/works/test-work/items',
  basePath: '',
  isLocaleDomain: false,
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isReady: true,
  isPreview: false,
};

const mockWork: WorkBasic & Pick<Work, 'description'> = {
  id: 'test-work',
  title: 'Test Work',
  alternativeTitles: [],
  production: [],
  description: 'Test description',
};

const mockTransformedManifest: TransformedManifest = {
  id: 'test-manifest',
  label: 'Test Manifest',
  canvases: [
    { 
      id: 'canvas-1', 
      label: 'Canvas 1',
      width: 1000,
      height: 1000,
    },
  ],
};

describe('IIIFViewer.refactored - Context Integration', () => {
  it('should provide currentCanvas to child components', () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <IIIFViewerRefactored
          work={mockWork}
          transformedManifest={mockTransformedManifest}
          searchResults={null}
          setSearchResults={jest.fn()}
        />
      </RouterContext.Provider>
    );

    // Verify ViewerTopBar can access currentCanvas
    expect(screen.queryByTestId('viewer-top-bar')).toBeInTheDocument();
  });

  it('should provide navigation booleans to components', () => {
    const manifest: TransformedManifest = {
      ...mockTransformedManifest,
      canvases: [
        { id: 'c1', label: 'Canvas 1', width: 1000, height: 1000 },
        { id: 'c2', label: 'Canvas 2', width: 1000, height: 1000 },
        { id: 'c3', label: 'Canvas 3', width: 1000, height: 1000 },
      ],
    };

    render(
      <RouterContext.Provider value={{ ...mockRouter, query: { workId: 'test', canvas: '1' } }}>
        <IIIFViewerRefactored
          work={mockWork}
          transformedManifest={manifest}
          searchResults={null}
          setSearchResults={jest.fn()}
        />
      </RouterContext.Provider>
    );

    // First canvas - previous should be disabled
    const prevButton = screen.queryByLabelText(/previous/i);
    expect(prevButton).toBeDisabled();
    
    // Next should be enabled
    const nextButton = screen.queryByLabelText(/next/i);
    expect(nextButton).not.toBeDisabled();
  });

  it('should provide boolean flags for conditional rendering', () => {
    const restrictedManifest: TransformedManifest = {
      ...mockTransformedManifest,
      canvases: [{
        id: 'c1',
        label: 'Canvas 1',
        width: 1000,
        height: 1000,
        accessConditions: [{ type: 'RestrictedAccess' }],
      }],
    };

    render(
      <RouterContext.Provider value={mockRouter}>
        <IIIFViewerRefactored
          work={mockWork}
          transformedManifest={restrictedManifest}
          searchResults={null}
          setSearchResults={jest.fn()}
        />
      </RouterContext.Provider>
    );

    // Verify restricted badge appears when isCurrentCanvasRestricted is true
    expect(screen.queryByText(/restricted/i)).toBeInTheDocument();
  });
});
```

**File:** `content/webapp/views/pages/works/work/IIIFViewer/ViewerTopBar.refactored.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import type { FC } from 'react';

import ItemViewerContextV2, { ItemViewerContextV2Props } from '@weco/content/contexts/ItemViewerContextV2';
import { mockDefaultContext } from '@weco/content/contexts/ItemViewerContextV2/test-utils';

import ViewerTopBarRefactored from './ViewerTopBar.refactored';
import type { TransformedCanvas } from '@weco/content/types/manifest';

describe('ViewerTopBar.refactored - Context Consumption', () => {
  it('should use currentCanvas from context instead of calculating it', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      currentCanvas: {
        id: 'test-canvas',
        label: 'Test Canvas',
        width: 1000,
        height: 1000,
      } as TransformedCanvas,
      hasDownloadOptions: true,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ViewerTopBarRefactored />
      </ItemViewerContextV2.Provider>
    );

    // Should render download button because hasDownloadOptions is true
    expect(screen.queryByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('should use navigation booleans from context', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      canNavigateNext: false,
      canNavigatePrevious: true,
      isLastCanvas: true,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ViewerTopBarRefactored />
      </ItemViewerContextV2.Provider>
    );

    // Next button should be disabled when canNavigateNext is false
    const nextButton = screen.queryByLabelText(/next/i);
    expect(nextButton).toBeDisabled();

    // Previous button should be enabled when canNavigatePrevious is true
    const prevButton = screen.queryByLabelText(/previous/i);
    expect(prevButton).not.toBeDisabled();
  });

  it('should use isCurrentCanvasRestricted from context', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      isCurrentCanvasRestricted: true,
      canDownloadCurrentCanvas: false,
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ViewerTopBarRefactored />
      </ItemViewerContextV2.Provider>
    );

    // Restricted badge should appear
    expect(screen.queryByText(/restricted/i)).toBeInTheDocument();
    
    // Download should be disabled for restricted content
    expect(screen.queryByRole('button', { name: /download/i })).toBeDisabled();
  });
});
```

## Manual Testing Checklist

See Phase 1.8 in the main refactoring document for the complete manual testing checklist.

---

**Last Updated:** 1 April 2026
