import { QueryProps, WellcomeApiError } from '@weco/content/services/wellcome';
import {
  Addressable,
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';

import { contentListQuery } from '.';

export async function getAddressables(
  props: QueryProps<ContentApiProps>
): Promise<ContentResultsList<Addressable> | WellcomeApiError> {
  const getAddressablesResult = await contentListQuery<
    ContentApiProps,
    Addressable
  >('all', props);

  return getAddressablesResult;
}
