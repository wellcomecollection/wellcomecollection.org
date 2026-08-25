import { act, renderHook, waitFor } from '@testing-library/react';
import { FunctionComponent, PropsWithChildren } from 'react';

import UserContext, {
  defaultUserContext,
} from '@weco/common/contexts/UserContext';
import ItemViewerContextLegacy, {
  defaultItemViewerContext as defaultItemViewerContextLegacy,
} from '@weco/content/contexts/ItemViewerContext/legacy';
import ItemViewerContextRefactored, {
  defaultItemViewerContext as defaultItemViewerContextRefactored,
} from '@weco/content/contexts/ItemViewerContext/refactored';
import {
  createMockCanvas,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import useIIIFProbeService from './useIIIFProbeService';

// The probe hook gates restricted media: it returns true immediately for
// unrestricted canvases, and for restricted ones only once the auth cookie is
// confirmed via the probe service (for a logged-in staff user with a token).
// This exercises that matrix with mocked user state and fetch.
//
// The hook reads accessToken via the feature-flag-aware useItemViewerContext()
// barrel, so the whole matrix runs against both the legacy and refactored
// context to catch either side silently no longer supplying accessToken.
let mockItemViewerRefactor = false;

jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: mockItemViewerRefactor }),
}));

type WrapperOptions = {
  userIsStaffWithRestricted?: boolean;
  accessToken?: string;
};

const restrictedCanvas = (probeServiceId?: string) =>
  createMockCanvas({ painting: [createRestrictedPainting()], probeServiceId });

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
});

describe.each([
  { name: 'legacy', itemViewerRefactor: false },
  { name: 'refactored', itemViewerRefactor: true },
])('useIIIFProbeService ($name context)', ({ itemViewerRefactor }) => {
  beforeEach(() => {
    mockItemViewerRefactor = itemViewerRefactor;
  });

  const createWrapper =
    ({
      userIsStaffWithRestricted = false,
      accessToken,
    }: WrapperOptions): FunctionComponent<PropsWithChildren> =>
    ({ children }) => (
      <UserContext.Provider
        value={{ ...defaultUserContext, userIsStaffWithRestricted }}
      >
        {itemViewerRefactor ? (
          <ItemViewerContextRefactored.Provider
            value={{ ...defaultItemViewerContextRefactored, accessToken }}
          >
            {children}
          </ItemViewerContextRefactored.Provider>
        ) : (
          <ItemViewerContextLegacy.Provider
            value={{ ...defaultItemViewerContextLegacy, accessToken }}
          >
            {children}
          </ItemViewerContextLegacy.Provider>
        )}
      </UserContext.Provider>
    );

  it('returns true immediately for an unrestricted canvas', () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(createMockCanvas()),
      {
        wrapper: createWrapper({}),
      }
    );

    expect(result.current).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('stays false and does not probe for a restricted canvas when the user is not staff', () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(restrictedCanvas('https://example.com/probe')),
      { wrapper: createWrapper({ userIsStaffWithRestricted: false }) }
    );

    expect(result.current).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('stays false and does not probe when StaffWithRestricted user has no access token', () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(restrictedCanvas('https://example.com/probe')),
      {
        wrapper: createWrapper({
          userIsStaffWithRestricted: true,
          accessToken: undefined,
        }),
      }
    );

    expect(result.current).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns true without probing when a restricted canvas has no probe service', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(restrictedCanvas()),
      {
        wrapper: createWrapper({
          userIsStaffWithRestricted: true,
          accessToken: 'token-123',
        }),
      }
    );

    await waitFor(() => expect(result.current).toBe(true));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('probes with the access token and returns true when the probe reports status 200', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: 200 }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(restrictedCanvas('https://example.com/probe')),
      {
        wrapper: createWrapper({
          userIsStaffWithRestricted: true,
          accessToken: 'token-123',
        }),
      }
    );

    await waitFor(() => expect(result.current).toBe(true));
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/probe', {
      headers: { Authorization: 'Bearer token-123' },
    });
  });

  it('keeps retrying indefinitely on repeated non-200 probe responses, never falling back to true on a guess', async () => {
    jest.useFakeTimers();
    const fetchMock = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: 403 }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(restrictedCanvas('https://example.com/probe')),
      {
        wrapper: createWrapper({
          userIsStaffWithRestricted: true,
          accessToken: 'token-123',
        }),
      }
    );

    // Initial state: false (restricted canvas)
    expect(result.current).toBe(false);

    // Advance well past where the old 5-attempt budget would have given up.
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(5000);
      });
    }

    // Still false — a real answer is required, never a timeout-based guess.
    expect(result.current).toBe(false);
    expect(fetchMock.mock.calls.length).toBeGreaterThan(5);

    jest.useRealTimers();
  });

  it('resolves true once a probe attempt eventually succeeds after repeated failures', async () => {
    jest.useFakeTimers();
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ status: 403 }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ status: 403 }) })
      .mockResolvedValue({ json: () => Promise.resolve({ status: 200 }) });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(restrictedCanvas('https://example.com/probe')),
      {
        wrapper: createWrapper({
          userIsStaffWithRestricted: true,
          accessToken: 'token-123',
        }),
      }
    );

    expect(result.current).toBe(false);

    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(5000);
      });
    }

    await waitFor(() => expect(result.current).toBe(true));

    jest.useRealTimers();
  });

  it('keeps retrying indefinitely on repeated network errors, never falling back to true on a guess', async () => {
    jest.useFakeTimers();
    const fetchMock = jest.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(restrictedCanvas('https://example.com/probe')),
      {
        wrapper: createWrapper({
          userIsStaffWithRestricted: true,
          accessToken: 'token-123',
        }),
      }
    );

    // Initial state: false (restricted canvas)
    expect(result.current).toBe(false);

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(5000);
      });
    }

    expect(result.current).toBe(false);
    expect(fetchMock.mock.calls.length).toBeGreaterThan(5);

    jest.useRealTimers();
  });
});
