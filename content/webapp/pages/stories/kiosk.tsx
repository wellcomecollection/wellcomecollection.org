import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { fetchSeriesById } from '@weco/content/services/prismic/fetch/series';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import {
  transformSeries,
  transformSeriesToSeriesBasic,
} from '@weco/content/services/prismic/transformers/series';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import KioskStoriesListingPage, {
  Props as KioskStoriesListingPageProps,
} from '@weco/content/views/pages/stories/kiosk';

const Page: NextPage<KioskStoriesListingPageProps> = props => {
  return <KioskStoriesListingPage {...props} />;
};

type Props = ServerSideProps<KioskStoriesListingPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  if (!serverData.toggles.storiesKiosk.value) {
    return { notFound: true };
  }

  const client = createClient(context);

  const pageDocument = await fetchPage(client, 'reading-room-stories');

  if (isNotUndefined(pageDocument)) {
    const page = transformPage(pageDocument);

    const pickingSkinSeries = await fetchSeriesById(
      client,
      'ZlgpmhEAACIAr-YE',
      'series'
    );
    const beautyBoardroomSeries = await fetchSeriesById(
      client,
      'ZS5vzRIAACcAM_SF',
      'series'
    );

    return {
      props: serialiseProps<Props>({
        page,
        hardCodedSeries: [pickingSkinSeries, beautyBoardroomSeries]
          .filter(isNotUndefined)
          .map(doc => transformSeriesToSeriesBasic(transformSeries(doc))),
        serverData,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
