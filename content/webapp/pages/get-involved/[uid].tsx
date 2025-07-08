import { NextPage } from 'next';

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
  const { uid } = context.query;

  return page.getServerSideProps({
    ...context,
    query: { pageId: uid },
    params: { siteSection: 'get-involved' },
  });
};

export default Page;
