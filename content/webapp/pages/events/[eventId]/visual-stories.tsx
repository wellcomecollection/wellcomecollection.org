import VisualStory, {
  returnVisualStoryProps,
  getOtherVisualStories,
} from '@weco/content/pages/visual-stories/[visualStoryId]';
import { getServerData } from '@weco/common/server-data';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchVisualStories } from '@weco/content/services/prismic/fetch/visual-stories';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { isFilledLinkToDocument } from '@weco/common/services/prismic/types';

export const getServerSideProps = async context => {
  setCacheControl(context.res);
  const client = createClient(context);

  const visualStoriesQuery = await fetchVisualStories(client, {
    hasDelistFilter: false,
  });

  if (!visualStoriesQuery || visualStoriesQuery.results.length === 0) {
    return { notFound: true };
  }

  const visualStoryDocument = visualStoriesQuery.results.find(result => {
    return (
      // TODO once redirects are in place we should only compare with uid
      isFilledLinkToDocument(result.data.relatedDocument) &&
      (result.data.relatedDocument.uid === context.query.eventId ||
        result.data.relatedDocument.id === context.query.eventId)
    );
  });

  if (!visualStoryDocument) {
    return { notFound: true };
  }

  const otherCurrentVisualStories = getOtherVisualStories({
    documentId: context.query.eventId,
    visualStories: visualStoriesQuery.results,
  });

  const serverData = await getServerData(context);

  return returnVisualStoryProps({
    visualStoryDocument,
    otherCurrentVisualStories,
    serverData,
  });
};

export default VisualStory;
