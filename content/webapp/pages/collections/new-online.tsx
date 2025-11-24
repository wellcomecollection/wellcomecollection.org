import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { toWorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import NewOnlinePage, {
  Props as NewOnlinePageProps,
} from '@weco/content/views/pages/collections/new-online';

const Page: NextPage<NewOnlinePageProps> = props => {
  return <NewOnlinePage {...props} />;
};

type Props = ServerSideProps<NewOnlinePageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const page = getPage(context.query); // ???

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const serverData = await getServerData(context);

  if (!serverData.toggles.newOnlineListingPage?.value) {
    return {
      notFound: true,
    };
  }

  const works = await getWorks({
    params: {
      availabilities: ['online'],
      'items.locations.accessConditions.status': 'open',
      page,
    },
    pageSize: 12,
    toggles: serverData.toggles,
  });

  if (works.type === 'Error') {
    return appError(
      context,
      works.httpStatus,
      works.description || works.label
    );
  }

  return {
    props: serialiseProps<Props>({
      works: {
        ...works,
        results: works.results.map(toWorkBasic),
      },
      serverData,
      apiToolbarLinks: [
        {
          id: 'catalogue-api',
          label: 'Catalogue API query',
          link: works._requestUrl,
        },
      ],
    }),
  };
};

export default Page;
