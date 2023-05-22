import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { AppErrorProps } from '@weco/common/services/app';
import { WeAreGoodToGo } from '@weco/common/views/components/CovidIcons/CovidIcons';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import * as page from './pages/[pageId]';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  context.res.setHeader('Cache-Control', 'public');
  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.covidWelcomeBack },
  });
};

const CovidWelcomeBack: FunctionComponent<page.Props> = (props: page.Props) => {
  const postOutroContent = (
    <div style={{ width: '100px' }}>
      <WeAreGoodToGo />
    </div>
  );

  return <page.Page {...props} postOutroContent={postOutroContent} />;
};

export default CovidWelcomeBack;
