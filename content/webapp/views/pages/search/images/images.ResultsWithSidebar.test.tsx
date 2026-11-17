import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import {
  CatalogueResultsList,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import {
  emptyImagesProps,
  ImagesProps,
} from '@weco/content/views/components/SearchPagesLink/Images';

import ImagesResultsWithSidebar from './images.ResultsWithSidebar';
import useResultsPages from './images.useResultsPages';

jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({}),
  usePhasedFlags: () => ({
    imageSidebarPhases: {
      current: 'phase3',
      phases: [
        { id: 'phase1', label: 'Phase 1', description: '' },
        { id: 'phase2', label: 'Phase 2', description: '' },
        { id: 'phase3', label: 'Phase 3', description: '' },
      ],
    },
  }),
}));

let mockInitialImage: (images: Image[]) => Image | undefined;
jest.mock('@weco/content/views/components/ImageModal', () => {
  const { useState } = jest.requireActual('react');
  return {
    useExpandedImage: (images: Image[]) => {
      const [image, setImage] = useState(mockInitialImage(images));
      return [image, setImage];
    },
  };
});

jest.mock('@weco/content/views/components/ImageSidebar', () => ({
  __esModule: true,
  useIsSidebarFullScreen: () => false,
  default: ({
    onPrevious,
    onNext,
  }: {
    onPrevious?: (beforeStep: () => void) => void;
    onNext?: (beforeStep: () => void) => void;
  }) => (
    <>
      <button onClick={() => onPrevious?.(() => {})}>Previous image</button>
      <button onClick={() => onNext?.(() => {})}>Next image</button>
    </>
  ),
}));

jest.mock('@weco/content/views/components/CatalogueImageGallery', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./images.useResultsPages', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const imageOn = (page: number, n: number) =>
  ({
    id: `image-${page}-${n}`,
    source: { id: `work-${page}-${n}` },
  }) as Image;

const resultsOn = (page: number) => [1, 2, 3].map(n => imageOn(page, n));

const render = async ({
  page = 1,
  totalPages = 2,
  initialImage,
}: {
  page?: number;
  totalPages?: number;
  initialImage: (images: Image[]) => Image | undefined;
}) => {
  mockInitialImage = initialImage;
  (useResultsPages as jest.Mock).mockReturnValue({
    fetchPage: (toPage: number) => Promise.resolve(resultsOn(toPage)),
    hasFailed: () => false,
  });
  const resultsList = {
    type: 'ResultList',
    results: resultsOn(page),
    totalPages,
    totalResults: totalPages * 3,
    pageSize: 3,
  } as unknown as CatalogueResultsList<Image>;
  const imagesRouteProps: ImagesProps = {
    ...emptyImagesProps,
    query: 'cats',
    page,
  };

  renderWithTheme(
    <ImagesResultsWithSidebar
      resultsList={resultsList}
      imagesRouteProps={imagesRouteProps}
    />
  );
  await act(async () => {});
};

const stepEvents = () =>
  (window.dataLayer ?? []).filter(
    ({ event }) =>
      event === 'sidebar_next_image' || event === 'sidebar_previous_image'
  );

const click = async (name: string) => {
  await userEvent.click(screen.getByRole('button', { name }));
  await act(async () => {});
};

describe('ImagesResultsWithSidebar', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });
  afterEach(() => {
    window.dataLayer = undefined;
  });

  it('records the image stepped to, with its position on its page of results', async () => {
    await render({ initialImage: images => images[1] });

    await click('Next image');
    await click('Previous image');

    expect(stepEvents()).toEqual([
      {
        event: 'sidebar_next_image',
        work_id: 'work-1-3',
        image_id: 'image-1-3',
        query: 'cats',
        position_in_list: 3,
      },
      {
        event: 'sidebar_previous_image',
        work_id: 'work-1-2',
        image_id: 'image-1-2',
        query: 'cats',
        position_in_list: 2,
      },
    ]);
  });

  it('records a step onto the next page of results as the first on that page', async () => {
    await render({ initialImage: images => images[2] });

    await click('Next image');

    expect(stepEvents()).toEqual([
      expect.objectContaining({
        event: 'sidebar_next_image',
        image_id: 'image-2-1',
        position_in_list: 1,
      }),
    ]);
  });

  it('records a step onto the previous page of results as the last on that page', async () => {
    await render({ page: 2, initialImage: images => images[0] });

    await click('Previous image');

    expect(stepEvents()).toEqual([
      expect.objectContaining({
        event: 'sidebar_previous_image',
        image_id: 'image-1-3',
        position_in_list: 3,
      }),
    ]);
  });

  it.each([
    { end: 'start', button: 'Previous image', index: 0 },
    { end: 'end', button: 'Next image', index: 2 },
  ])(
    'records nothing at the $end of the results',
    async ({ button, index }) => {
      await render({ totalPages: 1, initialImage: images => images[index] });

      await click(button);

      expect(stepEvents()).toEqual([]);
    }
  );

  it('records nothing for an image that is not in the results', async () => {
    await render({ initialImage: () => imageOn(9, 9) });

    await click('Previous image');
    await click('Next image');

    expect(stepEvents()).toEqual([]);
  });
});
