import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';

const Page: NextPage<page.Props> = props => {
  return <page.Page {...props} />;
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  const serverData = await getServerData(context);

  return page.getServerSideProps({
    ...context,
    query: {
      pageId: !serverData.toggles.a11yPrototype.value
        ? 'accessibility'
        : 'prototype-a11y-november-2025',
    },
    params: { siteSection: 'visit-us' },
  });
};

export default Page;
