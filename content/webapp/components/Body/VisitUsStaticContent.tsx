import { FunctionComponent, ReactNode } from 'react';
import { classNames, font, grid } from '@weco/common/utils/classnames';
import FindUs from '@weco/common/views/components/FindUs/FindUs';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import { usePrismicData } from '@weco/common/server-data/Context';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';

type ContainerProps = {
  children: ReactNode;
};
const Container: FunctionComponent<ContainerProps> = ({
  children,
}: ContainerProps) => (
  <SpacingSection>
    <SpacingComponent>
      <div>
        <Layout12>{children}</Layout12>
      </div>
    </SpacingComponent>
  </SpacingSection>
);

const VisitUsStaticContent: FunctionComponent = () => {
  const { collectionVenues } = usePrismicData();
  const venues = transformCollectionVenues(collectionVenues);

  return (
    <Container>
      <div className="grid">
        <div
          className={classNames({
            [grid({ s: 12, l: 5, xl: 5 })]: true,
            [font('intr', 4)]: true,
          })}
        >
          <FindUs />
        </div>
        <div
          className={classNames({
            [grid({ s: 12, l: 5, xl: 5 })]: true,
            [font('intr', 4)]: true,
          })}
        >
          <div className="flex">
            <div
              className={classNames({
                [font('intr', 5)]: true,
                'float-l': true,
              })}
            >
              <h2
                className={classNames({
                  [font('intb', 5)]: true,
                  'no-margin': true,
                })}
              >{`Today's opening times`}</h2>
              {venues && <OpeningTimes venues={venues} />}
              <Space
                v={{
                  size: 's',
                  properties: ['margin-top'],
                }}
              >
                <a href="/opening-times">Opening times</a>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default VisitUsStaticContent;
