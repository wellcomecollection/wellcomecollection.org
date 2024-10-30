import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { AppErrorProps } from '@weco/common/services/app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.aboutUs },
    params: { siteSection: 'about-us' },
  });
};

const AboutUs: FunctionComponent<page.Props> = (props: page.Props) => {
  return <page.Page {...props}></page.Page>;
};

export default AboutUs;
