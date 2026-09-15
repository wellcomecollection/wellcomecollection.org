import { catalogueQuery } from '.';
import { WorkAggregations } from './types/aggregations';

export type ArchiveCategory = {
  id: string;
  // The catalogue API's IDs are uppercase codes (PP, WTI, etc) - lowercased
  // once here for a tidier /collections/archives/{slug} URL, rather than
  // lowercasing archiveType.id wherever it's used to build or match a link.
  slug: string;
  label: string;
  // Short - for the linking cards on the /collections/archives listing page.
  shortDescription: string;
  // Long - for the header of the category's own listing page.
  fullDescription: string;
  count: number;
  image?: string;
};

// The catalogue API's archive.category aggregation is the source of truth
// for archive category IDs and labels - deliberately not duplicated here, so
// this can't drift out of sync with it. Descriptions have no equivalent in
// the API yet, so they're hardcoded here, keyed by the same IDs. An ID the
// API returns that isn't in this map (a newly added category, say) just
// renders with an empty description rather than being dropped.
const ARCHIVE_CATEGORY_SHORT_DESCRIPTIONS: Record<string, string> = {
  PP: 'Personal and professional papers of individuals connected with medicine, science, healthcare and related fields.',
  GC: 'Collections of papers relating to individuals, subjects and organisations connected with medicine and the history of medicine.',
  SA: 'Archives of societies, charities, professional organisations and other bodies concerned with medicine, health and social issues.',
  GP: 'Archives relating to general practitioners, general practice and primary healthcare, particularly in Britain during the 20th century.',
  WTI: 'Archives documenting tropical medicine, infectious diseases, medical research and global health.',
  AAU: 'Archives relating to HIV/AIDS, HIV activism, prevention, treatment, research and the experiences of people living with HIV/AIDS.',
  ART: 'Records on the use of arts, creativity, and cultural practice in healthcare, hospitals and community settings.',
  OH: 'Oral history recordings capturing lived experiences of health, medicine, illness and healthcare.',
  WA: 'Documents the activities of Henry Wellcome and the organisations, museums, laboratories and institutions associated with him.',
  GRL: 'Collections relating to genome research, genome sequencing and the Wellcome Trust Sanger Institute.',
  WT: 'Documents about the formation, development and activities of the Wellcome Trust from its establishment in 1936 to the present day.',
  TP: 'Archival collections consisting primarily of audio material.',
  PBL: 'Literature produced by universities and biotechnology companies, particularly companies associated with the Babraham Research Campus.',
  ES: 'Records and materials collected by Wellcome staff at various exhibitions and shows with themes relating to medicine, health or wellbeing.',
  WF: 'Records relating to the history and operations of the Burroughs Wellcome & Company pharmaceutical business and the Wellcome Foundation Ltd.',
  PSY: 'Archival material relating to psychology and related disciplines including psychiatry and psychoanalysis.',
};

