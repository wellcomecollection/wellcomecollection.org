import { QueryProps, WellcomeApiError } from '@weco/content/services/wellcome';
import {
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';

import { contentListQuery } from '.';
import { EventDocument } from './types/api';

export async function getEvents(
  props: QueryProps<ContentApiProps>
): Promise<ContentResultsList<EventDocument> | WellcomeApiError> {
  const getEventsResult = await contentListQuery<
    ContentApiProps,
    EventDocument
  >('events', props);
  return getEventsResult;
}
