import { constructHierarchy } from './exhibition-guides';

const componentsWithPartOf = [
  {
    title: 'Section One',
    partOf: undefined,
  },
  { title: 'Stop One', partOf: 'Section One' },

  { title: 'Stop Two', partOf: 'Section One' },
  {
    title: 'Sub Section One',
    partOf: 'Section One',
  },
  { title: 'Stop Three', partOf: 'Sub Section One' },
  { title: 'Stop Four', partOf: 'Sub Section One' },
  {
    title: 'Sub Sub Section One',
    partOf: 'Sub Section One',
  },
  { title: 'Stop Five', partOf: 'Sub Sub Section One' },
  { title: 'Stop Six', partOf: 'Sub Sub Section One' },
  {
    title: 'Sub Section Two',
    partOf: 'Section One',
  },
  { title: 'Stop Seven', partOf: 'Sub Section Two' },
  { title: 'Stop Eight', partOf: 'Section One' },
];

const componentsWithoutPartOf = [
  {
    title: 'Section One',
  },
  { title: 'Stop One' },

  { title: 'Stop Two' },
  {
    title: 'Sub Section One',
  },
  { title: 'Stop Three' },
  { title: 'Stop Four' },
  {
    title: 'Sub Sub Section One',
  },
  { title: 'Stop Five' },
  { title: 'Stop Six' },
  {
    title: 'Sub Section Two',
  },
  { title: 'Stop Seven' },
  { title: 'Stop Eight' },
];

// TODO add some more tests with different data scenarios
describe('constructHierarchy', () => {
  it('returns a hierachy of components, based on their partOf and title properties', () => {
    expect(constructHierarchy(componentsWithPartOf)).toEqual([
      {
        title: 'Section One',
        parts: [
          { title: 'Stop One' },
          { title: 'Stop Two' },
          {
            title: 'Sub Section One',
            parts: [
              { title: 'Stop Three' },
              { title: 'Stop Four' },
              {
                title: 'Sub Sub Section One',
                parts: [{ title: 'Stop Five' }, { title: 'Stop Six' }],
              },
            ],
          },
          {
            title: 'Sub Section Two',
            parts: [{ title: 'Stop Seven' }],
          },
          { title: 'Stop Eight' },
        ],
      },
    ]);
  });

  // TODO If nothing has a partOf, at present there is no nesting, is this the expected behaviour or should we make it so that everything is nested under first component? - that might make life easier for the editors, if an exhibition has a pretty flat structure
  it('returns a flat list, if no components have partOf data', () => {
    expect(constructHierarchy(componentsWithoutPartOf)).toEqual([
      {
        title: 'Section One',
      },
      {
        title: 'Stop One',
      },
      {
        title: 'Stop Two',
      },
      {
        title: 'Sub Section One',
      },
      {
        title: 'Stop Three',
      },
      {
        title: 'Stop Four',
      },
      {
        title: 'Sub Sub Section One',
      },
      {
        title: 'Stop Five',
      },
      {
        title: 'Stop Six',
      },
      {
        title: 'Sub Section Two',
      },
      {
        title: 'Stop Seven',
      },
      {
        title: 'Stop Eight',
      },
    ]);
  });

  // TODO if partOfs are out of order, the order within each level is based on the order of the original component list
});
