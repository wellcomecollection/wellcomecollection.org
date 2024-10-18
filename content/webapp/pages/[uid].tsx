import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { AppErrorProps } from '@weco/common/services/app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  return page.getServerSideProps({
    ...context,
    query: { pageId: context.query.uid },
  });
};

const orphanPage: FunctionComponent<page.Props> = (props: page.Props) => {
  return <page.Page {...props}></page.Page>;
};

export default orphanPage;
