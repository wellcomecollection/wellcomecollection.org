import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import { getTabbableIds } from './NestedList.helpers';

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
