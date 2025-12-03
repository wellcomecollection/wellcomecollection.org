import { NextPage } from 'next';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { usePrismicData } from '@weco/common/server-data/Context';
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
import Page, { Props as PageProps } from '@weco/content/pages/pages/[pageId]';

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
            className={font('sans', -1)}
          >
            <h2 style={{ marginBottom: 0 }} className={font('sans-bold', -1)}>
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

const VisitUsPage: NextPage<PageProps> = props => {
  const staticContent = <VisitUsStaticContent />;

  return <Page {...props} staticContent={staticContent} />;
};

export default VisitUsPage;
