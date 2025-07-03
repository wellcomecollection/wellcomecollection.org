import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import SearchForm from '@weco/common/views/components/SearchForm';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const Page: FunctionComponent<page.Props> = (props: page.Props) => {
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
type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.collections },
    params: { siteSection: 'collections' },
  });
};
export default Page;
