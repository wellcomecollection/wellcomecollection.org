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

import useIIIFProbeService, {
  __resetProbeRegistryForTests,
  invalidateProbe,
} from './useIIIFProbeService';

// The probe hook gates restricted media: it reports 'ok' immediately for
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

// Several tests below call this inline inside the renderHook callback
// (`() => useIIIFProbeService(restrictedCanvas(...))`), which re-invokes it
// on every re-render — so the ID must stay fixed per call args, not
// per-invocation, or each re-render would restart probing on a "new" canvas
// forever. Cross-test isolation instead comes from resetting the
// module-level registry in afterEach (see __resetProbeRegistryForTests).
const restrictedCanvas = (probeServiceId?: string) =>
  createMockCanvas({ painting: [createRestrictedPainting()], probeServiceId });

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
  __resetProbeRegistryForTests();
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

  it("reports 'ok' immediately for an unrestricted canvas", () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(createMockCanvas()),
      {
        wrapper: createWrapper({}),
      }
    );

    expect(result.current).toBe('ok');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("stays 'probing' and does not probe for a restricted canvas when the user is not staff", () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(
      () => useIIIFProbeService(restrictedCanvas('https://example.com/probe')),
      { wrapper: createWrapper({ userIsStaffWithRestricted: false }) }
    );

    expect(result.current).toBe('probing');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("stays 'probing' and does not probe when StaffWithRestricted user has no access token", () => {
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

    expect(result.current).toBe('probing');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports 'ok' without probing when a restricted canvas has no probe service", async () => {
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

    await waitFor(() => expect(result.current).toBe('ok'));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("probes with the access token and reports 'ok' when the probe reports status 200", async () => {
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

    await waitFor(() => expect(result.current).toBe('ok'));
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/probe', {
      headers: { Authorization: 'Bearer token-123' },
    });
  });

  it("gives up and reports 'failed' after repeated non-200 probe responses, never falling back to 'ok' on a guess", async () => {
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

    // Initial state: 'probing' (restricted canvas)
    expect(result.current).toBe('probing');

    // Advance well past where the bounded attempt budget gives up.
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(5000);
      });
    }

    // Gives up explicitly rather than guessing 'ok' on a timeout.
    expect(result.current).toBe('failed');

    jest.useRealTimers();
  });

  it("resolves 'ok' once a probe attempt eventually succeeds after repeated failures", async () => {
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

    expect(result.current).toBe('probing');

    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(5000);
      });
    }

    await waitFor(() => expect(result.current).toBe('ok'));

    jest.useRealTimers();
  });

  it("gives up and reports 'failed' after repeated network errors, never falling back to 'ok' on a guess", async () => {
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

    // Initial state: 'probing' (restricted canvas)
    expect(result.current).toBe('probing');

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(5000);
      });
    }

    expect(result.current).toBe('failed');

    jest.useRealTimers();
  });

  it('shares a single underlying poll across two components probing the same canvas', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: 200 }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const canvas = restrictedCanvas('https://example.com/probe');
    const wrapper = createWrapper({
      userIsStaffWithRestricted: true,
      accessToken: 'token-123',
    });

    const first = renderHook(() => useIIIFProbeService(canvas), { wrapper });
    const second = renderHook(() => useIIIFProbeService(canvas), { wrapper });

    await waitFor(() => expect(first.result.current).toBe('ok'));
    await waitFor(() => expect(second.result.current).toBe('ok'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('invalidateProbe resets an already-resolved canvas back to probing and re-fetches after a short delay', async () => {
    jest.useFakeTimers();
    const fetchMock = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: 200 }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const canvas = restrictedCanvas('https://example.com/probe');
    const { result } = renderHook(() => useIIIFProbeService(canvas), {
      wrapper: createWrapper({
        userIsStaffWithRestricted: true,
        accessToken: 'token-123',
      }),
    });

    await waitFor(() => expect(result.current).toBe('ok'));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    act(() => {
      invalidateProbe(canvas.id);
    });

    // Hides the stale media immediately, but doesn't re-fetch straight away.
    expect(result.current).toBe('probing');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => expect(result.current).toBe('ok'));
    expect(fetchMock).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it("gives up and reports 'failed' after repeated rapid invalidations even though the probe itself keeps succeeding", async () => {
    // Regression test: media that keeps failing to load for a reason other
    // than the auth cookie (e.g. genuinely too large) must not cause
    // invalidateProbe to cycle forever just because the cookie checks out
    // fine every time. Also verifies the per-invalidation backoff actually
    // elapses (rather than the budget being exhausted near-instantly).
    jest.useFakeTimers();
    const fetchMock = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: 200 }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const canvas = restrictedCanvas('https://example.com/probe');
    const { result } = renderHook(() => useIIIFProbeService(canvas), {
      wrapper: createWrapper({
        userIsStaffWithRestricted: true,
        accessToken: 'token-123',
      }),
    });

    await waitFor(() => expect(result.current).toBe('ok'));

    // MAX_INVALIDATIONS is 5, so 4 successful re-probes are allowed before
    // the 5th invalidation gives up. Each waits out its own backoff delay.
    for (let i = 0; i < 4; i++) {
      act(() => {
        invalidateProbe(canvas.id);
      });
      expect(result.current).toBe('probing');
      await act(async () => {
        await jest.advanceTimersByTimeAsync(8000);
      });
      await waitFor(() => expect(result.current).toBe('ok'));
    }

    act(() => {
      invalidateProbe(canvas.id);
    });

    expect(result.current).toBe('failed');

    jest.useRealTimers();
  });
});
