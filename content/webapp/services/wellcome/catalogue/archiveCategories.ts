import {
  iiifImageTemplate,
  iiifImageUri,
} from '@weco/common/utils/convert-image-uri';

import { catalogueQuery } from '.';
import { WorkAggregations } from './types/aggregations';

export type ArchiveCategory = {
  id: string;
  // The catalogue API's IDs are uppercase codes (PP, WTI, etc) - lowercased
  // once here for a tidier /collections/archives/{slug} URL, rather than
  // lowercasing archiveType.id wherever it's used to build or match a link.
  slug: string;
  label: string;
  shortDescription: string;
  // Undefined when a category has no long-form copy and no short
  // description to fall back to either - lets CollectionsHeader skip
  // rendering an intro text block entirely, rather than an empty one.
  fullDescription?: string;
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
  GC: 'Papers relating to individuals, subjects and organisations connected with medicine and its history.',
  SA: 'Archives of societies, charities, professional organisations and other bodies concerned with medicine, health and social issues.',
  GP: 'Archives relating to general practitioners, general practice and primary healthcare, particularly in 20th century Britain.',
  WTI: 'Archives documenting tropical medicine, infectious diseases, medical research and global health.',
  AAU: 'Archives relating to HIV/AIDS, including activism, prevention, treatment, research and lived experience.',
  ART: 'Records on the use of arts, creativity and cultural practice in healthcare, hospitals and community settings.',
  OH: 'Recordings capturing lived experiences of health, medicine, illness and healthcare.',
  WA: 'Records of Henry Wellcome and the organisations, museums, laboratories and institutions associated with him.',
  GRL: 'Records relating to genome research and sequencing, and the Wellcome Trust Sanger Institute.',
  WT: 'Records of the formation, development and activities of the Wellcome Trust from its establishment to today.',
  PBL: 'Literature produced by universities and biotechnology companies, particularly those associated with the Babraham Research Campus.',
  ES: 'Records and materials collected by Wellcome staff at exhibitions and shows on medicine, health or wellbeing.',
  WF: 'Records of the Burroughs Wellcome & Company pharmaceutical business and the Wellcome Foundation Ltd.',
};

// As above, but the longer text shown on the category's own listing page
// header (e.g. /collections/archives/pp). A category with no long-form text
// falls back to its short description via the ?? below.
const ARCHIVE_CATEGORY_FULL_DESCRIPTIONS: Record<string, string> = {
  PP: 'The Personal Papers (PP) collections contain the personal and professional papers of individuals connected with medicine, science, healthcare and related fields. They can include correspondence, diaries and photographs. Collections vary in size and they do not necessarily represent all the working or personal papers of the individuals.',
  GC: 'The General Collections (GC) contain smaller collections of papers relating to individuals, subjects and organisations connected with medicine and the history of medicine. They can include correspondence, research material, notes, reports and other records.',
  SA: 'The Societies and Associations (SA) collections contain the archives of societies, charities, professional organisations and other bodies concerned with medicine, health and social issues. They document how organisations were established and operated, their research, meetings, decision-making, and their relationships with governments, institutions and other organisations. Records found in this section include minute books, committee papers, agendas, correspondence, newspaper cuttings, pamphlets, and annual reports.',
  GP: 'The General Practice (GP) collections contain archives relating to general practitioners, general practice and primary healthcare, particularly in Britain during the 20th century. They include personal and professional papers of GPs, practice records, correspondence, writings and oral histories. The General Practice collections are no longer actively collected into and further material related to this topic can be found elsewhere in our collections.',
  WTI: 'The Wellcome Tropical Institute (WTI) collections contain archives documenting tropical medicine, infectious diseases, medical research and global health. They include the personal papers of people who worked for, or were closely associated with, the Wellcome Tropical Institute.',
  AAU: 'The Aids Archive UK (AAU) collections contain archives relating to HIV/AIDS, HIV activism, prevention, treatment, research and the experiences of people living with HIV/AIDS. The Aids Archive UK (AAU) collections are no longer collected into and further material related to HIV and AIDS can be found elsewhere in our collections.',
  ART: 'The ART collections document the use of arts, creativity, and cultural practice in healthcare, hospitals and community settings. They include the records of organisations and individuals, covering projects such as mental-health and the design of healthcare environments. The ART collections are no longer actively collected into and further material related to art and health can be found elsewhere in our collections.',
  OH: 'The Oral History (OH) collections bring together oral history recordings capturing lived experiences of health, medicine, illness and healthcare. They include recorded interviews, transcripts and interview notes covering subjects such as medical research, disability, mental health, public health and patients’ experiences.',
  WA: 'The Wellcome Archive (WA) collections document the activities of Henry Wellcome and the organisations, museums, laboratories and institutions associated with him. They include administrative records, correspondence, financial material, research and museum records, photographs, objects and Henry Wellcome’s personal papers.',
  GRL: 'The Genome Research LTD (GRL) collections relate to genome research, genome sequencing and the Wellcome Trust Sanger Institute. They can contain researchers’ laboratory and working papers, correspondence, publications, conference material, administrative records and publications.',
  WT: 'The Wellcome Trust (WT) archive documents the formation, development and activities of the Wellcome Trust from its establishment in 1936 to the present day. It includes records of governance and corporate management, grant funding, and the Trust’s direct activities, including public engagement, supporting science education, and its museum, library and collecting activities.',
  PBL: 'The Published Grey Literature (PBL) collections contain literature produced by universities and biotechnology companies, particularly companies associated with the Babraham Research Campus. The material includes papers, tests, research publications, posters and promotional literature.',
  ES: 'The Exhibition and Shows (ES) collection contains records and materials collected by Wellcome staff at various exhibitions and shows with themes relating to medicine, health or wellbeing. Most of the items are printed materials, including flyers, pamphlets, brochures, product catalogues, prospectuses, reports and other publications.',
  WF: 'The Wellcome Foundation (WF) archive documents the history and operations of the Burroughs Wellcome & Company pharmaceutical business and, from 1924, the Wellcome Foundation Ltd. It includes administration, finance, marketing, production, legal and personnel records, as well as material relating to Wellcome’s research laboratories and associated companies.',
};

