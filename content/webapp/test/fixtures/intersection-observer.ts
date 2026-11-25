// jsdom doesn't implement IntersectionObserver, which the image item's
// scroll-to-url-update behaviour relies on via useOnScreen. Any test that
// renders an image item (directly, or through the viewer) needs this
// installed at module scope, before the component tree mounts.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

export function installMockIntersectionObserver(): void {
  window.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
