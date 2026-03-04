import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { addDays, today } from '@weco/common/utils/dates';
import { formatIso8601Date } from '@weco/common/utils/format-date';
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
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const serverData = await getServerData(context);

  // We want to show works that have been made available online from 00:01 yesterday
  // as some works require more time to properly build and we got errors in the past
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/12787
  const yesterday = formatIso8601Date(addDays(today(), -1));

  const works = await getWorks({
    params: {
      availabilities: ['online'],
      // Exclude items that are not openly accessible online
      'items.locations.accessConditions.status': [
        '!open-with-advisory',
        '!restricted',
        '!closed',
      ],
      'items.locations.createdDate.to': yesterday,
      sort: 'items.locations.createdDate',
      sortOrder: 'desc',
      page,
    },
    pageSize: 32,
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
