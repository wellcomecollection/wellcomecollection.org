import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import VisitUsStaticContent from 'components/Body/VisitUsStaticContent';
import { GetServerSideProps } from 'next';
import { FC } from 'react';
import * as page from './page';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  return page.getServerSideProps({
    ...context,
    query: { id: prismicPageIds.visitUs },
  });
};

const VisitUs: FC<page.Props> = (props: page.Props) => {
  const staticContent = <VisitUsStaticContent />;

  return <page.Page {...props} staticContent={staticContent}></page.Page>;
};

export default VisitUs;
