import { NextPage } from 'next';

import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import A11yPrototypePage from '@weco/content/views/pages/about-us/prototype-a11y-november-2025';

const Page: NextPage<page.Props> = props => {
  return <A11yPrototypePage {...props} />;
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);

  return page.getServerSideProps({
    ...context,
    query: { pageId: 'prototype-a11y-november-2025' },
    params: { siteSection: 'about-us' },
  });
};

export default Page;
