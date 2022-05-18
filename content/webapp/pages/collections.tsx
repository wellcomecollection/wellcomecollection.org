import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import CollectionsStaticContent from 'components/Body/CollectionsStaticContent';
import { GetServerSideProps } from 'next';
import { FC } from 'react';
import * as page from './page';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  console.log(`collections.getServerSideProps`);

  return page.getServerSideProps({
    ...context,
    query: { id: prismicPageIds.collections },
  });
};

const CollectionsPage: FC<page.Props> = (props: page.Props) => {
  console.log('CollectionsPage');
  const staticContent = <CollectionsStaticContent />;
  console.log(staticContent);
  return <page.Page {...props} staticContent={staticContent} />;
};

export default CollectionsPage;
