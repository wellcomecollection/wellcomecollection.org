import { WellcomeAggregation } from '@weco/content/services/wellcome';

import { catalogueQuery } from '.';
import {
  createDefaultCollectionStats,
  fetchImagesCount,
  fetchWorksAggregations,
  transformWorkTypeAggregations,
} from './workTypeAggregations';

// Mock catalogueQuery
jest.mock('.', () => ({
  catalogueQuery: jest.fn(),
}));

const mockCatalogueQuery = catalogueQuery as jest.MockedFunction<
  typeof catalogueQuery
>;

describe('workTypeAggregations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('transformWorkTypeAggregations', () => {
    it('should transform work type aggregations correctly', () => {
      const mockAggregation = {
        buckets: [
          {
            data: { id: 'a', label: 'Books' },
            count: 100000,
            type: 'AggregationBucket' as const,
          },
          {
            data: { id: 'd', label: 'Journals' },
            count: 2000,
            type: 'AggregationBucket' as const,
          },
          {
            data: {
              id: 'h',
              label: 'Archives and manuscripts',
            },
            count: 15000,
            type: 'AggregationBucket' as const,
          },
          {
            data: { id: 'g', label: 'Videos' },
            count: 1000,
            type: 'AggregationBucket' as const,
          },
          {
            data: { id: 'l', label: 'Ephemera' },
            count: 3000,
            type: 'AggregationBucket' as const,
          },
        ],
        type: 'Aggregation' as const,
      } as WellcomeAggregation;

      const collectionStats = createDefaultCollectionStats();
      const result = transformWorkTypeAggregations(
        mockAggregation,
        collectionStats
      );

      expect(result).toEqual({
        booksAndJournals: {
          id: 'books-journals',
          label: 'Books and Journals',
          count: 102000, // 100000 + 2000
          fallbackCount: 550000,
        },
        archivesAndManuscripts: {
          id: 'archives-manuscripts',
          label: 'Archives and manuscripts',
          count: 15000,
          fallbackCount: 260000,
        },
        audioAndVideo: {
          id: 'audio-video',
          label: 'Audio and video',
          count: 1000,
          fallbackCount: 10000,
        },
        ephemera: {
          id: 'ephemera',
          label: 'Ephemera',
          count: 3000,
          fallbackCount: 20000,
        },
        images: {
          id: 'images',
          label: 'Images',
          count: null,
          fallbackCount: 120000,
        },
      });
    });

    it('should handle empty aggregations', () => {
      const mockAggregation = {
        buckets: [],
        type: 'Aggregation' as const,
      };

      const collectionStats = createDefaultCollectionStats();
      const result = transformWorkTypeAggregations(
        mockAggregation,
        collectionStats
      );

      expect(result).toEqual({
        booksAndJournals: {
          id: 'books-journals',
          label: 'Books and Journals',
          count: null,
          fallbackCount: 550000,
        },
        archivesAndManuscripts: {
          id: 'archives-manuscripts',
          label: 'Archives and manuscripts',
          count: null,
          fallbackCount: 260000,
        },
        audioAndVideo: {
          id: 'audio-video',
          label: 'Audio and video',
          count: null,
          fallbackCount: 10000,
        },
        ephemera: {
          id: 'ephemera',
          label: 'Ephemera',
          count: null,
          fallbackCount: 20000,
        },
        images: {
          id: 'images',
          label: 'Images',
          count: null,
          fallbackCount: 120000,
        },
      });
    });
  });

  describe('fetchImagesCount', () => {
    it('should fetch images count successfully', async () => {
      mockCatalogueQuery.mockResolvedValue({
        type: 'ResultList',
        totalResults: 3800000,
        totalPages: 1,
        pageSize: 1,
        prevPage: null,
        nextPage: null,
        results: [],
        _requestUrl: 'https://api.example.com/test',
      });

      const result = await fetchImagesCount();

      expect(mockCatalogueQuery).toHaveBeenCalledWith('images', {
        toggles: {},
        pageSize: 1,
        params: {},
      });
      expect(result).toBe(3800000);
    });

    it('should return fallback count on API error', async () => {
      mockCatalogueQuery.mockResolvedValue({
        errorType: 'http',
        httpStatus: 500,
        label: 'Internal Server Error',
        description: 'API error',
        type: 'Error',
      });

      const result = await fetchImagesCount();

      expect(result).toBe(120000);
    });

    it('should return fallback count on network error', async () => {
      mockCatalogueQuery.mockRejectedValue(new Error('Network error'));

      const result = await fetchImagesCount();

      expect(result).toBe(120000);
    });
  });

  describe('fetchWorksAggregations', () => {
    it('should fetch collection stats successfully', async () => {
      const mockWorkTypeAggregation = {
        buckets: [
          {
            data: { id: 'a', label: 'Books', type: 'WorkType' },
            count: 1000000,
            type: 'AggregationBucket' as const,
          },
          {
            data: { id: 'd', label: 'Journals', type: 'WorkType' },
            count: 20000,
            type: 'AggregationBucket' as const,
          },
        ],
        type: 'Aggregation' as const,
      };

      mockCatalogueQuery.mockResolvedValue({
        aggregations: {
          workType: mockWorkTypeAggregation,
        },
      } as any);

      const result = await fetchWorksAggregations();

      expect(result).toBeTruthy();
      expect(result?.buckets).toHaveLength(2);
      expect(result?.buckets[0].data.id).toBe('a');
      expect(result?.buckets[0].count).toBe(1000000);
    });

    it('should return null on API error', async () => {
      mockCatalogueQuery.mockResolvedValue({
        errorType: 'http',
        httpStatus: 500,
        label: 'Internal Server Error',
        description: 'API error',
        type: 'Error',
      });

      const result = await fetchWorksAggregations();

      expect(result).toBeNull();
    });
  });
});
