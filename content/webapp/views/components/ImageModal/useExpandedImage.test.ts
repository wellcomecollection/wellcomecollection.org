import { act, renderHook } from '@testing-library/react';

import { Image } from '@weco/content/services/wellcome/catalogue/types';

import useExpandedImage from './useExpandedImage';

// The URL's hash, set by the tests, as the browser would
let mockHash: string | undefined;
jest.mock('@weco/content/hooks/useUrlHash', () => ({
  __esModule: true,
  default: () => mockHash,
}));
// Never resolves unless a test says otherwise, so nothing runs after the URL
// would have changed
const mockPush = jest.fn();
beforeEach(() => mockPush.mockImplementation(() => new Promise(() => {})));
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/search/images',
    pathname: '/search/images',
    query: {},
    push: (...args: unknown[]) => mockPush(...args),
  }),
}));
jest.mock('@weco/common/server-data/Context', () => ({
  useFeatureFlags: () => ({}),
  useModes: () => ({}),
}));
jest.mock('@weco/content/services/wellcome/catalogue/images', () => ({
  getImage: jest.fn(),
}));

const image = (id: string) =>
  ({ type: 'Image', id, source: { id: `work-${id}` } }) as unknown as Image;
const images = ['a', 'b', 'c'].map(image);

const renderExpandedImage = () => {
  mockHash = undefined;
  const view = renderHook(() => useExpandedImage(images));
  const urlChangesTo = (id: string | undefined) => {
    mockHash = id;
    view.rerender();
  };
  const isFromUrlChange = () => view.result.current[2];
  const choose = (id: string) => act(() => view.result.current[1](image(id)));
  return { urlChangesTo, isFromUrlChange, choose };
};

describe('useExpandedImage', () => {
  it("says an image came from the URL when the URL went to it from another without it being chosen, as with the browser's Back", () => {
    const { urlChangesTo, isFromUrlChange } = renderExpandedImage();
    urlChangesTo('a');

    urlChangesTo('b');

    expect(isFromUrlChange()).toBe(true);
  });

  it("doesn't say so when the URL opens or closes an image, as the browser's Forward and Back can", () => {
    const { urlChangesTo, isFromUrlChange } = renderExpandedImage();

    urlChangesTo('a');
    expect(isFromUrlChange()).toBe(false);
    urlChangesTo(undefined);
    expect(isFromUrlChange()).toBe(false);
  });

  it('keeps track of images chosen faster than the URL changes', () => {
    const { urlChangesTo, isFromUrlChange, choose } = renderExpandedImage();
    urlChangesTo('a');

    choose('b');
    choose('c');
    urlChangesTo('b');
    expect(isFromUrlChange()).toBe(false);
    urlChangesTo('c');
    expect(isFromUrlChange()).toBe(false);

    urlChangesTo('b');
    expect(isFromUrlChange()).toBe(true);
  });

  it("doesn't keep an image chosen twice before the URL changed, so going back to it later comes from the URL", () => {
    const { urlChangesTo, isFromUrlChange, choose } = renderExpandedImage();
    urlChangesTo('a');

    choose('b');
    choose('b');
    urlChangesTo('b');
    choose('c');
    urlChangesTo('c');

    urlChangesTo('b');
    expect(isFromUrlChange()).toBe(true);
  });

  it('forgets a request whose navigation was cancelled, so going back to that image later comes from the URL', async () => {
    const { urlChangesTo, isFromUrlChange, choose } = renderExpandedImage();
    urlChangesTo('a');

    mockPush.mockResolvedValueOnce(false);
    choose('c');
    await act(async () => {});
    urlChangesTo('b');
    urlChangesTo('c');

    expect(isFromUrlChange()).toBe(true);
  });
});
