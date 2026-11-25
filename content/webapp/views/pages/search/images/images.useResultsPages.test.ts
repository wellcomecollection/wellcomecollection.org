import { act, renderHook } from '@testing-library/react';

import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import {
  emptyImagesProps,
  ImagesProps,
} from '@weco/content/views/components/SearchPagesLink/Images';

import useResultsPages from './images.useResultsPages';

jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ stagingApi: false }),
  useModes: () => ({ cataloguePipeline: undefined }),
}));

jest.mock('@weco/content/services/wellcome/catalogue/images', () => ({
  getImages: jest.fn(),
}));

const mockGetImages = getImages as jest.Mock;

const routeProps: ImagesProps = {
  ...emptyImagesProps,
  query: 'cats',
  color: '#ff0000',
  page: 1,
};

const resultsFor = (page: number) => ({
  type: 'ResultList',
  results: [{ id: `first-on-${page}` }, { id: `last-on-${page}` }] as Image[],
});

describe('useResultsPages', () => {
  afterEach(() => jest.resetAllMocks());

  it('fetches a page with the search, as the server does, and only once', async () => {
    mockGetImages.mockImplementation(({ params }) =>
      Promise.resolve(resultsFor(params.page))
    );
    const { result } = renderHook(() => useResultsPages(routeProps, 30));

    const first = await act(() => result.current.fetchPage(2));
    const second = await act(() => result.current.fetchPage(2));

    expect(first?.map(({ id }) => id)).toEqual(['first-on-2', 'last-on-2']);
    expect(second).toBe(first);
    expect(mockGetImages).toHaveBeenCalledTimes(1);
    expect(mockGetImages).toHaveBeenCalledWith({
      params: { ...routeProps, color: 'ff0000', page: 2 },
      shouldUseStagingApi: false,
      pipelineCluster: undefined,
      pageSize: 30,
    });
  });

  it('fetches again for a different search', async () => {
    mockGetImages.mockImplementation(({ params }) =>
      Promise.resolve(resultsFor(params.page))
    );
    const { result, rerender } = renderHook(
      ({ props }) => useResultsPages(props, 30),
      { initialProps: { props: routeProps } }
    );

    await act(() => result.current.fetchPage(2));
    rerender({ props: { ...routeProps, query: 'dogs' } });
    await act(() => result.current.fetchPage(2));

    expect(mockGetImages).toHaveBeenCalledTimes(2);
  });

  it('reports a page that could not be fetched, or had no results', async () => {
    mockGetImages
      .mockResolvedValueOnce({ type: 'Error', httpStatus: 500 })
      .mockResolvedValueOnce({ type: 'ResultList', results: [] });
    const { result } = renderHook(() => useResultsPages(routeProps, 30));

    expect(result.current.hasFailed(2)).toBe(false);

    const errored = await act(() => result.current.fetchPage(2));
    const empty = await act(() => result.current.fetchPage(3));

    expect(errored).toBeUndefined();
    expect(empty).toBeUndefined();
    expect(result.current.hasFailed(2)).toBe(true);
    expect(result.current.hasFailed(3)).toBe(true);
    expect(result.current.hasFailed(4)).toBe(false);
  });
});
