import { act, renderHook } from '@testing-library/react';

import { Image, Work } from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';

import useImageDetails from './useImageDetails';

jest.mock('@weco/content/services/wellcome/catalogue/works', () => ({
  getWorkClientSide: jest.fn(),
}));

const mockGetWork = getWorkClientSide as jest.Mock;

const image = (id: string, workId: string) =>
  ({
    id,
    source: { id: workId },
    locations: [{ url: `https://iiif.example/${id}/info.json` }],
  }) as unknown as Image;

const work = (title: string) =>
  ({ type: 'Work', title, items: [], production: [] }) as unknown as Work;

const deferred = () => {
  let resolve!: (value: Work) => void;
  const promise = new Promise<Work>(r => {
    resolve = r;
  });
  return { promise, resolve };
};

const imageA = image('imageA', 'workA');
const imageB = image('imageB', 'workB');

describe('useImageDetails', () => {
  beforeEach(() => mockGetWork.mockReset());

  it('ignores a response for an image that is no longer selected', async () => {
    const a = deferred();
    const b = deferred();
    mockGetWork.mockImplementation((id: string) =>
      id === 'workA' ? a.promise : b.promise
    );

    const { result, rerender } = renderHook(
      ({ expandedImage }) => useImageDetails([imageA, imageB], expandedImage),
      { initialProps: { expandedImage: imageA as Image | undefined } }
    );
    rerender({ expandedImage: imageB });

    // B's work arrives first, then A's, which is now stale
    await act(async () => b.resolve(work('Work B')));
    await act(async () => a.resolve(work('Work A')));

    expect(result.current.detailedWork?.title).toBe('Work B');
  });

  it("doesn't fetch the work again when the same image is closed and reopened", async () => {
    mockGetWork.mockResolvedValue(work('Work A'));

    const { result, rerender } = renderHook(
      ({ expandedImage }) => useImageDetails([imageA], expandedImage),
      { initialProps: { expandedImage: imageA as Image | undefined } }
    );
    await act(async () => {});
    expect(result.current.detailedWork?.title).toBe('Work A');

    rerender({ expandedImage: undefined });
    rerender({ expandedImage: imageA });
    await act(async () => {});

    expect(mockGetWork).toHaveBeenCalledTimes(1);
    expect(result.current.detailedWork?.title).toBe('Work A');
  });
});
