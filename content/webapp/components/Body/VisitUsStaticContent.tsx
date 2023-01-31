import { FunctionComponent, ReactNode } from 'react';
import { font, grid } from '@weco/common/utils/classnames';
import FindUs from '@weco/common/views/components/FindUs/FindUs';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import { usePrismicData } from '@weco/common/server-data/Context';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import styled from 'styled-components';

type ContainerProps = {
  children: ReactNode;
};

const Container: FunctionComponent<ContainerProps> = ({ children }) => (
  <SpacingSection>
    <SpacingComponent>
      <div>
        <Layout12>{children}</Layout12>
      </div>
    </SpacingComponent>
  </SpacingSection>
);

const OpeningTimesWrapper = styled.div.attrs({
  className: font('intr', 5),
})`
  float; left;
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
          <div className="flex">
            <OpeningTimesWrapper>
              <h2 className={`${font('intb', 5)} no-margin`}>
                Today’s opening times
              </h2>
              {venues && <OpeningTimes venues={venues} />}
              <Space
                v={{
                  size: 's',
                  properties: ['margin-top'],
                }}
              >
                <a href="/opening-times">Opening times</a>
              </Space>
            </OpeningTimesWrapper>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default VisitUsStaticContent;
