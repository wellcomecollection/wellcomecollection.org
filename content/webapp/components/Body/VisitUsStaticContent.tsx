import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { usePrismicData } from '@weco/common/server-data/Context';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import { font, grid } from '@weco/common/utils/classnames';
import FindUs from '@weco/common/views/components/FindUs/FindUs';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';

const Container: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <SpacingSection>
    <SpacingComponent>
      <ContaineredLayout gridSizes={gridSize12()}>{children}</ContaineredLayout>
    </SpacingComponent>
  </SpacingSection>
);

const OpeningTimesWrapper = styled.div.attrs({
  className: font('intr', 5),
})`
  h2 {
    margin-bottom: 0;
  }
`;

const VisitUsStaticContent: FunctionComponent = () => {
  const { collectionVenues } = usePrismicData();
  const venues = transformCollectionVenues(collectionVenues);

  return (
    <Container>
      <div className="grid">
        <div className={`${grid({ s: 12, l: 5, xl: 5 })} ${font('intr', 4)}`}>
          <FindUs />
        </div>
        <div className={`${grid({ s: 12, l: 5, xl: 5 })} ${font('intr', 4)}`}>
          <div style={{ display: 'flex' }}>
            <OpeningTimesWrapper>
              <h2 className={font('intb', 5)}>Today’s opening times</h2>
              <OpeningTimes venues={venues} />
              <Space
                $v={{
                  size: 's',
                  properties: ['margin-top'],
                }}
              >
                <a href={`/${prismicPageIds.openingTimes}`}>Opening times</a>
              </Space>
            </OpeningTimesWrapper>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default VisitUsStaticContent;
