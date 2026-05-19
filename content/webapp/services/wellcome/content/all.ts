import { QueryProps, WellcomeApiError } from '@weco/content/services/wellcome';
import {
  Addressable,
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';
import { FeatureFlags } from '@weco/toggles';

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
  useStaging = false,
}: {
  id: string;
  useStaging?: boolean;
}): Promise<Addressable | WellcomeApiError> {
  // Create minimal toggles object just for this call
  const featureFlags = useStaging
    ? ({ stagingApi: true } as FeatureFlags)
    : undefined;

  const getAddressableResult = await contentDocumentQuery<Addressable>(
    `all/${id}`,
    { featureFlags }
  );

  return getAddressableResult;
}
