import { renderHook } from '@testing-library/react';

import { useScrollTracking } from './useScrollTracking';

const mockListeners: Record<string, ((url: string) => void)[]> = {};
const mockRouter = {
  asPath: '/search/images?query=cats',
  events: {
    on: (event: string, callback: (url: string) => void) => {
      mockListeners[event] = [...(mockListeners[event] ?? []), callback];
    },
    off: (event: string, callback: (url: string) => void) => {
      mockListeners[event] = (mockListeners[event] ?? []).filter(
        l => l !== callback
      );
    },
  },
};

jest.mock('next/router', () => ({ useRouter: () => mockRouter }));

const imageSearch = '/search/images?query=cats';

const navigate = (
  event: 'routeChangeComplete' | 'hashChangeComplete',
  url: string
) => mockListeners[event]?.forEach(callback => callback(url));

// The page is twice the height of the window, so half of it is scrollable
const PAGE_HEIGHT = 2000;
const WINDOW_HEIGHT = 1000;

const scrollTo = (percentage: number) => {
  Object.defineProperty(window, 'scrollY', {
    value: ((PAGE_HEIGHT - WINDOW_HEIGHT) * percentage) / 100,
    configurable: true,
  });
  window.dispatchEvent(new Event('scroll'));
  // The handler is debounced
  jest.advanceTimersByTime(100);
};

const thresholds = () =>
  (window.dataLayer ?? [])
    .filter(event => event.event === 'wc_scroll_depth')
    .map(event => event.wc_scroll_depth_threshold);

describe('useScrollTracking', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.dataLayer = [];
    mockRouter.asPath = imageSearch;
    window.innerHeight = WINDOW_HEIGHT;
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: PAGE_HEIGHT,
      configurable: true,
    });
  });
  afterEach(() => jest.useRealTimers());

  it('sends each threshold the first time it is passed, and only then', () => {
    renderHook(() => useScrollTracking());

    scrollTo(30);
    expect(thresholds()).toEqual([25]);

    scrollTo(60);
    expect(thresholds()).toEqual([25, 50]);

    scrollTo(30);
    scrollTo(60);
    expect(thresholds()).toEqual([25, 50]);
  });

  it('keeps counting the same page when only the hash changes', () => {
    renderHook(() => useScrollTracking());
    scrollTo(30);

    // Opening an image, then another, then closing it
    navigate('hashChangeComplete', `${imageSearch}#imageA`);
    navigate('hashChangeComplete', `${imageSearch}#imageB`);
    navigate('hashChangeComplete', imageSearch);

    scrollTo(30);
    expect(thresholds()).toEqual([25]);
  });

  it('starts again when the query changes', () => {
    renderHook(() => useScrollTracking());
    scrollTo(30);

    // Paginating, filtering, sorting or searching again
    navigate('routeChangeComplete', `${imageSearch}&page=2`);

    scrollTo(30);
    expect(thresholds()).toEqual([25, 25]);
  });
});
