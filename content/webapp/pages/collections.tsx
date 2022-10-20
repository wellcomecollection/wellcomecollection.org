import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { AppErrorProps } from '@weco/common/services/app';
import CollectionsStaticContent from 'components/Body/CollectionsStaticContent';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import * as page from './page';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  return page.getServerSideProps({
    ...context,
    query: { id: prismicPageIds.collections },
  });
};

const CollectionsPage: FunctionComponent<page.Props> = (props: page.Props) => {
  const staticContent = <CollectionsStaticContent />;
  return <page.Page {...props} staticContent={staticContent} />;
};

export default CollectionsPage;
