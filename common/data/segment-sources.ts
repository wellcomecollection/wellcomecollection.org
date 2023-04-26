import { Prefix } from '@weco/common/utils/utility-types';

export type ImageLinkSource = 'images_search_result' | 'viewer/paginator';

export type ImagesLinkSource =
  | 'search/paginator'
  | 'canonical_link'
  | 'concept/images_about'
  | 'concept/images_by'
  | 'images_search_context'
  | 'work_details/images'
  | 'unknown';

export type ItemLinkSource =
  | 'work'
  | 'images_search_result'
  | 'viewer/paginator'
  | 'manifests_navigation'
  | 'search_within_result';

export type WorkLinkSource =
  | 'works_search_result'
  | 'images_search_result'
  | 'item_auth_modal_back_to_work_link'
  | 'archive_tree'
  | 'viewer_back_link'
  | 'viewer_credit'
  | 'download_credit';

export type WorksLinkSource =
  | 'search_form'
  | 'canonical_link'
  | 'meta_link'
  | 'search/paginator'
  | 'concept/works_about'
  | 'concept/works_by'
  | 'works_search_context'
  | 'work_details/contributors'
  | 'work_details/genres'
  | 'work_details/subjects'
  | 'work_details/partOf'
  | Prefix<'cancel_filter/'>
  | 'unknown';
