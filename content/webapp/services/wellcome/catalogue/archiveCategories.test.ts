import { catalogueQuery } from '.';
import { fetchArchiveCategories } from './archiveCategories';

jest.mock('.', () => ({
  catalogueQuery: jest.fn(),
}));

const mockCatalogueQuery = catalogueQuery as jest.MockedFunction<
  typeof catalogueQuery
>;

const bucket = (id: string, label: string, count: number) => ({
  data: { id, label, type: 'ArchiveCategory' },
  count,
  type: 'AggregationBucket' as const,
});

describe('fetchArchiveCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('leaves out the PSY and TP categories', async () => {
    mockCatalogueQuery.mockResolvedValue({
      aggregations: {
        'archive.category': {
          buckets: [
            bucket('PP', 'Personal Papers', 100),
            bucket('PSY', 'Psychology', 20),
            bucket('TP', 'Audio collections', 5),
            bucket('WT', 'Wellcome Trust', 50),
          ],
          type: 'Aggregation',
        },
      },
    } as unknown as Awaited<ReturnType<typeof catalogueQuery>>);

    const categories = await fetchArchiveCategories();

    expect(categories.map(c => c.id)).toEqual(['PP', 'WT']);
  });

  it('sorts categories into the agreed order, with unlisted ones last', async () => {
    mockCatalogueQuery.mockResolvedValue({
      aggregations: {
        'archive.category': {
          buckets: [
            bucket('SA', 'Societies and Associations', 300),
            bucket('NEW', 'A new category', 200),
            bucket('WT', 'Wellcome Trust', 100),
            bucket('PP', 'Personal Papers', 50),
          ],
          type: 'Aggregation',
        },
      },
    } as unknown as Awaited<ReturnType<typeof catalogueQuery>>);

    const categories = await fetchArchiveCategories();

    expect(categories.map(c => c.id)).toEqual(['PP', 'WT', 'SA', 'NEW']);
  });
});
