import { WellcomeAggregation } from '@weco/content/services/wellcome';

import {
  createDefaultCollectionStats,
  fetchImagesCount,
  fetchWorksAggregations,
  transformWorkTypeAggregations,
} from './workTypeAggregations';

// Mock types for test responses
type MockResponse = {
  ok: boolean;
  json: jest.Mock;
  statusText?: string;
};

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

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
        },
        archivesAndManuscripts: {
          id: 'archives-manuscripts',
          label: 'Archives and manuscripts',
          count: 15000,
        },
        audioAndVideo: {
          id: 'audio-video',
          label: 'Audio and video',
          count: 1000,
        },
        ephemera: {
          id: 'ephemera',
          label: 'Ephemera',
          count: 3000,
        },
        images: {
          id: 'images',
          label: 'Images',
          count: 0,
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
          count: 0,
        },
        archivesAndManuscripts: {
          id: 'archives-manuscripts',
          label: 'Archives and manuscripts',
          count: 0,
        },
        audioAndVideo: {
          id: 'audio-video',
          label: 'Audio and video',
          count: 0,
        },
        ephemera: {
          id: 'ephemera',
          label: 'Ephemera',
          count: 0,
        },
        images: {
          id: 'images',
          label: 'Images',
          count: 0,
        },
      });
    });
  });

  describe('fetchImagesCount', () => {
    it('should fetch images count successfully', async () => {
      const mockResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          totalResults: 3800000,
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await fetchImagesCount();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.wellcomecollection.org/catalogue/v2/images?pageSize=1'
      );
      expect(result).toBe(3800000);
    });

    it('should return fallback count on API error', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        statusText: 'Internal Server Error',
        json: jest.fn(),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await fetchImagesCount();

      expect(result).toBe(120000);
    });

    it('should return fallback count on network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchImagesCount();

      expect(result).toBe(120000);
    });
  });

  describe('fetchWorksAggregations', () => {
    it('should fetch collection stats successfully', async () => {
      const mockWorksResponse: MockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          aggregations: {
            workType: {
              buckets: [
                { data: { id: 'a', label: 'Books' }, count: 1000000 },
                { data: { id: 'd', label: 'Journals' }, count: 20000 },
              ],
            },
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockWorksResponse as unknown as Response);

      const result = await fetchWorksAggregations();

      expect(result).toBeTruthy();
      expect(result?.buckets).toHaveLength(2);
      expect(result?.buckets[0].data.id).toBe('a');
      expect(result?.buckets[0].count).toBe(1000000);
    });

    it('should return null on API error', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        statusText: 'Internal Server Error',
        json: jest.fn(),
      };
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      const result = await fetchWorksAggregations();

      expect(result).toBeNull();
    });
  });
});