// As above, but the longer text shown on the category's own listing page
// header (e.g. /collections/archives/pp). TP has no long-form text yet
// (see ARCHIVE_CATEGORY_SHORT_DESCRIPTIONS above) so it falls back to the short
// description via the ?? below.
const ARCHIVE_CATEGORY_FULL_DESCRIPTIONS: Record<string, string> = {
  PP: 'The Personal Papers (PP) collections contain the personal and professional papers of individuals connected with medicine, science, healthcare and related fields. They can include correspondence, diaries and photographs. Collections vary in size and they do not necessarily represent all the working or personal papers of the individuals.',
  GC: 'The General Collections (GC) contain smaller collections of papers relating to individuals, subjects and organisations connected with medicine and the history of medicine. They can include correspondence, research material, notes, reports and other records.',
  SA: 'The Societies and Associations (SA) collections contain the archives of societies, charities, professional organisations and other bodies concerned with medicine, health and social issues. They document how organisations were established and operated, their research, meetings, decision-making, and their relationships with governments, institutions and other organisations. Records found in this section include minute books, committee papers, agendas, correspondence, newspaper cuttings, pamphlets, and annual reports.',
  GP: 'The General Practice (GP) collections contain archives relating to general practitioners, general practice and primary healthcare, particularly in Britain during the 20th century. They include personal and professional papers of GPs, practice records, correspondence, writings and oral histories. The General Practice collections are no longer actively collected into and further material related to this topic can be found elsewhere in our collections.',
  WTI: 'The Wellcome Tropical Institute (WTI) collections contain archives documenting tropical medicine, infectious diseases, medical research and global health. They include the personal papers of people who worked for, or were closely associated with, the Wellcome Tropical Institute.',
  AAU: 'The Aid Archive UK (AAU) collections contain archives relating to HIV/AIDS, HIV activism, prevention, treatment, research and the experiences of people living with HIV/AIDS. The Aid Archive UK (AAU) collections are no longer collected into and further material related to HIV and AIDS can be found elsewhere in our collections.',
  ART: 'The ART collections document the use of arts, creativity, and cultural practice in healthcare, hospitals and community settings. They include the records of organisations and individuals, covering projects such as mental-health and the design of healthcare environments. The ART collections are no longer actively collected into and further material related to art and health can be found elsewhere in our collections.',
  OH: 'The Oral History (OH) collections bring together oral history recordings capturing lived experiences of health, medicine, illness and healthcare. They include recorded interviews, transcripts and interview notes covering subjects such as medical research, disability, mental health, public health and patients’ experiences.',
  WA: 'The Wellcome Archive (WA) collections document the activities of Henry Wellcome and the organisations, museums, laboratories and institutions associated with him. They include administrative records, correspondence, financial material, research and museum records, photographs, objects and Henry Wellcome’s personal papers.',
  GRL: 'The Genome Research LTD (GRL) collections relate to genome research, genome sequencing and the Wellcome Trust Sanger Institute. They can contain researchers’ laboratory and working papers, correspondence, publications, conference material, administrative records and publications.',
  WT: 'The Wellcome Trust (WT) archive documents the formation, development and activities of the Wellcome Trust from its establishment in 1936 to the present day. It includes records of governance and corporate management, grant funding, and the Trust’s direct activities, including public engagement, supporting science education, and its museum, library and collecting activities.',
  PBL: 'The Published Grey Literature (PBL) collections contain literature produced by universities and biotechnology companies, particularly companies associated with the Babraham Research Campus. The material includes papers, tests, research publications, posters and promotional literature.',
  ES: 'The Exhibition and Shows (ES) collection contains records and materials collected by Wellcome staff at various exhibitions and shows with themes relating to medicine, health or wellbeing. Most of the items are printed materials, including flyers, pamphlets, brochures, product catalogues, prospectuses, reports and other publications.',
  WF: 'The Wellcome Foundation (WF) archive documents the history and operations of the Burroughs Wellcome & Company pharmaceutical business and, from 1924, the Wellcome Foundation Ltd. It includes administration, finance, marketing, production, legal and personnel records, as well as material relating to Wellcome’s research laboratories and associated companies.',
  PSY: 'The PSY collections bring together archival material relating to psychology and related disciplines including psychiatry and psychoanalysis. They include papers of individual psychologists and cover subjects such as experimental and clinical psychology, professional practice and the development of psychology, psychiatry and psychoanalysis as a discipline. Further material related to psychology can also be found in our Personal Papers and Societies and Associations collections.',
};

// Composite images we make ourselves,
// keyed by the same IDs
// An ID with no entry here renders with a colour placeholder instead
// - see ImageGridCard.
const ARCHIVE_CATEGORY_IMAGES: Record<string, string> = {};

export async function fetchArchiveCategories(): Promise<ArchiveCategory[]> {
  const result = await catalogueQuery('works', {
    pageSize: 1,
    params: {
      'collection.isRoot': 'true',
      workType: 'h,b,hdig', //filter to remove non-archival collection roots, we retrieve h = Archives and manuscripts, b = Manuscripts, hdig = Born-digital archives
      aggregations: 'archive.category',
    },
  });

  if ('type' in result && result.type === 'Error') {
    throw new Error(
      `Failed to fetch archive category aggregations: ${result.description}`
    );
  }

  const worksResult = result as { aggregations?: WorkAggregations };
  const archiveCategory = worksResult.aggregations?.['archive.category'];

  if (!archiveCategory) {
    throw new Error('No archive.category aggregation found in response');
  }

  return archiveCategory.buckets.map(bucket => ({
    id: bucket.data.id,
    slug: bucket.data.id.toLowerCase(),
    label: bucket.data.label,
    count: bucket.count,
    shortDescription: ARCHIVE_CATEGORY_SHORT_DESCRIPTIONS[bucket.data.id] ?? '',
    fullDescription:
      ARCHIVE_CATEGORY_FULL_DESCRIPTIONS[bucket.data.id] ??
      ARCHIVE_CATEGORY_SHORT_DESCRIPTIONS[bucket.data.id] ??
      '',
    image: ARCHIVE_CATEGORY_IMAGES[bucket.data.id],
  }));
}
