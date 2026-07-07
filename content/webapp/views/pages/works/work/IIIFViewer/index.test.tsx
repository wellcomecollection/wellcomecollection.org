import { arrayIndexToQueryParam, queryParamToArrayIndex } from '.';

// Importing from the barrel pulls in IIIFViewer -> ImageViewer -> openseadragon;
// stub it so these pure-function tests don't hit the jsdom canvas error.
jest.mock('openseadragon', () => ({ __esModule: true, default: jest.fn() }));

// canvas/manifest query params are 1-based but index 0-based arrays, so these
// conversions sit behind currentCanvas selection and navigation throughout the
// viewer.
describe('queryParamToArrayIndex', () => {
  it('converts a 1-based query param to a 0-based array index', () => {
    expect(queryParamToArrayIndex(1)).toBe(0);
    expect(queryParamToArrayIndex(5)).toBe(4);
  });
});

describe('arrayIndexToQueryParam', () => {
  it('converts a 0-based array index to a 1-based query param', () => {
    expect(arrayIndexToQueryParam(0)).toBe(1);
    expect(arrayIndexToQueryParam(4)).toBe(5);
  });
});

describe('index conversions round-trip', () => {
  it('are inverses of one another', () => {
    expect(queryParamToArrayIndex(arrayIndexToQueryParam(0))).toBe(0);
    expect(arrayIndexToQueryParam(queryParamToArrayIndex(3))).toBe(3);
  });
});
