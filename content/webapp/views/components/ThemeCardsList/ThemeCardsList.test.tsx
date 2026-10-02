import { waitFor } from '@testing-library/react';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { getConceptsByIds } from '@weco/content/services/wellcome/catalogue/concepts';

import ThemeCardsList from '.';

let mockCataloguePipeline: string | undefined;

jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ stagingApi: false }),
  useModes: () => ({ cataloguePipeline: mockCataloguePipeline }),
}));

jest.mock('@weco/content/services/wellcome/catalogue/concepts', () => ({
  getConceptsByIds: jest.fn().mockResolvedValue([]),
}));

const mockGetConceptsByIds = getConceptsByIds as jest.MockedFunction<
  typeof getConceptsByIds
>;

const renderList = () =>
  renderWithTheme(
    <ThemeCardsList
      conceptIds={['abc123']}
      dataGtmProps={{
        'category-label': undefined,
        'category-position-in-list': undefined,
      }}
    />
  );

describe('ThemeCardsList: the cataloguePipeline mode toggle', () => {
  beforeEach(() => jest.clearAllMocks());

  it('passes the selected pipeline cluster to getConceptsByIds', async () => {
    mockCataloguePipeline = 'pipeline-2026-09-30';
    renderList();

    await waitFor(() =>
      expect(mockGetConceptsByIds).toHaveBeenCalledWith({
        ids: ['abc123'],
        shouldUseStagingApi: false,
        pipelineCluster: 'pipeline-2026-09-30',
      })
    );
  });

  it('passes no cluster when the mode is unset', async () => {
    mockCataloguePipeline = undefined;
    renderList();

    await waitFor(() =>
      expect(mockGetConceptsByIds).toHaveBeenCalledWith({
        ids: ['abc123'],
        shouldUseStagingApi: false,
        pipelineCluster: undefined,
      })
    );
  });
});
