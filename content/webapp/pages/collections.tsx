import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { AppErrorProps } from '@weco/common/services/app';
import CollectionsStaticContent from '@weco/content/components/Body/CollectionsStaticContent';
import useHotjar from '@weco/content/hooks/useHotjar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

import * as page from './pages/[pageId]';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.collections },
  });
};

const CollectionsPage: FunctionComponent<page.Props> = (props: page.Props) => {
  useHotjar(true);
  const staticContent = <CollectionsStaticContent />;

  return (
    <page.Page
      {...props}
      staticContent={staticContent}
      vanityUid="collections"
    />
  );
};

export default CollectionsPage;
