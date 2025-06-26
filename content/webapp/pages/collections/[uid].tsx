import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { AppErrorProps } from '@weco/common/services/app';
import useHotjar from '@weco/content/hooks/useHotjar';
import * as page from '@weco/content/pages/pages/[pageId]';

const CollectionsPage: FunctionComponent<page.Props> = props => {
  useHotjar(true);
  return <page.Page {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  const { uid } = context.query;
  return page.getServerSideProps({
    ...context,
    query: { pageId: uid },
    params: { siteSection: 'collections' },
  });
};
export default CollectionsPage;
