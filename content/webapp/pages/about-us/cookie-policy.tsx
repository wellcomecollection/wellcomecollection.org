import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { AppErrorProps } from '@weco/common/services/app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CookiePolicyPage from '@weco/content/views/static/cookie-policy';

const Page: FunctionComponent<page.Props> = props => {
  return <CookiePolicyPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);

  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.cookiePolicy },
    params: { siteSection: 'about-us' },
  });
};

export default Page;
