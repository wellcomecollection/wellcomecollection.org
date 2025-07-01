import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { AppErrorProps } from '@weco/common/services/app';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import SearchForm from '@weco/common/views/components/SearchForm';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.collections },
    params: { siteSection: 'collections' },
  });
};

const CollectionsPage: FunctionComponent<page.Props> = (props: page.Props) => {
  return (
    <page.Page
      {...props}
      staticContent={
        <ContaineredLayout gridSizes={gridSize12()}>
          <SpacingSection>
            <SearchForm searchCategory="works" location="page" />
          </SpacingSection>
        </ContaineredLayout>
      }
    />
  );
};

export default CollectionsPage;
