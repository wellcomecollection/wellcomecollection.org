import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';

import { homepageId } from '@weco/common/data/hardcoded-ids';
import {
  PagesDocument as RawPagesDocument,
  StandfirstSlice as RawStandfirstSlice,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import {
  filterEventsForNext7Days,
  orderEventsByNextAvailableDate,
} from '@weco/content/services/prismic/events';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { transformEventBasic } from '@weco/content/services/prismic/transformers/events';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import { articleLdContentApi } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { getArticles } from '@weco/content/services/wellcome/content/articles';
import { isContentList } from '@weco/content/types/body';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import Homepage, { Props as HomepageProps } from '@weco/content/views';

const Page: FunctionComponent<HomepageProps> = props => {
  return <Homepage {...props} />;
};

type Props = ServerSideProps<HomepageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const client = createClient(context);

  const articlesResponsePromise = getArticles({
    params: {},
    pageSize: 4,
    toggles: serverData.toggles,
  });

  const eventsQueryPromise = fetchEvents(client, {
    period: 'current-and-coming-up',
  });
  const pagePromise = fetchPage(client, homepageId);
  const exhibitionsQueryPromise = fetchExhibitions(client, {
    period: 'next-seven-days',
    order: 'asc',
  });

  const [articlesResponse, exhibitionsQuery, eventsQuery, pageDocument] =
    await Promise.all([
      articlesResponsePromise,
      exhibitionsQueryPromise,
      eventsQueryPromise,
      pagePromise,
    ]);

  // The homepage should always exist in Prismic.
  const page = transformPage(pageDocument as RawPagesDocument);

  const articles =
    articlesResponse.type === 'ResultList' ? articlesResponse.results : [];

  const jsonLd = articles.map(articleLdContentApi);

  const events = transformQuery(eventsQuery, transformEventBasic).results;
  const nextSevenDaysEvents = orderEventsByNextAvailableDate(
    filterEventsForNext7Days(events)
  );

  const exhibitions = transformExhibitionsQuery(exhibitionsQuery).results;

  const untransformedBody = pageDocument?.data.body || [];
  const untransformedStandfirst = untransformedBody.find(
    (slice: prismic.Slice) => slice.slice_type === 'standfirst'
  ) as RawStandfirstSlice | undefined;
  const contentLists = page.untransformedBody.filter(isContentList);

  const headerList = contentLists.length === 2 ? contentLists[0] : null;
  const transformedHeaderList =
    headerList && transformContentListSlice(headerList);
  const headerListIds: Set<string> = transformedHeaderList
    ? new Set(
        transformedHeaderList.value.items.map(v => v.id).filter(isNotUndefined)
      )
    : new Set();

  const contentList =
    contentLists.length === 2 ? contentLists[1] : contentLists[0];
  const transformedContentList =
    contentList && transformContentListSlice(contentList);

  if (events && exhibitions && articles && page) {
    return {
      props: serialiseProps<Props>({
        pageId: page.id,
        articles,
        serverData,
        jsonLd,
        untransformedStandfirst,
        transformedHeaderList,
        transformedContentList,
        // If an exhibition or event appears in the header, we don't want
        // to display it a second time in the list of what's on.
        exhibitions: exhibitions.filter(ex => !headerListIds.has(ex.id)),
        nextSevenDaysEvents: nextSevenDaysEvents.filter(
          ev => !headerListIds.has(ev.id)
        ),
      }),
    };
  } else {
    return { notFound: true };
  }
};

export default Page;
