import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const Page: NextPage<page.Props> = props => {
  return <page.Page {...props} />;
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.getInvolved },
    params: { siteSection: 'get-involved' },
  });
};

export default Page;
