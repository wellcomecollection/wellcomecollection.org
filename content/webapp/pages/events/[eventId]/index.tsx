import { GetServerSideProps, NextPage } from 'next';

import { visualStoryLinkText } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
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
} from '@weco/content/views/events/event';

type Props = EventPageProps & {
  pageview: Pageview;
  gaDimensions: GaDimensions;
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

/**
 * Please note that the /events/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const Page: NextPage<Props> = (props: EventPageProps) => {
  return <EventPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
        gaDimensions: {
          partOf: eventDoc.seasons
            .map(season => season.id)
            .concat(eventDoc.series.map(series => series.id)),
        },
        pageview: {
          name: 'event',
          properties: {},
        },
      }),
    };
  }

  return { notFound: true };
};

export default Page;
