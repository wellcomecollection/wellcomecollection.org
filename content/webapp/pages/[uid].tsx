import { NextPage } from 'next';

import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const Page: NextPage<page.Props> = (props: page.Props) => {
  return <page.Page {...props} />;
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);

  return page.getServerSideProps({
    ...context,
    query: { pageId: context.query.uid },
    params: { siteSection: 'orphan' },
  });
};

export default Page;
