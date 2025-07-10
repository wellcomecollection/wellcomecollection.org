import { getTabbableIds } from './ArchiveTree.helpers';

describe('getTabbableIds', () => {
  it('finds all IDs', () => {
    const tree = [
      {
        work: { id: 'PENROSE' },
      },
      {
        work: { id: 'CRICK' },
      },
    ];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const result = getTabbableIds(tree as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
    expect(result).toStrictEqual(['PENROSE', 'CRICK']);
  });

  it('includes IDs of nodes which aren’t open', () => {
    const tree = [
      {
        work: { id: 'PENROSE' },
        openStatus: true,
      },
      {
        work: { id: 'CRICK' },
        openStatus: false,
      },
    ];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const result = getTabbableIds(tree as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
    expect(result).toStrictEqual(['PENROSE', 'CRICK']);
  });

  it('only recurses into the children of open elements', () => {
    const tree = [
      {
        work: { id: 'PENROSE' },
        openStatus: true,
        children: [
          { work: { id: 'PENROSE/1' } },
          { work: { id: 'PENROSE/2' } },
          {
            work: { id: 'PENROSE/3' },
            openStatus: false,
            children: [{ work: { id: 'PENROSE/3/1' } }],
          },
          {
            work: { id: 'PENROSE/4' },
            openStatus: true,
            children: [{ work: { id: 'PENROSE/4/1' } }],
          },
        ],
      },
      {
        work: { id: 'CRICK' },
        openStatus: false,
        children: [
          { work: { id: 'CRICK/1' } },
          { work: { id: 'CRICK/2' } },
          {
            // Although this child is open, because the parent is closed we shouldn't
            // recurse down to it.
            work: { id: 'CRICK/3' },
            openStatus: true,
            children: [{ work: { id: 'CRICK/3/1' } }],
          },
        ],
      },
    ];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const result = getTabbableIds(tree as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
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
