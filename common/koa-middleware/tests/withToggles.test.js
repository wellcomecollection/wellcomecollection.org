import withToggles from '../withToggles';
const nextMock = jest.fn();
const mockToggleResponse = {
  toggles: [
    {
      id: 'buildingReopening',
      title: 'Wellcome Collection reopening UI changes',
      description:
        'Show additions/amendments made in preparation for the reopening of the Wellcome Collection building',
      defaultValue: true,
    },
    {
      id: 'modalFiltersPrototype',
      title: 'Use the modal filter prototype',
      defaultValue: false,
      description: 'Search filters will appear in a modal',
    },
  ],
};

jest.mock('isomorphic-unfetch', () => {
  return jest.fn(() =>
    Promise.resolve({
      json: () => mockToggleResponse,
    })
  );
});

describe('withToggles', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should provide ctx toggles', async done => {
    const ctx = {
      req: {
        headers: {},
      },
      query: {},
    };

    const expectedCtx = {
      req: {
        headers: {},
      },
      query: {},
      toggles: {
        buildingReopening: true,
        modalFiltersPrototype: false,
      },
    };

    // setTimeout is needed to mock this.
    setTimeout(() => {
      withToggles(ctx, nextMock);
      expect(ctx).toEqual(expectedCtx);
      done();
    }, 500);
  });
});
