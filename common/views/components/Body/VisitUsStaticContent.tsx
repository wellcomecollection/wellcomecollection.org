import { FunctionComponent, ReactNode, useContext } from 'react';
import { classNames, font, grid } from '@weco/common/utils/classnames';
import Icon from '../Icon/Icon';
import OpeningTimesContext from '../OpeningTimesContext/OpeningTimesContext';
import FindUs from '../FindUs/FindUs';
import SpacingSection from '../SpacingSection/SpacingSection';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
import Space from '../styled/Space';
import Layout12 from '../Layout12/Layout12';
import FooterOpeningTimes from '../FooterOpeningTimes/FooterOpeningTimes';
import { BodyPart } from '../Body/Body';

type ContainerProps = {
  children: ReactNode;
};
const Container: FunctionComponent<ContainerProps> = ({
  children,
}: ContainerProps) => (
  <SpacingSection>
    <SpacingComponent>
      <BodyPart>
        <Layout12>{children}</Layout12>
      </BodyPart>
    </SpacingComponent>
  </SpacingSection>
);

const VisitUsStaticContent: FunctionComponent = () => {
  const openingTimes = useContext(OpeningTimesContext);

  return (
    <Container>
      <div className="grid">
        <div
          className={classNames({
            [grid({ s: 12, l: 5, xl: 5 })]: true,
            [font('hnl', 4)]: true,
          })}
        >
          <FindUs />
        </div>
        <div
          className={classNames({
            [grid({ s: 12, l: 5, xl: 5 })]: true,
            [font('hnl', 4)]: true,
          })}
        >
          <div className="flex">
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <Icon name="clock" extraClasses={`float-l`} />
            </Space>
            <div
              className={classNames({
                [font('hnl', 5)]: true,
                'float-l': true,
              })}
            >
              <h2
                className={classNames({
                  [font('hnm', 5)]: true,
                  'no-margin': true,
                })}
              >{`Today's opening times`}</h2>
              {openingTimes && openingTimes?.collectionOpeningTimes && (
                <FooterOpeningTimes
                  collectionOpeningTimes={openingTimes.collectionOpeningTimes}
                />
              )}
              <Space
                v={{
                  size: 's',
                  properties: ['margin-top'],
                }}
                className={`no-margin`}
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
