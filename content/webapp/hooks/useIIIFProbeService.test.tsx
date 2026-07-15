import { renderHook, waitFor } from '@testing-library/react';
import { FunctionComponent, PropsWithChildren } from 'react';

import UserContext, {
  defaultUserContext,
} from '@weco/common/contexts/UserContext';
import ItemViewerContext, {
  defaultItemViewerContext,
} from '@weco/content/contexts/ItemViewerContext';
import {
  createMockCanvas,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import useIIIFProbeService from './useIIIFProbeService';

// The probe hook gates restricted media: it returns true immediately for
// unrestricted canvases, and for restricted ones only once the auth cookie is
// confirmed via the probe service (for a logged-in staff user with a token).
// This exercises that matrix with mocked user state and fetch.

type WrapperOptions = {
  userIsStaffWithRestricted?: boolean;
  accessToken?: string;
};

const createWrapper =
  ({
    userIsStaffWithRestricted = false,
    accessToken,
  }: WrapperOptions): FunctionComponent<PropsWithChildren> =>
  ({ children }) => (
    <UserContext.Provider
      value={{ ...defaultUserContext, userIsStaffWithRestricted }}
    >
      <ItemViewerContext.Provider
        value={{ ...defaultItemViewerContext, accessToken }}
      >
        {children}
      </ItemViewerContext.Provider>
    </UserContext.Provider>
  );

const restrictedCanvas = (probeServiceId?: string) =>
  createMockCanvas({ painting: [createRestrictedPainting()], probeServiceId });

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
});

describe('useIIIFProbeService', () => {
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

  it('falls back to true after 5 failed probe attempts', async () => {
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

    // Advance through all 5 retry attempts (400ms each)
    for (let i = 0; i < 5; i++) {
      await jest.advanceTimersByTimeAsync(400);
    }

    // After exhausting retries, should fall back to true
    await waitFor(() => expect(result.current).toBe(true));
    expect(fetchMock).toHaveBeenCalledTimes(5);

    jest.useRealTimers();
  });
});
