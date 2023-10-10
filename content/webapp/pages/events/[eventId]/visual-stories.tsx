import * as prismic from '@prismicio/client';
import VisualStory from '@weco/content/pages/visual-stories/[visualStoryId]';
import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchVisualStories,
  fetchVisualStory,
} from '@weco/content/services/prismic/fetch/visual-stories';
import { visualStoryLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformVisualStory } from '@weco/content/services/prismic/transformers/visual-stories';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

export const getServerSideProps = async context => {
  setCacheControl(context.res);
  const client = createClient(context);
  const serverData = await getServerData(context);
  if (!serverData?.toggles?.visualStories?.value) {
    return { notFound: true };
  }

  const visualStoriesQuery = await fetchVisualStories(client, {
    filters: [
      prismic.filter.at(
        'my.visual-stories.related-exhibition',
        context.query.eventId
      ),
    ],
  });

  if (visualStoriesQuery.results.length === 0) {
    return { notFound: true };
  }

  // We are assuming for now that there is only one VS per event
  const visualStoryId = visualStoriesQuery.results[0].id;

  if (!looksLikePrismicId(visualStoryId)) {
    return { notFound: true };
  }

  const visualStoryDocument = await fetchVisualStory(client, visualStoryId);

  if (visualStoryDocument) {
    const visualStory = transformVisualStory(visualStoryDocument);
    const jsonLd = visualStoryLd(visualStory);

    return {
      props: serialiseProps({
        visualStory,
        serverData,
        jsonLd,
        pageview: {
          name: 'visual-story',
          properties: {},
        },
      }),
    };
  } else {
    return { notFound: true };
  }
};

export default VisualStory;
