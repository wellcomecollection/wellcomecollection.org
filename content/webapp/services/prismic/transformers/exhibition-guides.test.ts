import { constructHierarchy } from './exhibition-guides';

const testComponentData = [
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

// TODO add some more tests with different data scenarios
describe('constructHierarchy', () => {
  it('returns a hierachy of components, based on their partOf and title properties', () => {
    expect(constructHierarchy(testComponentData)).toEqual([
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
});
