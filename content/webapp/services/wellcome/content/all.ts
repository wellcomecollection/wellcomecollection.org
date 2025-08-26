import { QueryProps, WellcomeApiError } from '@weco/content/services/wellcome';
import {
  Addressable,
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';
import { Toggles } from '@weco/toggles';

import { contentDocumentQuery, contentListQuery } from '.';

export async function getAddressables(
  props: QueryProps<ContentApiProps>
): Promise<ContentResultsList<Addressable> | WellcomeApiError> {
  const getAddressablesResult = await contentListQuery<
    ContentApiProps,
    Addressable
  >('all', props);

  return getAddressablesResult;
}

export async function getAddressable({
  id,
  toggles,
}: {
  id: string;
  toggles: Toggles;
}): Promise<Addressable | WellcomeApiError> {
  const getAddressableResult = await contentDocumentQuery<Addressable>(
    `all/${id}`,
    { toggles }
  );

  return getAddressableResult;
}
