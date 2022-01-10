import { FunctionComponent, ReactNode } from 'react';
import { classNames, font, grid } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import FindUs from '@weco/common/views/components/FindUs/FindUs';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import { clock } from '@weco/common/icons';
import { usePrismicData } from '@weco/common/server-data/Context';
import { parseCollectionVenues } from '@weco/common/services/prismic/opening-times';

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
  const venues = parseCollectionVenues(collectionVenues);

  return (
    <Container>
      <div className="grid">
        <div
          className={classNames({
            [grid({ s: 12, l: 5, xl: 5 })]: true,
            [font('hnr', 4)]: true,
          })}
        >
          <FindUs />
        </div>
        <div
          className={classNames({
            [grid({ s: 12, l: 5, xl: 5 })]: true,
            [font('hnr', 4)]: true,
          })}
        >
          <div className="flex">
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <span className="float-l">
                <Icon icon={clock} />
              </span>
            </Space>
            <div
              className={classNames({
                [font('hnr', 5)]: true,
                'float-l': true,
              })}
            >
              <h2
                className={classNames({
                  [font('hnb', 5)]: true,
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
