import { EventDocument } from './types/api';
import {
  ContentApiProps,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';
import { contentQuery } from '.';
import { QueryProps, WellcomeApiError } from '..';

export async function getEvents(
  props: QueryProps<ContentApiProps>
): Promise<ContentResultsList<EventDocument> | WellcomeApiError> {
  const getEventsResult = await contentQuery<ContentApiProps, EventDocument>(
    'events',
    props
  );
  return getEventsResult;
}
