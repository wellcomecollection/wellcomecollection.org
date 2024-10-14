import { getServerData } from '@weco/common/server-data';
import { isFilledLinkToDocument } from '@weco/common/services/prismic/types';
import VisualStory, {
  getOtherVisualStories,
  returnVisualStoryProps,
} from '@weco/content/pages/visual-stories/[visualStoryId]';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchVisualStories } from '@weco/content/services/prismic/fetch/visual-stories';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

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
      // #11240 once redirects are in place we should only compare with uid
      isFilledLinkToDocument(result.data.relatedDocument) &&
      (result.data.relatedDocument.uid === context.query.exhibitionId ||
        result.data.relatedDocument.id === context.query.exhibitionId)
    );
  });

  if (!visualStoryDocument) {
    return { notFound: true };
  }

  const otherCurrentVisualStories = getOtherVisualStories({
    documentId: context.query.exhibitionId,
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
