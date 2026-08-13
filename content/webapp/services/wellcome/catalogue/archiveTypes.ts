import { catalogueQuery } from '.';
import { WorkAggregations } from './types/aggregations';

export type ArchiveType = {
  id: string;
  label: string;
  description: string;
  count: number;
};

// The catalogue API's archive.category aggregation is the source of truth
// for archive type IDs and labels - deliberately not duplicated here, so
// this can't drift out of sync with it. Descriptions have no equivalent in
// the API yet, so they're hardcoded here, keyed by the same IDs. An ID the
// API returns that isn't in this map (a newly added category, say) just
// renders with an empty description rather than being dropped.
const ARCHIVE_TYPE_DESCRIPTIONS: Record<string, string> = {
  PP: 'The personal and working papers of individuals.',
  GC: 'Archives brought together from a range of sources on a common theme.',
  SA: 'Records of societies and associations connected with medicine and health.',
  GP: 'Records created by general practitioners in the course of their medical practice.',
  PSY: 'Records of the British Psychological Society.',
  WTI: 'Records of the Wellcome Tropical Institute.',
  ART: 'Archives relating to art and artists connected with medicine and health.',
  WA: 'Administrative records of the Wellcome organisation and its predecessors.',
  GRL: 'Records of Genome Research Limited and the Wellcome Sanger Institute.',
  WF: 'Records of the Wellcome Foundation, the pharmaceutical company founded by Henry Wellcome.',
  OH: 'Recorded interviews and oral history collections.',
  TP: 'Archival collections consisting primarily of audio material.',
  WT: 'Records of the Wellcome Trust, the charitable foundation established from Henry Wellcome’s estate.',
  ES: 'Records relating to exhibitions and public shows staged by Wellcome Collection and its predecessors.',
  PBL: 'Grey literature published by or relating to Wellcome organisations.',
};

export async function fetchArchiveTypes(): Promise<ArchiveType[]> {
  const result = await catalogueQuery('works', {
    pageSize: 1,
    params: {
      'collection.isRoot': 'true',
      workType: 'h,b,hdig',
      aggregations: 'archive.category',
    },
  });

  if ('type' in result && result.type === 'Error') {
    throw new Error(
      `Failed to fetch archive type aggregations: ${result.description}`
    );
  }

  const worksResult = result as { aggregations?: WorkAggregations };
  const archiveCategory = worksResult.aggregations?.['archive.category'];

  if (!archiveCategory) {
    throw new Error('No archive.category aggregation found in response');
  }

  return archiveCategory.buckets.map(bucket => ({
    id: bucket.data.id,
    label: bucket.data.label,
    count: bucket.count,
    description: ARCHIVE_TYPE_DESCRIPTIONS[bucket.data.id] ?? '',
  }));
}
