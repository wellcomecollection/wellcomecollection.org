import {
  ApiEnvironmentOverride,
  QueryProps,
  WellcomeApiError,
} from '@weco/content/services/wellcome';
import {
  Addressable,
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';

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
  apiEnvironment,
}: {
  id: string;
  apiEnvironment?: ApiEnvironmentOverride;
}): Promise<Addressable | WellcomeApiError> {
  const getAddressableResult = await contentDocumentQuery<Addressable>(
    `all/${id}`,
    { apiEnvironment }
  );

  return getAddressableResult;
}
