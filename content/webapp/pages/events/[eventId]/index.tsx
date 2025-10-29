import { NextPage } from 'next';

import { visualStoryLinkText } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchEvent,
  fetchEventScheduleItems,
} from '@weco/content/services/prismic/fetch/events';
import {
  getScheduleIds,
  transformEvent,
} from '@weco/content/services/prismic/transformers/events';
import { eventLd } from '@weco/content/services/prismic/transformers/json-ld';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import EventPage, {
  Props as EventPageProps,
} from '@weco/content/views/pages/events/event';

/**
 * Please note that the /events/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const Page: NextPage<EventPageProps> = props => {
  return <EventPage {...props} />;
};

type Props = ServerSideProps<EventPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const { eventId } = context.query;

  if (!looksLikePrismicId(eventId)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const eventDocument = await fetchEvent(client, eventId as string);

  if (isNotUndefined(eventDocument?.event)) {
    const { event, visualStories } = eventDocument;

    const serverData = await getServerData(context);
    const scheduleIds = getScheduleIds(event);

    const scheduleQuery =
      scheduleIds.length > 0
        ? await fetchEventScheduleItems(client, scheduleIds)
        : undefined;

    const eventDoc = transformEvent(event, scheduleQuery);

    const jsonLd = eventLd(eventDoc);

    const visualStoriesLinks = visualStories?.results.map(visualStory => {
      const url = linkResolver(visualStory);
      return {
        text: visualStoryLinkText,
        url,
        type: 'visual-story',
      };
    });

    return {
      props: serialiseProps<Props>({
        event: eventDoc,
        accessResourceLinks: visualStoriesLinks,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
