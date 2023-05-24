import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { AppErrorProps } from '@weco/common/services/app';
import VisitUsStaticContent from '@weco/content/components/Body/VisitUsStaticContent';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import * as page from './pages/[pageId]';
import { setCacheControl } from '@weco/common/utils/setCacheControl';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.visitUs },
  });
};

const VisitUs: FunctionComponent<page.Props> = (props: page.Props) => {
  const staticContent = <VisitUsStaticContent />;

  return <page.Page {...props} staticContent={staticContent}></page.Page>;
};

export default VisitUs;
