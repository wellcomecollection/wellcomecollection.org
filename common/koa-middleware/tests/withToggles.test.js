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

  describe('enableDisableToggle', () => {
    const cookieFn = jest.fn();
    const defaultCtx = {
      toggles: {
        buildingReopening: true,
        modalFiltersPrototype: false,
      },
      cookies: {
        set: cookieFn,
      },
    };

    it('should set feature toggle cookie and set httpOnly to false', () => {
      const ctx = {
        ...defaultCtx,
        query: {
          toggle: 'modalFiltersPrototype',
        },
      };

      withToggles.enableDisableToggle(ctx);
      expect(cookieFn).toBeCalledTimes(1);
      expect(cookieFn).toBeCalledWith('toggle_modalFiltersPrototype', true, {
        httpOnly: false,
        maxAge: 31536000,
      });
    });

    it('should delete existing feature toggle cookie', () => {
      const ctx = {
        ...defaultCtx,
        query: {
          toggle: '!modalFiltersPrototype',
        },
      };

      withToggles.enableDisableToggle(ctx);
      expect(cookieFn).toBeCalledTimes(1);
      expect(cookieFn).toBeCalledWith('toggle_modalFiltersPrototype', null);
    });

    it('should only find valid feature toggle before setting or deleting cookie', () => {
      const cookieFn = jest.fn();
      const ctxMockFeatureToggleOff = {
        ...defaultCtx,
        query: {
          toggle: '!dummyNameFeatureToggle',
        },
      };

      withToggles.enableDisableToggle(ctxMockFeatureToggleOff);
      expect(cookieFn).toBeCalledTimes(0);

      const ctxMockFeatureToggleOn = {
        ...defaultCtx,
        query: {
          toggle: 'dummyFeatureToggle',
        },
      };

      withToggles.enableDisableToggle(ctxMockFeatureToggleOn);
      expect(cookieFn).toBeCalledTimes(0);
    });
  });
});
