import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CookiePolicyPage from '@weco/content/views/about-us/cookie-policy';

const Page: FunctionComponent<page.Props> = props => {
  return <CookiePolicyPage {...props} />;
};
type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);

  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.cookiePolicy },
    params: { siteSection: 'about-us' },
  });
};

export default Page;
