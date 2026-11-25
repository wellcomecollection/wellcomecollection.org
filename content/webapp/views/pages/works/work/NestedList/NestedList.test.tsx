import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { AppContextProvider } from '@weco/common/contexts/AppContext';
import theme from '@weco/common/views/themes/default';
import {
  TreeDataCanvas,
  TreeDataWork,
  UiTree,
} from '@weco/content/views/pages/works/work/work.types';

import { getTabbableIds } from './NestedList.helpers';
import ListItem from './NestedList.ListItem';

describe('NestedList', () => {
  describe('getTabbableIds', () => {
    it('finds all IDs', () => {
      const tree = [
        {
          data: { id: 'PENROSE' },
        },
        {
          data: { id: 'CRICK' },
        },
      ];
      const result = getTabbableIds(tree as unknown as UiTree);
      expect(result).toStrictEqual(['PENROSE', 'CRICK']);
    });

    it('includes IDs of nodes which are not open', () => {
      const tree = [
        {
          data: { id: 'PENROSE' },
          openStatus: true,
        },
        {
          data: { id: 'CRICK' },
          openStatus: false,
        },
      ];
      const result = getTabbableIds(tree as unknown as UiTree);
      expect(result).toStrictEqual(['PENROSE', 'CRICK']);
    });

    it('only recurses into the children of open elements', () => {
      const tree = [
        {
          data: { id: 'PENROSE' },
          openStatus: true,
          children: [
            { data: { id: 'PENROSE/1' } },
            { data: { id: 'PENROSE/2' } },
            {
              data: { id: 'PENROSE/3' },
              openStatus: false,
              children: [{ data: { id: 'PENROSE/3/1' } }],
            },
            {
              data: { id: 'PENROSE/4' },
              openStatus: true,
              children: [{ data: { id: 'PENROSE/4/1' } }],
            },
          ],
        },
        {
          data: { id: 'CRICK' },
          openStatus: false,
          children: [
            { data: { id: 'CRICK/1' } },
            { data: { id: 'CRICK/2' } },
            {
              // Although this child is open, because the parent is closed we shouldn't
              // recurse down to it.
              data: { id: 'CRICK/3' },
              openStatus: true,
              children: [{ data: { id: 'CRICK/3/1' } }],
            },
          ],
        },
      ];
      const result = getTabbableIds(tree as unknown as UiTree);
      expect(result).toStrictEqual([
        'PENROSE',
        'PENROSE/1',
        'PENROSE/2',
        'PENROSE/3',
        'PENROSE/4',
        'PENROSE/4/1',
        'CRICK',
      ]);
    });
  });

  describe('expandability logic', () => {
    const mockItemRenderer = jest.fn(() => null);

    const defaultProps = {
      index: 0,
      currentWorkId: 'current-work',
      setTree: jest.fn(),
      tree: [] as UiTree,
      level: 1,
      setSize: 1,
      posInSet: 1,
      tabbableId: undefined,
      setTabbableId: jest.fn(),
      firstItemTabbable: false,
      showFirstLevelGuideline: false,
      ItemRenderer: mockItemRenderer,
      shouldFetchChildren: false,
    };

    beforeEach(() => {
      mockItemRenderer.mockClear();
    });

    it('treats a Work with parts array as expandable even without totalParts', () => {
      const item = {
        data: {
          id: 'work-1',
          title: 'Archive Work',
          alternativeTitles: [],
          referenceNumber: 'REF/1',
          availableOnline: false,
          availabilities: [],
          type: 'Work' as const,
          parts: [
            {
              id: 'child-1',
              title: 'Child 1',
              alternativeTitles: [],
              referenceNumber: 'REF/1/1',
              availableOnline: false,
              availabilities: [],
              type: 'Work' as const,
            },
          ],
        } as TreeDataWork,
        openStatus: false,
      };

      render(
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <ListItem {...defaultProps} item={item} />
          </AppContextProvider>
        </ThemeProvider>
      );

      expect(mockItemRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          hasControl: true,
        }),
        undefined
      );
    });

    it('treats a Work with totalParts > 0 as expandable', () => {
      const item = {
        data: {
          id: 'work-2',
          title: 'Nested Work',
          alternativeTitles: [],
          referenceNumber: 'REF/2',
          availableOnline: false,
          availabilities: [],
          type: 'Work' as const,
          totalParts: 5,
        } as TreeDataWork,
        openStatus: false,
      };

      render(
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <ListItem {...defaultProps} item={item} />
          </AppContextProvider>
        </ThemeProvider>
      );

      expect(mockItemRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          hasControl: true,
        }),
        undefined
      );
    });

    it('treats a Work with totalParts === 0 as not expandable', () => {
      const item = {
        data: {
          id: 'work-3',
          title: 'End Node Work',
          alternativeTitles: [],
          referenceNumber: 'REF/3',
          availableOnline: false,
          availabilities: [],
          type: 'Work' as const,
          totalParts: 0,
        } as TreeDataWork,
        openStatus: false,
      };

      render(
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <ListItem {...defaultProps} item={item} />
          </AppContextProvider>
        </ThemeProvider>
      );

      expect(mockItemRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          hasControl: false,
        }),
        undefined
      );
    });

    it('treats a Work with neither parts nor totalParts as not expandable', () => {
      const item = {
        data: {
          id: 'work-4',
          title: 'Minimal Work',
          alternativeTitles: [],
          referenceNumber: 'REF/4',
          availableOnline: false,
          availabilities: [],
          type: 'Work' as const,
        } as TreeDataWork,
        openStatus: false,
      };

      render(
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <ListItem {...defaultProps} item={item} />
          </AppContextProvider>
        </ThemeProvider>
      );

      expect(mockItemRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          hasControl: false,
        }),
        undefined
      );
    });

    it('treats Canvas/Range with totalParts > 0 as expandable', () => {
      const item = {
        data: {
          id: 'canvas-1',
          title: 'Canvas Item',
          type: 'Canvas',
          totalParts: 3,
        } as TreeDataCanvas, // Simplified mock for testing expandability logic
        openStatus: false,
      };

      render(
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <ListItem {...defaultProps} item={item} />
          </AppContextProvider>
        </ThemeProvider>
      );

      expect(mockItemRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          hasControl: true,
        }),
        undefined
      );
    });
  });
});
