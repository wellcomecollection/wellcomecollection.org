import * as prismic from '@prismicio/client';
import VisualStory, {
  returnVisualStoryProps,
} from '@weco/content/pages/visual-stories/[visualStoryId]';
import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchVisualStories } from '@weco/content/services/prismic/fetch/visual-stories';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

export const getServerSideProps = async context => {
  setCacheControl(context.res);
  const client = createClient(context);

  const visualStoriesQuery = await fetchVisualStories(client, {
    filters: [
      prismic.filter.at(
        'my.visual-stories.relatedDocument',
        context.query.eventId
      ),
    ],
    hasDelistFilter: false,
  });

  if (!visualStoriesQuery || visualStoriesQuery.results.length === 0) {
    return { notFound: true };
  }

  // We are assuming for now that there is only one VS per event
  if (!looksLikePrismicId(visualStoriesQuery.results[0].id)) {
    return { notFound: true };
  }

  const serverData = await getServerData(context);

  return returnVisualStoryProps({
    visualStoryDocument: visualStoriesQuery.results[0],
    serverData,
  });
};

export default VisualStory;
