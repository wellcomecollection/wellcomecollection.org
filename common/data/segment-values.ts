/** This contains a list of values which are sent to Segment.
 *
 * == What it's used for ==
 *
 * These are used to analyse behaviour on the site, e.g. we use the 'source'
 * parameter on links to track where somebody clicked from, so we can see
 * how many people landed on concept pages from contributors/subjects/genres/etc.
 *
 * These types are an attempt to describe the expectations of those reporting tools;
 * to enforce our "analytics contract" in code.  It isn't set in stone, but it's
 * meant to flag to developers if they make unplanned or unexpected changes --
 * hopefully this will lead to fewer unintentional changes.
 *
 * If you want to change this type, check with our digital analyst (currently Tacey)
 * before you do -- so the change can be coordinated with their reports.
 */

import { Prefix } from '@weco/common/utils/utility-types';

export type PageviewName =
  | 'concept'
  | 'event'
  | 'exhibition'
  | 'image'
  | 'images'
  | 'item'
  | 'search'
  | 'story'
  | 'stories'
  | 'work'
  | 'works';

export type ConceptLinkSource =
  | 'work_details/contributors'
  | 'work_details/subjects'
  | 'work_details/genres';

export type ImageLinkSource = 'images_search_result' | 'viewer/paginator';

export type ImagesLinkSource =
  | 'search/paginator'
  | 'canonical_link'
  | 'concept/images_about'
  | 'concept/images_by'
  | 'concept/images_in'
  | 'images_search_context'
  | 'work_details/images'
  | 'unknown';

export type ItemLinkSource =
  | 'work'
  | 'images_search_result'
  | 'viewer/paginator'
  | 'viewer/thumbnail'
  | 'viewer/scroll'
  | 'viewer/resize'
  | 'manifests_navigation'
  | 'contents_nav'
  | 'search_within_submit'
  | 'search_within_clear'
  | 'search_within_result';

export type WorkLinkSource =
  | 'works_search_result'
  | 'images_search_result'
  | 'item_auth_modal_back_to_work_link'
  | 'archive_tree'
  | 'viewer_back_link'
  | 'viewer_credit';

export type WorksLinkSource =
  | 'search_form'
  | 'canonical_link'
  | 'meta_link'
  | 'search/paginator'
  | 'concept/works_about'
  | 'concept/works_by'
  | 'concept/works_in'
  | 'works_search_context'
  | 'work_details/contributors'
  | 'work_details/genres'
  | 'work_details/subjects'
  | 'work_details/partOf'
  | 'work_details/languages'
  | Prefix<'cancel_filter/'>
  | 'unknown';

export type StoriesLinkSource = 'unknown';
