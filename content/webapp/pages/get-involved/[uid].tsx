import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { AppErrorProps } from '@weco/common/services/app';
import * as page from '@weco/content/pages/pages/[pageId]';

const Page: FunctionComponent<page.Props> = props => {
  return <page.Page {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  const { uid } = context.query;

  return page.getServerSideProps({
    ...context,
    query: { pageId: uid },
    params: { siteSection: 'get-involved' },
  });
};

export default Page;
