import { NextPage } from 'next';

import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';

const CollectionsPage: NextPage<page.Props> = props => {
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
    params: { siteSection: 'collections' },
  });
};
export default CollectionsPage;