// Categories the API still returns but we've agreed not to show on the
// archive browse pages (see #13642). Filtering them out of the list also
// means /collections/archives/{slug} 404s for them, since that page looks
// categories up from the same list.
// - PSY is being returned to the depositor
// - TP is due to be incorporated into the WT archive
// Their works are still in the catalogue and searchable - this only hides
// the categories here.
// Once the PSY records have been removed and the TP ones reclassified into
// WT upstream, the API will stop returning these buckets and this set and the
// filter in fetchArchiveCategories below can be deleted - see #13675.
const HIDDEN_ARCHIVE_CATEGORY_IDS = new Set(['PSY', 'TP']);

// The order categories appear in on /collections/archives, as agreed in the
// designs. Any ID the API returns that isn't listed here goes at the end, in
// the order the API returned it (by count).
const ARCHIVE_CATEGORY_ORDER = [
  'PP',
  'GC',
  'WF',
  'WT',
  'GP',
  'ART',
  'GRL',
  'ES',
  'PBL',
  'OH',
  'SA',
  'WA',
  'WTI',
  'AAU',
];

// Card images, keyed by the same IDs. Each is the IIIF identifier of a
// digitised catalogue image, e.g. 'b12345678_0001.jp2'
// - the last part of its iiif.wellcomecollection.org/image/ or /thumbs/ URL.
// It must be an open (not access-restricted) image, as restricted ones 401
// from the image service and show as broken - check by opening
// https://iiif.wellcomecollection.org/image/{id}/full/,1100/0/default.jpg
// in a private window. An ID with no entry here
// renders a plain dark card instead - see ImageGridCard's hasPlainPlaceholder.
const ARCHIVE_CATEGORY_IMAGES: Record<string, string> = {
  PP: 'b33118814_0013.jp2',
  GC: 'b32241392_0001.jp2',
  WF: 'b18620711_0001.jp2',
  WT: 'b33227779_0001.JP2',
  GP: 'b19168743_0001.jp2',
  SA: 'b18848540_0011.jp2',
  WA: 'L0025358',
};

// Requested by height rather than width: the card is tall and narrow, so it's
// the image's height that has to fill it. 1100px keeps it sharp at the card's
// largest (full width on a high-resolution phone).
const ARCHIVE_CATEGORY_IMAGE_HEIGHT = 1100;

const archiveCategoryImageUrl = (id: string): string | undefined => {
  const imageIdentifier = ARCHIVE_CATEGORY_IMAGES[id];
  return imageIdentifier
    ? iiifImageTemplate(`${iiifImageUri}${imageIdentifier}`)({
        size: `,${ARCHIVE_CATEGORY_IMAGE_HEIGHT}`,
      })
    : undefined;
};

const orderIndex = (id: string): number => {
  const index = ARCHIVE_CATEGORY_ORDER.indexOf(id);
  return index === -1 ? ARCHIVE_CATEGORY_ORDER.length : index;
};

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

  return (
    archiveCategory.buckets
      .filter(bucket => !HIDDEN_ARCHIVE_CATEGORY_IDS.has(bucket.data.id))
      .map(bucket => ({
        id: bucket.data.id,
        slug: bucket.data.id.toLowerCase(),
        label: bucket.data.label,
        count: bucket.count,
        shortDescription:
          ARCHIVE_CATEGORY_SHORT_DESCRIPTIONS[bucket.data.id] ?? '',
        fullDescription:
          ARCHIVE_CATEGORY_FULL_DESCRIPTIONS[bucket.data.id] ??
          ARCHIVE_CATEGORY_SHORT_DESCRIPTIONS[bucket.data.id],
        image: archiveCategoryImageUrl(bucket.data.id),
      }))
      // Array.prototype.sort is stable, so unlisted IDs keep the API's order
      .sort((a, b) => orderIndex(a.id) - orderIndex(b.id))
  );
}
