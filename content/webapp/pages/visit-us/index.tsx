import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { usePrismicData } from '@weco/common/server-data/Context';
import { AppErrorProps } from '@weco/common/services/app';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import { font } from '@weco/common/utils/classnames';
import FindUs from '@weco/common/views/components/FindUs';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import OpeningTimes from '@weco/common/views/components/OpeningTimes';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const VisitUsStaticContent: FunctionComponent = () => {
  const { collectionVenues } = usePrismicData();
  const venues = transformCollectionVenues(collectionVenues);

  return (
    <SpacingSection>
      <ContaineredLayout gridSizes={gridSize12()}>
        <Grid>
          <GridCell
            $sizeMap={{
              s: [12],
              l: [5],
              xl: [5],
            }}
          >
            <FindUs />
          </GridCell>
          <GridCell
            $sizeMap={{ s: [12], l: [5], xl: [5] }}
            className={font('intr', 5)}
          >
            <h2 style={{ marginBottom: 0 }} className={font('intb', 5)}>
              Today’s opening times
            </h2>
            <OpeningTimes venues={venues} />
            <Space $v={{ size: 's', properties: ['margin-top'] }}>
              <a href={`/visit-us/${prismicPageIds.openingTimes}`}>
                Opening times
              </a>
            </Space>
          </GridCell>
        </Grid>
      </ContaineredLayout>
    </SpacingSection>
  );
};

const VisitUs: FunctionComponent<page.Props> = props => {
  const staticContent = <VisitUsStaticContent />;

  return <page.Page {...props} staticContent={staticContent} />;
};

export const getServerSideProps: GetServerSideProps<
  page.Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);

  return page.getServerSideProps({
    ...context,
    query: { pageId: prismicPageIds.visitUs },
    params: { siteSection: 'visit-us' },
  });
};

export default VisitUs;
