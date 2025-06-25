import { FunctionComponent } from 'react';

import {
  EventsDocumentData,
  VisualStoriesDocument as RawVisualStoriesDocument,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { isFilledLinkToDocument } from '@weco/common/services/prismic/types';
import { isPast } from '@weco/common/utils/dates';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchVisualStories,
  fetchVisualStory,
} from '@weco/content/services/prismic/fetch/visual-stories';
import {
  getLastEndTime,
  transformEventTimes,
} from '@weco/content/services/prismic/transformers/events';
import { visualStoryLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformVisualStory } from '@weco/content/services/prismic/transformers/visual-stories';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import VisualStoryPage, {
  Props as VisualStoryPageProps,
} from '@weco/content/views/visual-stories/visual-story';

export type Props = VisualStoryPageProps & {
  pageview: Pageview;
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

const VisualStory: FunctionComponent<Props> = (props: VisualStoryPageProps) => {
  return <VisualStoryPage {...props} />;
};

export const getOtherVisualStories = ({
  documentId,
  visualStories,
}: {
  documentId: string;
  visualStories: RawVisualStoriesDocument[];
}): RawVisualStoriesDocument[] => {
  return visualStories.filter(
    // We don't want to include a visual story among the related visual stories, if it is the one being displayed.
    // How do we know if it is the one being displayed?
    // Visual stories can be displayed at one of three urls
    // 1) https://wellcomecollection.org/visual-stories/{visual story id}
    // 2) https://wellcomecollection.org/exhibitions/{exhibition id}/visual-stories
    // 3) https://wellcomecollection.org/events/{event id}/visual-stories
    // We filter out a visual story if its id matches the visual story id in the url
    // OR if it is linked to the same exhibition id or event id in the url (we infer it is the same visual story)
    // We also filter our anything that is linked to a past exhibition or a past event
    result => {
      const relatedDocumentId =
        isFilledLinkToDocument(result.data.relatedDocument) &&
        result.data.relatedDocument.id;
      const exhibitionEndTime =
        isFilledLinkToDocument(result.data.relatedDocument) &&
        result.data.relatedDocument.data?.end
          ? result.data.relatedDocument.data?.end
          : undefined;
      const eventTimes =
        isFilledLinkToDocument(result.data.relatedDocument) &&
        result.data.relatedDocument.data?.times
          ? result.data.relatedDocument.data?.times
          : undefined;
      const transformedEventTimes =
        eventTimes && relatedDocumentId
          ? transformEventTimes(
              relatedDocumentId,
              eventTimes as EventsDocumentData['times']
            )
          : undefined;
      const lastEventEndTime = transformedEventTimes
        ? getLastEndTime(transformedEventTimes)
        : '';
      const endDateToUse = exhibitionEndTime || lastEventEndTime;

      const relatedIsPast = endDateToUse
        ? isPast(new Date(endDateToUse as string))
        : false;
      return (
        (!isFilledLinkToDocument(result.data.relatedDocument) &&
          documentId !== result.id) ||
        (isFilledLinkToDocument(result.data.relatedDocument) &&
          result.data.relatedDocument.id !== documentId &&
          !relatedIsPast)
      );
    }
  );
};

export const returnVisualStoryProps = ({
  visualStoryDocument,
  otherCurrentVisualStories,
  serverData,
}: {
  visualStoryDocument?: RawVisualStoriesDocument;
  otherCurrentVisualStories?: RawVisualStoriesDocument[];
  serverData: SimplifiedServerData;
}) => {
  if (isNotUndefined(visualStoryDocument)) {
    const visualStory = transformVisualStory(visualStoryDocument);
    const visualStories = (
      (otherCurrentVisualStories &&
        otherCurrentVisualStories.map(transformVisualStory)) ||
      []
    )
      .map(story => {
        return {
          type: story.type,
          id: story.id,
          uid: story.uid,
          title: story.title,
          promo: story.promo,
          image: story.image,
          relatedDocument: story.relatedDocument,
        };
      })
      // put the things that aren't linked to events or exhibitions at the front
      .sort(
        (a, b) =>
          (a.relatedDocument ? Number.MAX_VALUE : 1) -
          (b.relatedDocument ? Number.MAX_VALUE : 1)
      );

    const jsonLd = visualStoryLd(visualStory);

    return {
      props: serialiseProps<Props>({
        visualStory,
        visualStories,
        serverData,
        jsonLd,
        pageview: {
          name: 'visual-story',
          properties: {},
        },
      }),
    };
  }

  return { notFound: true };
};

export const getServerSideProps = async context => {
  setCacheControl(context.res);
  const { visualStoryId } = context.query;

  if (!looksLikePrismicId(visualStoryId)) {
    return { notFound: true };
  }

  const serverData = await getServerData(context);
  const client = createClient(context);
  const visualStoryQueryPromise = fetchVisualStory(client, visualStoryId);
  const visualStoriesQueryPromise = fetchVisualStories(client, {
    hasDelistFilter: false,
  });

  const [visualStoryQuery, visualStoriesQuery] = await Promise.all([
    visualStoryQueryPromise,
    visualStoriesQueryPromise,
  ]);

  const otherCurrentVisualStories = getOtherVisualStories({
    documentId: visualStoryId,
    visualStories: visualStoriesQuery.results,
  });

  return returnVisualStoryProps({
    visualStoryDocument: visualStoryQuery,
    otherCurrentVisualStories,
    serverData,
  });
};

export default VisualStory;
